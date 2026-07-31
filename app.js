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
        window.location.href = 'login.html?role=admin';
        return null;
    }

    if (session.role !== 'admin') {
        window.location.href = 'login.html?error=unauthorized';
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
    initCharts();
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
                    window.location.href = 'login.html?logout=1';
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
function initForms() {
    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const formId = form.id;

            const modal = form.closest('.modal-overlay');
            if (modal) {
                modal.classList.remove('show');
            }

            const messages = {
                addDonorForm: 'Donor added successfully!',
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

/* ========== INDIAN FORMATTING ========== */
function formatINR(value) {
    return '₹' + Number(value).toLocaleString('en-IN');
}

/* ========== CHARTS ========== */
function initCharts() {
    initDonationChart();
    initAllocationChart();
}

function initDonationChart() {
    const ctx = document.getElementById('donationChart');
    if (!ctx) return;

    const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    new Chart(ctx, {
        type: 'line',
        data: {
            labels,
            datasets: [
                {
                    label: 'Donations',
                    data: [18500, 22300, 19800, 28400, 24600, 31200, 29800, 35400, 32100, 38900, 42300, 45600],
                    borderColor: '#4f46e5',
                    backgroundColor: 'rgba(79, 70, 229, 0.08)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 4,
                    pointBackgroundColor: '#4f46e5',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                },
                {
                    label: 'Expenses',
                    data: [12000, 15200, 13800, 18400, 16600, 20200, 19800, 23400, 21100, 25900, 28300, 30600],
                    borderColor: '#db2777',
                    backgroundColor: 'rgba(219, 39, 119, 0.05)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 4,
                    pointBackgroundColor: '#db2777',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    align: 'end',
                    labels: {
                        usePointStyle: true,
                        pointStyle: 'circle',
                        padding: 20,
                        font: { size: 12 }
                    }
                },
                tooltip: {
                    backgroundColor: '#1e293b',
                    titleFont: { size: 13 },
                    bodyFont: { size: 12 },
                    padding: 12,
                    cornerRadius: 8,
                    displayColors: true,
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': ' + formatINR(context.parsed.y);
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: { display: false },
                    ticks: { font: { size: 12 }, color: '#94a3b8' }
                },
                y: {
                    grid: { color: '#f1f5f9' },
                    ticks: {
                        font: { size: 12 },
                        color: '#94a3b8',
                        callback: function(value) {
                            return '₹' + (value / 1000) + 'K';
                        }
                    }
                }
            },
            interaction: {
                intersect: false,
                mode: 'index'
            }
        }
    });
}

function initAllocationChart() {
    const ctx = document.getElementById('allocationChart');
    if (!ctx) return;

    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Education', 'Healthcare', 'Environment', 'Community', 'Administration'],
            datasets: [{
                data: [35, 25, 20, 15, 5],
                backgroundColor: ['#4f46e5', '#16a34a', '#d97706', '#db2777', '#94a3b8'],
                borderWidth: 0,
                hoverOffset: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '65%',
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        usePointStyle: true,
                        pointStyle: 'circle',
                        padding: 16,
                        font: { size: 12 }
                    }
                },
                tooltip: {
                    backgroundColor: '#1e293b',
                    titleFont: { size: 13 },
                    bodyFont: { size: 12 },
                    padding: 12,
                    cornerRadius: 8,
                    callbacks: {
                        label: function(context) {
                            return context.label + ': ' + context.parsed + '%';
                        }
                    }
                }
            }
        }
    });

    // Chart filter buttons
    document.querySelectorAll('.chart-filter .filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.chart-filter .filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            showToast(`Showing ${btn.dataset.range} data`, 'info');
        });
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
    document.querySelectorAll('.action-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const icon = btn.querySelector('i');
            const row = btn.closest('tr');
            const name = row.querySelector('.donor-cell span')?.textContent || row.querySelector('.donor-cell')?.textContent?.trim();

            if (icon.classList.contains('fa-trash')) {
                if (confirm(`Are you sure you want to delete ${name || 'this record'}?`)) {
                    row.style.opacity = '0';
                    row.style.transform = 'translateX(-20px)';
                    setTimeout(() => row.remove(), 300);
                    showToast(`${name || 'Record'} deleted`, 'success');
                }
            } else if (icon.classList.contains('fa-eye')) {
                showToast(`Viewing ${name || 'record'} details`, 'info');
            } else if (icon.classList.contains('fa-pen')) {
                showToast(`Editing ${name || 'record'}`, 'info');
            }
        });
    });
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
