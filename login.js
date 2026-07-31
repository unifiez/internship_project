/* ========== AUTH CONFIG ========== */
const ADMIN_CREDENTIALS = {
    email: 'admin@hoperise.org',
    password: 'admin123',
    name: 'Admin User'
};

const USER_STORAGE_KEY = 'hoperise_users';
const SESSION_KEY = 'hoperise_session';

/* ========== UTILITIES ========== */
function getUsers() {
    try {
        return JSON.parse(localStorage.getItem(USER_STORAGE_KEY)) || [];
    } catch (e) {
        return [];
    }
}

function saveUsers(users) {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(users));
}

function setSession(session) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

function getSession() {
    try {
        return JSON.parse(localStorage.getItem(SESSION_KEY)) || null;
    } catch (e) {
        return null;
    }
}

function clearSession() {
    localStorage.removeItem(SESSION_KEY);
}

function capitalizeName(name) {
    return name.trim().replace(/\s+/g, ' ').split(' ').map(word =>
        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join(' ');
}

function isValidName(name) {
    return /^[A-Za-z][A-Za-z\s.'-]{1,49}$/.test(name.trim());
}

function isValidMobile(mobile) {
    const digits = mobile.replace(/\D/g, '');
    const cleaned = digits.startsWith('91') && digits.length === 12 ? digits.slice(2) : digits;
    return /^[6-9]\d{9}$/.test(cleaned);
}

function formatMobile(mobile) {
    const digits = mobile.replace(/\D/g, '');
    const cleaned = digits.startsWith('91') && digits.length === 12 ? digits.slice(2) : digits;
    return '+91 ' + cleaned.slice(0, 5) + ' ' + cleaned.slice(5);
}

/* ========== DOM ========== */
document.addEventListener('DOMContentLoaded', () => {
    initTabs();
    initForms();
    initPasswordToggles();
    handleQueryParams();
    checkExistingSession();
});

function handleQueryParams() {
    const params = new URLSearchParams(window.location.search);

    if (params.get('error') === 'unauthorized') {
        showBanner('Unauthorized! Admin access only. Please login as Admin.', false);
        switchTab('admin');
    } else if (params.get('logout')) {
        showBanner('You have been logged out successfully.', true);
    } else if (params.get('role') === 'admin') {
        switchTab('admin');
    }
}

function checkExistingSession() {
    const session = getSession();
    if (!session) return;

    if (session.role === 'admin') {
        window.location.href = 'index.html';
    } else if (session.role === 'user') {
        window.location.href = 'user/index.html';
    }
}

function showBanner(message, isSuccess = false) {
    const banner = document.getElementById('authBanner');
    const msg = document.getElementById('authBannerMsg');
    msg.textContent = message;
    banner.className = 'auth-banner' + (isSuccess ? ' success' : '');
    banner.style.display = 'flex';
    banner.scrollIntoView({ behavior: 'smooth', block: 'center' });

    clearTimeout(showBanner._timer);
    showBanner._timer = setTimeout(() => {
        banner.style.display = 'none';
    }, 5000);
}

function initTabs() {
    document.querySelectorAll('.auth-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            switchTab(tab.dataset.tab);
        });
    });

    document.querySelectorAll('[data-goto]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            switchTab(link.dataset.goto);
        });
    });
}

function switchTab(tabName) {
    document.querySelectorAll('.auth-tab').forEach(t => {
        t.classList.toggle('active', t.dataset.tab === tabName);
    });

    const formIds = { login: 'loginForm', signup: 'signupForm', admin: 'adminForm' };
    document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'));
    document.getElementById(formIds[tabName]).classList.add('active');
}

function initPasswordToggles() {
    document.querySelectorAll('.toggle-pass').forEach(btn => {
        btn.addEventListener('click', () => {
            const input = document.getElementById(btn.dataset.target);
            const isPassword = input.type === 'password';
            input.type = isPassword ? 'text' : 'password';
            btn.querySelector('i').className = isPassword ? 'fas fa-eye-slash' : 'fas fa-eye';
        });
    });
}

/* ========== FORM HANDLERS ========== */
function initForms() {
    document.getElementById('loginForm').addEventListener('submit', handleUserLogin);
    document.getElementById('signupForm').addEventListener('submit', handleSignup);
    document.getElementById('adminForm').addEventListener('submit', handleAdminLogin);
}

function handleUserLogin(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value.trim().toLowerCase();
    const password = document.getElementById('loginPassword').value;

    if (!email || !password) {
        showToast('Please enter email and password', 'error');
        return;
    }

    const user = getUsers().find(u => u.email === email);

    if (!user) {
        showBanner('No account found with this email. Please sign up first.');
        switchTab('signup');
        return;
    }

    if (user.password !== password) {
        showToast('Incorrect password. Please try again.', 'error');
        return;
    }

    const session = { role: 'user', name: user.name, email: user.email, mobile: user.mobile };
    if (document.getElementById('rememberMe').checked) {
        setSession(session);
    } else {
        sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
        localStorage.removeItem(SESSION_KEY);
    }
    showToast(`Welcome back, ${user.name}!`, 'success');
    setTimeout(() => {
        window.location.href = 'user/index.html';
    }, 800);
}

function handleSignup(e) {
    e.preventDefault();

    const nameInput = document.getElementById('signupName');
    const emailInput = document.getElementById('signupEmail');
    const mobileInput = document.getElementById('signupMobile');
    const password = document.getElementById('signupPassword').value;
    const confirm = document.getElementById('signupConfirm').value;

    const name = capitalizeName(nameInput.value);
    const email = emailInput.value.trim().toLowerCase();
    const mobile = mobileInput.value.trim();

    if (!isValidName(name)) {
        showToast('Please enter a valid name (letters only)', 'error');
        nameInput.focus();
        return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showToast('Please enter a valid email address', 'error');
        emailInput.focus();
        return;
    }

    if (!isValidMobile(mobile)) {
        showToast('Please enter a valid Indian mobile number (10 digits starting with 6-9)', 'error');
        mobileInput.focus();
        return;
    }

    if (password.length < 6) {
        showToast('Password must be at least 6 characters', 'error');
        return;
    }

    if (password !== confirm) {
        showToast('Passwords do not match', 'error');
        return;
    }

    const users = getUsers();
    if (users.some(u => u.email === email)) {
        showToast('An account with this email already exists. Please login.', 'error');
        return;
    }

    if (email === ADMIN_CREDENTIALS.email) {
        showToast('This email is reserved for admin. Please use a different email.', 'error');
        return;
    }

    users.push({ name, email, mobile: formatMobile(mobile), password });
    saveUsers(users);

    const session = { role: 'user', name, email, mobile: formatMobile(mobile) };
    setSession(session);

    showToast('Account created successfully! Welcome, ' + name + '!', 'success');
    setTimeout(() => {
        window.location.href = 'user/index.html';
    }, 800);
}

function handleAdminLogin(e) {
    e.preventDefault();
    const email = document.getElementById('adminEmail').value.trim().toLowerCase();
    const password = document.getElementById('adminPassword').value;

    if (!email || !password) {
        showToast('Please enter admin email and password', 'error');
        return;
    }

    const registeredUser = getUsers().find(u => u.email === email);

    if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
        const session = { role: 'admin', name: ADMIN_CREDENTIALS.name, email: ADMIN_CREDENTIALS.email };
        setSession(session);
        showToast('Admin login successful!', 'success');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 800);
        return;
    }

    if (registeredUser) {
        showBanner('Unauthorized! This is a regular user account. Admin access only.');
    } else {
        showToast('Invalid admin credentials', 'error');
    }
}

/* ========== TOASTS ========== */
function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    const icons = { success: 'fa-check-circle', error: 'fa-exclamation-circle', info: 'fa-info-circle' };

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<i class="fas ${icons[type]}"></i><span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => toast.remove(), 4000);
}
