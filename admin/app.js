const SESSION_KEY = 'hoperise_session';

function getSession() {
    try {
        return JSON.parse(localStorage.getItem(SESSION_KEY)) || JSON.parse(sessionStorage.getItem(SESSION_KEY)) || null;
    } catch (e) {
        return null;
    }
}

function requireAdmin() {
    const session = getSession();

    if (!session) {
        window.location.href = '../login/login.html?role=admin';
        return null;
    }

    if (session.role !== 'admin') {
        window.location.href = '../login/login.html?error=unauthorized';
        return null;
    }

    return session;
}

document.addEventListener('DOMContentLoaded', () => {
    const session = requireAdmin();
    if (!session) return;

    initAdminProfile(session);
    initSidebar();
    initNavigation();
    initNotifications();
    initUserDropdown(session);
    initModals();
    initForms();
    initSearch();
    initFilters();
    initUploadArea();
    initTableFeatures();
});

/* ========== ADMIN PROFILE ========== */
function initAdminProfile(session) {
    const profileImg = document.getElementById('userProfile').querySelector('img');
    const profileName = document.getElementById('userProfile').querySelector('span');
    const dropdownImg = document.getElementById('userDropdown').querySelector('.dropdown-header img');
    const dropdownName = document.getElementById('userDropdown').querySelector('.dropdown-header strong');
    const dropdownEmail = document.getElementById('userDropdown').querySelector('.dropdown-header span');

    const displayName = session.name || 'Admin User';
    const displayEmail = session.email || 'admin@hoperise.org';

    profileImg.src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(displayName) + '&background=4f46e5&color=fff';
    profileName.textContent = displayName;
    dropdownImg.src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(displayName) + '&background=4f46e5&color=fff';
    dropdownName.textContent = displayName;
    dropdownEmail.textContent = displayEmail;
}

/* ========== SIDEBAR ========== */
function initSidebar() {
    const sidebar = document.getElementById('sidebar');
    const menuToggle = document.getElementById('menuToggle');
    const sidebarClose = document.getElementById('sidebarClose');

    menuToggle.addEventListener('click', () => {
        sidebar.classList.toggle('open');
    });

    sidebarClose.addEventListener('click', () => {
        sidebar.classList.remove('open');
    });

    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 992 && sidebar.classList.contains('open') &&
            !sidebar.contains(e.target) && !menuToggle.contains(e.target)) {
            sidebar.classList.remove('open');
        }
    });
}

/* ========== NAVIGATION ========== */
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link[data-section]');
    const sections = document.querySelectorAll('.content-section');
    const pageTitle = document.getElementById('pageTitle');

    const titles = {
        dashboard: 'Dashboard',
        programs: 'Programs & Initiatives',
        donors: 'Donor Management',
        events: 'Event Management',
        team: 'Our Team',
        volunteers: 'Volunteer Management',
        gallery: 'Photo Gallery',
        settings: 'Settings'
    };

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const section = link.dataset.section;

            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');

            sections.forEach(s => s.classList.remove('active'));
            const target = document.getElementById('section-' + section);
            if (target) {
                target.classList.add('active');
            }

            pageTitle.textContent = titles[section] || 'Dashboard';

            if (window.innerWidth <= 992) {
                document.getElementById('sidebar').classList.remove('open');
            }

            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });

    // View All links
    document.querySelectorAll('.view-all[data-goto]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetSection = link.dataset.goto;
            const navLink = document.querySelector(`.nav-link[data-section="${targetSection}"]`);
            if (navLink) navLink.click();
        });
    });
}

/* ========== NOTIFICATIONS ========== */
function initNotifications() {
    const notifBtn = document.getElementById('notifBtn');
    const notifPanel = document.getElementById('notifPanel');
    const clearNotifs = document.getElementById('clearNotifs');

    notifBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        notifPanel.classList.toggle('show');
        document.getElementById('userDropdown').classList.remove('show');
    });

    clearNotifs.addEventListener('click', () => {
        const items = notifPanel.querySelectorAll('.notif-item');
        items.forEach(item => item.remove());
        document.querySelector('.badge').textContent = '0';
        notifPanel.classList.remove('show');
        showToast('Notifications cleared', 'success');
    });

    document.addEventListener('click', (e) => {
        if (!notifPanel.contains(e.target) && !notifBtn.contains(e.target)) {
            notifPanel.classList.remove('show');
        }
    });
}

/* ========== USER DROPDOWN ========== */
function initUserDropdown(session) {
    const userProfile = document.getElementById('userProfile');
    const userDropdown = document.getElementById('userDropdown');

    userProfile.addEventListener('click', (e) => {
        e.stopPropagation();
        userDropdown.classList.toggle('show');
        document.getElementById('notifPanel').classList.remove('show');
    });

    document.addEventListener('click', (e) => {
        if (!userDropdown.contains(e.target) && !userProfile.contains(e.target)) {
            userDropdown.classList.remove('show');
        }
    });

    userDropdown.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            userDropdown.classList.remove('show');
            const text = link.textContent.trim();

            if (text === 'Account Settings') {
                const settingsLink = document.querySelector('.nav-link[data-section="settings"]');
                if (settingsLink) settingsLink.click();
            } else if (text === 'Logout') {
                if (confirm('Are you sure you want to logout?')) {
                    localStorage.removeItem(SESSION_KEY);
                    sessionStorage.removeItem(SESSION_KEY);
                    window.location.href = '../login/login.html?logout=1';
                }
            } else if (text === 'My Profile') {
                showToast('Admin: ' + (session ? session.email : 'admin@hoperise.org'), 'info');
            } else if (text === 'Help Center') {
                showToast('Contact support at support@hoperise.org', 'info');
            }
        });
    });
}

/* ========== MODALS ========== */
function initModals() {
    document.querySelectorAll('.modal-overlay').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('show');
            }
        });
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal-overlay.show').forEach(m => m.classList.remove('show'));
        }
    });
}

function openModal(id) {
    const modal = document.getElementById(id);
    if (modal) modal.classList.add('show');
}

function closeModal(id) {
    const modal = document.getElementById(id);
    if (modal) modal.classList.remove('show');
}

/* ========== FORMS ========== */
let editingDonorRow = null;

function initForms() {
    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const formId = form.id;

            if (formId === 'addDonorForm') {
                handleDonorFormSubmit();
                return;
            }

            const modal = form.closest('.modal-overlay');
            if (modal) {
                modal.classList.remove('show');
            }

            const messages = {
                addEventForm: 'Event created successfully!',
                addProgramForm: 'Program added successfully!',
                addTeamForm: 'Team member added successfully!',
                addVolunteerForm: 'Volunteer added successfully!',
                addPhotoForm: 'Photo uploaded successfully!'
            };

            showToast(messages[formId] || 'Action completed!', 'success');
            form.reset();
        });
    });
}

function handleDonorFormSubmit() {
    const firstName = document.getElementById('donorFirstName').value.trim();
    const lastName = document.getElementById('donorLastName').value.trim();
    const mobile = document.getElementById('donorPhone').value.trim();
    const amount = document.getElementById('donorAmount').value.trim();
    const type = document.getElementById('donorType').value;
    const program = document.getElementById('donorProgram').value;
    const status = document.getElementById('donorStatus').value;
    const notes = document.getElementById('donorNotes').value.trim();

    const fullName = (firstName + ' ' + lastName).trim();
    const amountINR = '₹' + Number(amount).toLocaleString('en-IN');

    const avatar = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(fullName) + '&background=4f46e5&color=fff';

    const statusClass = status === 'Pending' ? 'pending' : 'completed';
    const typeClass = type.toLowerCase().replace(/\s+/g, '-');
    const today = new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });

    if (editingDonorRow) {
        // Update existing row
        const row = editingDonorRow;
        row.querySelector('.donor-cell img').src = avatar;
        row.querySelector('.donor-cell img').alt = fullName;
        row.querySelector('.donor-cell span').textContent = fullName;
        row.cells[2].textContent = mobile;
        row.querySelector('.amount').textContent = amountINR;
        const typeBadge = row.querySelector('.badge-pill');
        typeBadge.className = 'badge-pill ' + typeClass;
        typeBadge.textContent = type;
        row.dataset.program = program;
        row.dataset.notes = notes;

        showToast(`${fullName} updated successfully!`, 'success');
        editingDonorRow = null;
        document.getElementById('donorSubmitBtn').textContent = 'Add Donor';
        document.querySelector('#addDonorModal .modal-header h3').textContent = 'Add New Donor';
    } else {
        // Append new row
        const table = document.querySelector('#donorTable tbody');
        const tr = document.createElement('tr');
        tr.dataset.program = program;
        tr.dataset.notes = notes;
        tr.innerHTML = `
            <td><input type="checkbox" class="row-check"></td>
            <td>
                <div class="donor-cell">
                    <img src="${avatar}" alt="">
                    <span>${fullName}</span>
                </div>
            </td>
            <td>${mobile}</td>
            <td class="amount">${amountINR}</td>
            <td><span class="badge-pill ${typeClass}">${type}</span></td>
            <td>${today}</td>
            <td><span class="badge-pill ${statusClass}">${status}</span></td>
            <td>
                <div class="action-btns">
                    <button class="action-btn" title="View"><i class="fas fa-eye"></i></button>
                    <button class="action-btn" title="Edit"><i class="fas fa-pen"></i></button>
                    <button class="action-btn delete" title="Delete"><i class="fas fa-trash"></i></button>
                </div>
            </td>
        `;
        table.appendChild(tr);

        // Update pagination count
        const pagination = document.querySelector('.table-pagination span');
        if (pagination) {
            const match = pagination.textContent.match(/of (\d+)/);
            if (match) {
                pagination.textContent = pagination.textContent.replace(match[1], (parseInt(match[1]) + 1));
            }
        }

        bindRowActions(tr.querySelectorAll('.action-btn'));

        showToast(`${fullName} added successfully!`, 'success');
    }

    document.getElementById('addDonorForm').reset();
    closeModal('addDonorModal');
}

/* ========== SEARCH ========== */
function initSearch() {
    const globalSearch = document.getElementById('globalSearch');
    globalSearch.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        if (query.length < 2) return;
        showToast(`Searching for "${query}"...`, 'info');
    });

    // Donor table search
    const donorSearch = document.getElementById('donorSearch');
    if (donorSearch) {
        donorSearch.addEventListener('input', (e) => {
            filterTable('donorTable', e.target.value);
        });
    }

    // Volunteer table search
    const volunteerSearch = document.getElementById('volunteerSearch');
    if (volunteerSearch) {
        volunteerSearch.addEventListener('input', (e) => {
            filterTable('volunteerTable', e.target.value);
        });
    }
}

function filterTable(tableId, query) {
    const table = document.getElementById(tableId);
    if (!table) return;
    const rows = table.querySelectorAll('tbody tr');
    const q = query.toLowerCase();

    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(q) ? '' : 'none';
    });
}

/* ========== FILTERS ========== */
function initFilters() {
    // Program filters
    document.querySelectorAll('.filter-bar .filter-pill').forEach(pill => {
        pill.addEventListener('click', () => {
            document.querySelectorAll('.filter-bar .filter-pill').forEach(p => p.classList.remove('active'));
            pill.classList.add('active');

            const filter = pill.dataset.filter;
            document.querySelectorAll('.program-card').forEach(card => {
                if (filter === 'all' || card.dataset.category === filter) {
                    card.style.display = '';
                    card.style.animation = 'fadeIn 0.4s ease';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // Gallery filters
    document.querySelectorAll('.gallery-filter .filter-pill').forEach(pill => {
        pill.addEventListener('click', () => {
            document.querySelectorAll('.gallery-filter .filter-pill').forEach(p => p.classList.remove('active'));
            pill.classList.add('active');

            const filter = pill.dataset.gfilter;
            document.querySelectorAll('.gallery-item').forEach(item => {
                if (filter === 'all' || item.dataset.gcat === filter) {
                    item.style.display = '';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });

    // Donor type filter
    const donorFilter = document.getElementById('donorFilter');
    if (donorFilter) {
        donorFilter.addEventListener('change', (e) => {
            const type = e.target.value.toLowerCase();
            const rows = document.querySelectorAll('#donorTable tbody tr');

            rows.forEach(row => {
                if (type === 'all') {
                    row.style.display = '';
                } else {
                    const badge = row.querySelector('.badge-pill')?.textContent.toLowerCase();
                    const isMajor = parseFloat(row.querySelector('.amount')?.textContent.replace(/[₹$,]/g, '')) >= 5000;
                    if (type === 'major') {
                        row.style.display = isMajor ? '' : 'none';
                    } else {
                        row.style.display = badge && badge.includes(type) ? '' : 'none';
                    }
                }
            });
        });
    }
}

/* ========== UPLOAD AREA ========== */
function initUploadArea() {
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('fileInput');

    if (!uploadArea || !fileInput) return;

    uploadArea.addEventListener('click', () => fileInput.click());

    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = '#4f46e5';
        uploadArea.style.background = '#f5f3ff';
    });

    uploadArea.addEventListener('dragleave', () => {
        uploadArea.style.borderColor = '';
        uploadArea.style.background = '';
    });

    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = '';
        uploadArea.style.background = '';

        const files = e.dataTransfer.files;
        if (files.length) {
            handleFileUpload(files[0]);
        }
    });

    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length) {
            handleFileUpload(e.target.files[0]);
        }
    });
}

function handleFileUpload(file) {
    if (!file.type.startsWith('image/')) {
        showToast('Please upload an image file', 'error');
        return;
    }

    if (file.size > 10 * 1024 * 1024) {
        showToast('File size must be less than 10MB', 'error');
        return;
    }

    const uploadArea = document.getElementById('uploadArea');
    uploadArea.innerHTML = `
        <i class="fas fa-check-circle" style="color: #16a34a;"></i>
        <h4>${file.name}</h4>
        <p>${(file.size / 1024 / 1024).toFixed(2)} MB</p>
    `;
    showToast('File ready for upload', 'success');
}

/* ========== TABLE FEATURES ========== */
function initTableFeatures() {
    const selectAll = document.getElementById('selectAll');
    if (selectAll) {
        selectAll.addEventListener('change', (e) => {
            document.querySelectorAll('.row-check').forEach(cb => {
                cb.checked = e.target.checked;
            });
        });
    }

    // Export button
    const exportBtn = document.getElementById('exportDonors');
    if (exportBtn) {
        exportBtn.addEventListener('click', () => {
            exportTableToCSV('donors_export.csv');
        });
    }

    // Action buttons
    bindRowActions(document.querySelectorAll('.action-btn'));
}

function getDonorRowData(row) {
    const name = row.querySelector('.donor-cell span')?.textContent?.trim() || '';
    const mobile = row.cells[2]?.textContent?.trim() || '';
    const amount = row.querySelector('.amount')?.textContent?.trim() || '₹0';
    const typeBadge = row.querySelector('.badge-pill');
    const type = typeBadge?.textContent?.trim() || '';
    const date = row.cells[5]?.textContent?.trim() || '';
    const status = row.cells[6]?.textContent?.trim() || '';
    const avatar = row.querySelector('.donor-cell img')?.src || '';
    const program = row.dataset.program || 'General Fund';
    const notes = row.dataset.notes || 'No notes available.';

    return { name, mobile, amount, type, date, status, avatar, program, notes };
}

function bindRowActions(buttons) {
    buttons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const icon = btn.querySelector('i');
            const row = btn.closest('tr');
            if (!row) return;

            if (icon.classList.contains('fa-trash')) {
                handleDeleteDonor(row);
            } else if (icon.classList.contains('fa-eye')) {
                handleViewDonor(row);
            } else if (icon.classList.contains('fa-pen')) {
                handleEditDonor(row);
            }
        });
    });
}

function handleDeleteDonor(row) {
    const name = row.querySelector('.donor-cell span')?.textContent?.trim() || 'this record';
    if (!confirm(`Are you sure you want to delete ${name}?`)) return;

    row.style.opacity = '0';
    row.style.transform = 'translateX(-20px)';
    setTimeout(() => {
        row.remove();
        const pagination = document.querySelector('.table-pagination span');
        if (pagination) {
            const match = pagination.textContent.match(/of (\d+)/);
            if (match && parseInt(match[1]) > 0) {
                pagination.textContent = pagination.textContent.replace(match[1], (parseInt(match[1]) - 1));
            }
        }
        showToast(`${name} deleted`, 'success');
    }, 300);
}

function handleViewDonor(row) {
    const data = getDonorRowData(row);

    document.getElementById('viewDonorAvatar').src = data.avatar;
    document.getElementById('viewDonorAvatar').alt = data.name;
    document.getElementById('viewDonorName').textContent = data.name;
    document.getElementById('viewDonorMobile').textContent = data.mobile;
    document.getElementById('viewDonorAmount').textContent = data.amount;
    document.getElementById('viewDonorProgram').textContent = data.program;
    document.getElementById('viewDonorDate').textContent = data.date;
    document.getElementById('viewDonorStatus').textContent = data.status;
    document.getElementById('viewDonorNotes').textContent = data.notes;

    const typeBadge = document.getElementById('viewDonorType');
    const typeClass = data.type.toLowerCase().replace(/\s+/g, '-');
    typeBadge.className = 'badge-pill ' + typeClass;
    typeBadge.textContent = data.type;

    // Edit from view modal
    document.getElementById('viewDonorEditBtn').onclick = () => {
        closeModal('viewDonorModal');
        handleEditDonor(row);
    };

    openModal('viewDonorModal');
}

function handleEditDonor(row) {
    const data = getDonorRowData(row);
    const nameParts = data.name.split(' ');

    document.getElementById('donorFirstName').value = nameParts[0] || '';
    document.getElementById('donorLastName').value = nameParts.slice(1).join(' ') || '';
    document.getElementById('donorPhone').value = data.mobile;
    document.getElementById('donorAmount').value = data.amount.replace(/[₹,]/g, '');
    document.getElementById('donorType').value = data.type;
    document.getElementById('donorStatus').value = data.status || 'Completed';

    // Match program from known list
    const programSelect = document.getElementById('donorProgram');
    const programMatch = Array.from(programSelect.options).find(o =>
        o.textContent.toLowerCase().includes(data.program.toLowerCase()) && data.program !== 'General Fund'
    );
    programSelect.value = programMatch ? programMatch.value : 'General Fund';

    document.getElementById('donorNotes').value = row.dataset.notes && row.dataset.notes !== 'No notes available.'
        ? row.dataset.notes : '';

    document.querySelector('#addDonorModal .modal-header h3').textContent = 'Edit Donor';
    document.getElementById('donorSubmitBtn').textContent = 'Save Changes';
    editingDonorRow = row;
    openModal('addDonorModal');
}

function exportTableToCSV(filename) {
    const table = document.getElementById('donorTable');
    if (!table) return;

    let csv = [];
    const rows = table.querySelectorAll('tr');

    rows.forEach(row => {
        const cols = row.querySelectorAll('th, td');
        const rowData = [];
        cols.forEach((col, i) => {
            if (i === 0 && col.querySelector('input')) return; // skip checkbox
            if (i === cols.length - 1) return; // skip actions
            let text = col.textContent.trim().replace(/"/g, '""');
            rowData.push('"' + text + '"');
        });
        csv.push(rowData.join(','));
    });

    const blob = new Blob([csv.join('\n')], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();

    showToast('Donors exported successfully', 'success');
}

/* ========== TOASTS ========== */
function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        info: 'fa-info-circle'
    };

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <i class="fas ${icons[type]}"></i>
        <span>${message}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 4000);
}
