// ==========================================================================
// 1. KONFIGURASI DATABASE CLOUD (FIREBASE REALTIME DATABASE)
// ==========================================================================
// Ganti URL di bawah ini dengan URL Firebase Realtime Database Anda sendiri nantinya
const FIREBASE_URL = "https://harum-app-default-rtdb.firebaseio.com"; 

// State Aplikasi (Data sementara di memori browser)
const state = {
    user: {
        isLoggedIn: false,
        phone: '',
        role: 'Tamu' // Tamu, User, Admin
    },
    currentPage: 'beranda'
};

// ==========================================================================
// 2. MANAGEMENT AUTH & ROLE-BASED ACCESS CONTROL (RBAC)
// ==========================================================================

// Fungsi simulasi cek nomor HP ke Cloud Database
async function checkLoginStatus(phoneNumber) {
    try {
        // Ambil data user/admin dari Firebase
        const response = await fetch(`${FIREBASE_URL}/users.json`);
        const users = await response.json();
        
        // Cek jika nomor HP terdaftar (Fallback jika database belum disetup)
        if (!users) {
            // Simulasi lokal untuk keperluan testing awal sebelum setup Firebase
            if (phoneNumber === "08123456789") return "Admin";
            if (phoneNumber === "08765432100") return "User";
            return null;
        }

        // Cari role berdasarkan nomor HP di database
        if (users[phoneNumber]) {
            return users[phoneNumber].role; // Mengembalikan 'Admin' atau 'User'
        }
        return null;
    } catch (error) {
        console.error("Gagal terhubung ke database, menggunakan login lokal sementara:", error);
        if (phoneNumber === "08123456789") return "Admin";
        if (phoneNumber === "08765432100") return "User";
        return null;
    }
}

function updateAuthUI() {
    const badge = document.getElementById('user-role-badge');
    const btnLoginTrigger = document.getElementById('btn-login-trigger');
    const btnLogout = document.getElementById('btn-logout');

    if (state.user.isLoggedIn) {
        badge.textContent = state.user.role;
        badge.className = `badge badge-${state.user.role.toLowerCase()}`;
        btnLoginTrigger.classList.add('hidden');
        btnLogout.classList.remove('hidden');
    } else {
        badge.textContent = "Tamu";
        badge.className = "badge badge-user";
        btnLoginTrigger.classList.remove('hidden');
        btnLogout.classList.add('hidden');
    }
    
    // Render ulang halaman saat ini untuk memperbarui visibilitas tombol CRUD
    renderPage(state.currentPage);
}

// ==========================================================================
// 3. ROUTER SINGLE PAGE APPLICATION (SPA)
// ==========================================================================

// Map data halaman ke fungsi komponen
const routes = {
    beranda: async () => {
        const { renderBeranda } = await import('./components/beranda.js');
        return renderBeranda(state.user.role);
    },
    sabilunNajah: async () => {
        const { renderSabilunNajah } = await import('./components/sabilunNajah.js');
        return renderSabilunNajah(state.user.role);
    },
    kalender: async () => {
        const { renderKalender } = await import('./components/kalender.js');
        return renderKalender(state.user.role);
    },
    iuranJumat: async () => {
        const { renderIuranJumat } = await import('./components/iuranJumat.js');
        return renderIuranJumat(state.user.role);
    },
    uangKas: async () => {
        const { renderUangKas } = await import('./components/uangKas.js');
        return renderUangKas(state.user.role);
    },
    iuranMalang: async () => {
        const { renderIuranMalang } = await import('./components/iuranMalang.js');
        return renderIuranMalang(state.user.role);
    },
    pengumuman: async () => {
        const { renderPengumuman } = await import('./components/pengumuman.js');
        return renderPengumuman(state.user.role);
    },
    agendaPutri: async () => {
        const { renderAgendaPutri } = await import('./components/agendaPutri.js');
        return renderAgendaPutri(state.user.role);
    },
    agendaHaul: async () => {
        const { renderAgendaHaul } = await import('./components/agendaHaul.js');
        return renderAgendaHaul(state.user.role);
    }
};

async function renderPage(pageKey) {
    const contentArea = document.getElementById('app-content');
    
    if (routes[pageKey]) {
        state.currentPage = pageKey;
        try {
            contentArea.innerHTML = `<div class="loading-spinner"><i class="fa-solid fa-circle-notch fa-spin"></i> Memuat...</div>`;
            const htmlContent = await routes[pageKey]();
            contentArea.innerHTML = htmlContent;
            
            // Inisialisasi event listener spesifik komponen jika ada setelah di-render
            executeComponentScripts(pageKey);
        } catch (err) {
            contentArea.innerHTML = `<div class="alert alert-danger">Gagal memuat komponen halaman: ${err.message}</div>`;
        }
    } else {
        contentArea.innerHTML = `<div class="alert alert-danger">Halaman tidak ditemukan!</div>`;
    }
}

// Fungsi pembantu untuk menjalankan skrip interaksi di setiap file komponen nantinya
function executeComponentScripts(pageKey) {
    // Akan diisi logika pemicu fungsi setelah HTML disuntikkan ke DOM
    console.log(`Halaman ${pageKey} berhasil dimuat.`);
}

// Navigasi URL via Hash harian (#beranda, #uang-kas, dll)
window.addEventListener('hashchange', () => {
    const hash = window.location.hash.replace('#', '');
    // Konversi format kebab-case di URL ke camelCase di sistem router javascript
    const pageKey = hash.replace(/-([a-z])/g, (g) => g[1].toUpperCase()) || 'beranda';
    
    // Tandai menu navigasi yang aktif di sidebar
    document.querySelectorAll('.nav-link').forEach(link => {
        if (link.getAttribute('data-page') === pageKey) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // Tutup sidebar otomatis di mobile setelah klik menu
    document.getElementById('app-sidebar').classList.remove('active');
    document.getElementById('sidebar-overlay').classList.remove('active');

    renderPage(pageKey);
});

// ==========================================================================
// 4. EVENT LISTENERS UTAMA INTERFACES
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
    
    // Toggle Sidebar Mobile
    const sidebar = document.getElementById('app-sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    
    document.getElementById('sidebar-toggle').addEventListener('click', () => {
        sidebar.classList.toggle('active');
        overlay.classList.toggle('active');
    });

    overlay.addEventListener('click', () => {
        sidebar.classList.remove('active');
        overlay.classList.remove('active');
    });

    // Modal Login Controls
    const loginModal = document.getElementById('login-modal');
    
    document.getElementById('btn-login-trigger').addEventListener('click', () => {
        loginModal.classList.remove('hidden');
        document.getElementById('login-phone').focus();
    });

    document.getElementById('btn-close-modal').addEventListener('click', () => {
        loginModal.classList.add('hidden');
        document.getElementById('login-error-msg').classList.add('hidden');
    });

    // Form Login Submit
    document.getElementById('login-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const phoneInput = document.getElementById('login-phone').value.trim();
        const errorMsg = document.getElementById('login-error-msg');

        const role = await checkLoginStatus(phoneInput);

        if (role) {
            state.user.isLoggedIn = true;
            state.user.phone = phoneInput;
            state.user.role = role; // 'Admin' atau 'User'
            
            // Simpan status session login agar tidak hilang saat di-refresh halaman (opsional lokal)
            sessionStorage.setItem('harum_user', JSON.stringify(state.user));

            errorMsg.classList.add('hidden');
            loginModal.classList.add('hidden');
            document.getElementById('login-form').reset();
            updateAuthUI();
        } else {
            errorMsg.classList.remove('hidden');
        }
    });

    // Tombol Log Out
    document.getElementById('btn-logout').addEventListener('click', () => {
        state.user.isLoggedIn = false;
        state.user.phone = '';
        state.user.role = 'Tamu';
        sessionStorage.removeItem('harum_user');
        updateAuthUI();
    });

    // Cek Session Terbuka (Auto-Login jika belum dologout)
    const savedUser = sessionStorage.getItem('harum_user');
    if (savedUser) {
        state.user = JSON.parse(savedUser);
    }

    // Jalankan Router Pertama Kali saat aplikasi dibuka
    updateAuthUI();
    window.dispatchEvent(new Event('hashchange'));
});

// Export database URL agar bisa dibaca oleh file komponen-komponen CRUD
export { FIREBASE_URL };
