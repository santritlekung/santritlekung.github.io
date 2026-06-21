// app.js - Main Application Entry

// ===== IMPORTS =====
import { initAuth, getCurrentUser, isAdmin, logout } from './utils/auth.js';
import { loadData, saveData, DATA_KEYS } from './utils/storage.js';

// ===== COMPONENT IMPORTS =====
import { renderDashboard } from './components/dashboard.js';
import { renderSabilunNajah } from './components/sabilun-najah.js';
import { renderKalender } from './components/kalender.js';
import { renderIuranJumat } from './components/iuran-jumat.js';
import { renderUangKas } from './components/uang-kas.js';
import { renderQuote } from './components/quote.js';
import { renderPengumuman } from './components/pengumuman.js';
import { renderAgendaPutri } from './components/agenda-putri.js';
import { renderHaulAkbar } from './components/haul-akbar.js';
import { renderIuranMalang } from './components/iuran-malang.js';

// ===== STATE =====
let currentPage = 'dashboard';
let sidebarOpen = window.innerWidth > 768;

// ===== DOM REFS =====
const loadingScreen = document.getElementById('loading-screen');
const loginScreen = document.getElementById('login-screen');
const mainApp = document.getElementById('main-app');
const contentArea = document.getElementById('content-area');
const pageTitle = document.getElementById('page-title');
const userDisplay = document.getElementById('user-display');
const roleBadge = document.getElementById('role-badge');
const loginForm = document.getElementById('login-form');
const loginError = document.getElementById('login-error');
const logoutBtn = document.getElementById('logout-btn');
const toggleSidebarBtn = document.getElementById('toggle-sidebar');
const sidebar = document.getElementById('sidebar');
const navItems = document.querySelectorAll('.nav-item');

// ===== PAGE RENDERER MAP =====
const pageRenderers = {
    dashboard: renderDashboard,
    'sabilun-najah': renderSabilunNajah,
    kalender: renderKalender,
    'iuran-jumat': renderIuranJumat,
    'uang-kas': renderUangKas,
    quote: renderQuote,
    pengumuman: renderPengumuman,
    'agenda-putri': renderAgendaPutri,
    'haul-akbar': renderHaulAkbar,
    'iuran-malang': renderIuranMalang,
};

const pageTitles = {
    dashboard: 'Beranda',
    'sabilun-najah': 'Sabilun Najah',
    kalender: 'Kalender Hijriyah & Pasaran',
    'iuran-jumat': 'Iuran Jumat Pahing',
    'uang-kas': 'Uang Kas',
    quote: 'Quote Ayat Al-Qur\'an',
    pengumuman: 'Pengumuman',
    'agenda-putri': 'Agenda Putri Syaikhuna',
    'haul-akbar': 'Haul Akbar Syaikhuna',
    'iuran-malang': 'Iuran Rombongan Malang',
};

// ===== INIT =====
async function init() {
    // Show loading
    loadingScreen.classList.remove('hidden');

    // Initialize data
    await loadData();

    // Check auth
    const user = getCurrentUser();
    if (user) {
        showMainApp(user);
    } else {
        showLogin();
    }

    // Hide loading
    loadingScreen.classList.add('hidden');
}

// ===== LOGIN =====
function showLogin() {
    loginScreen.classList.remove('hidden');
    mainApp.classList.add('hidden');
    loginError.classList.add('hidden');
}

function showMainApp(user) {
    loginScreen.classList.add('hidden');
    mainApp.classList.remove('hidden');
    updateUserUI(user);
    navigateTo('dashboard');
}

function updateUserUI(user) {
    userDisplay.textContent = user.name || user.phone;
    if (user.role === 'admin') {
        roleBadge.textContent = 'Admin';
        roleBadge.className = 'badge admin';
    } else {
        roleBadge.textContent = 'User';
        roleBadge.className = 'badge';
    }
}

// ===== LOGIN HANDLER =====
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const phone = document.getElementById('login-phone').value.trim();
    const password = document.getElementById('login-password').value.trim();

    const user = initAuth(phone, password);
    if (user) {
        loginError.classList.add('hidden');
        showMainApp(user);
        // Reset form
        loginForm.reset();
    } else {
        loginError.classList.remove('hidden');
    }
});

// ===== LOGOUT =====
logoutBtn.addEventListener('click', () => {
    logout();
    showLogin();
    // Reset login form
    document.getElementById('login-phone').value = '';
    document.getElementById('login-password').value = '';
});

// ===== NAVIGATION =====
function navigateTo(page) {
    currentPage = page;
    // Update active nav
    navItems.forEach(item => {
        item.classList.toggle('active', item.dataset.page === page);
    });
    // Update title
    pageTitle.textContent = pageTitles[page] || page;
    // Render content
    const renderer = pageRenderers[page];
    if (renderer) {
        const user = getCurrentUser();
        const isAdminUser = isAdmin();
        contentArea.innerHTML = renderer({ user, isAdmin: isAdminUser });
        // Re-run any initialization needed after render
        if (page === 'kalender') initKalender();
        if (page === 'quote') initQuote();
    } else {
        contentArea.innerHTML = `<div class="card"><p>Halaman tidak ditemukan.</p></div>`;
    }
    // Close sidebar on mobile
    if (window.innerWidth <= 768) {
        sidebar.classList.remove('open');
        sidebarOpen = false;
    }
}

// ===== NAV ITEM CLICKS =====
navItems.forEach(item => {
    item.addEventListener('click', () => {
        const page = item.dataset.page;
        if (page) navigateTo(page);
    });
});

// ===== SIDEBAR TOGGLE =====
toggleSidebarBtn.addEventListener('click', () => {
    sidebarOpen = !sidebarOpen;
    sidebar.classList.toggle('open', sidebarOpen);
});

// ===== RESPONSIVE SIDEBAR =====
window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        sidebar.classList.remove('open');
        sidebarOpen = false;
    }
});

// ===== KEYBOARD SHORTCUTS =====
document.addEventListener('keydown', (e) => {
    // Escape to close sidebar
    if (e.key === 'Escape' && sidebarOpen) {
        sidebar.classList.remove('open');
        sidebarOpen = false;
    }
});

// ===== EXPOSE FOR COMPONENTS =====
window.navigateTo = navigateTo;
window.getCurrentUser = getCurrentUser;
window.isAdmin = isAdmin;

// ===== INIT KALENDER (dynamic) =====
function initKalender() {
    // This will be implemented in kalender.js
    if (window.initKalenderWidget) {
        window.initKalenderWidget();
    }
}

function initQuote() {
    if (window.initQuoteWidget) {
        window.initQuoteWidget();
    }
}

// ===== START APP =====
document.addEventListener('DOMContentLoaded', init);

// Handle page visibility change to refresh data
document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
        // Refresh current page data
        const renderer = pageRenderers[currentPage];
        if (renderer) {
            const user = getCurrentUser();
            const isAdminUser = isAdmin();
            contentArea.innerHTML = renderer({ user, isAdmin: isAdminUser });
        }
    }
});