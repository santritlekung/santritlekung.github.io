document.addEventListener('DOMContentLoaded', function() {
    const loginOverlay = document.getElementById('loginOverlay');
    const loginForm = document.getElementById('loginForm');
    const loginPhone = document.getElementById('loginPhone');
    const mainNav = document.getElementById('mainNav');
    const pageTitle = document.getElementById('pageTitle');
    const pageContent = document.getElementById('pageContent');
    const greetingText = document.getElementById('greetingText');
    const userName = document.getElementById('userName');
    const userRole = document.getElementById('userRole');
    const userAvatar = document.getElementById('userAvatar');
    const btnLogout = document.getElementById('btnLogout');
    const btnToggle = document.getElementById('btnToggleSidebar');
    const sidebar = document.getElementById('sidebar');

    // Menu definisi
    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: 'fa-gauge-high' },
        { id: 'sabilun', label: 'Sabilun Najah', icon: 'fa-book-quran' },
        { id: 'kalender', label: 'Kalender Hijriyah', icon: 'fa-calendar' },
        { id: 'iuran', label: 'Iuran Jumat Pahing', icon: 'fa-hand-holding-dollar' },
        { id: 'kas', label: 'Uang Kas', icon: 'fa-coins' },
        { id: 'quote', label: 'Quote Ayat', icon: 'fa-quote-right' },
        { id: 'pengumuman', label: 'Pengumuman', icon: 'fa-bullhorn' },
        { id: 'agenda-putri', label: 'Agenda Putri', icon: 'fa-people-arrows' },
        { id: 'agenda-haul', label: 'Haul Akbar', icon: 'fa-flag' },
        { id: 'iuran-malang', label: 'Iuran Malang', icon: 'fa-bus' }
    ];

    // Render navigasi
    function renderNav(activeId) {
        mainNav.innerHTML = '';
        menuItems.forEach(item => {
            const a = document.createElement('a');
            a.href = '#';
            a.dataset.page = item.id;
            a.innerHTML = `<i class="fas ${item.icon}"></i> ${item.label}`;
            if (item.id === activeId) a.classList.add('active');
            a.addEventListener('click', (e) => {
                e.preventDefault();
                navigate(item.id);
            });
            mainNav.appendChild(a);
        });
    }

    // Navigasi
    function navigate(pageId) {
        // update title
        const menu = menuItems.find(m => m.id === pageId);
        pageTitle.textContent = menu ? menu.label : 'Halaman';
        // update active nav
        document.querySelectorAll('.sidebar-nav a').forEach(a => a.classList.remove('active'));
        const activeLink = document.querySelector(`.sidebar-nav a[data-page="${pageId}"]`);
        if (activeLink) activeLink.classList.add('active');

        // Render konten sesuai halaman
        switch (pageId) {
            case 'dashboard': renderDashboard(); break;
            case 'sabilun': renderSabilun(); break;
            case 'kalender': renderKalender(); break;
            case 'iuran': renderIuran(); break;
            case 'kas': renderKas(); break;
            case 'quote': renderQuote(); break;
            case 'pengumuman': renderPengumuman(); break;
            case 'agenda-putri': renderAgendaPutri(); break;
            case 'agenda-haul': renderAgendaHaul(); break;
            case 'iuran-malang': renderIuranMalang(); break;
            default: renderDashboard();
        }

        // Tutup sidebar di mobile
        if (window.innerWidth <= 768) sidebar.classList.remove('open');
    }

    // Dashboard
    function renderDashboard() {
        const amalan = loadData('amalan');
        const anggota = loadData('anggota');
        const kas = loadData('kas');
        const totalMasuk = kas.filter(k => k.tipe === 'masuk').reduce((s, k) => s + k.jumlah, 0);
        const totalKeluar = kas.filter(k => k.tipe === 'keluar').reduce((s, k) => s + k.jumlah, 0);
        const saldo = totalMasuk - totalKeluar;
        pageContent.innerHTML = `
            <div class="row">
                <div class="stat-card"><div class="num">${amalan.length}</div><div class="label">Amalan</div></div>
                <div class="stat-card"><div class="num">${anggota.length}</div><div class="label">Anggota</div></div>
                <div class="stat-card"><div class="num">Rp ${saldo.toLocaleString()}</div><div class="label">Saldo Kas</div></div>
                <div class="stat-card"><div class="num">${kas.length}</div><div class="label">Transaksi</div></div>
            </div>
            <p style="color:#64748b;">Selamat datang di aplikasi HARUM. Pilih menu di samping.</p>
        `;
    }

    // inisialisasi user
    function initUser() {
        const user = getCurrentUser();
        if (user) {
            userName.textContent = user.name;
            userRole.textContent = user.role === 'admin' ? 'Admin' : 'User';
            userAvatar.textContent = user.name.charAt(0).toUpperCase();
            greetingText.textContent = `Selamat datang, ${user.name}`;
            loginOverlay.style.display = 'none';
            renderNav('dashboard');
            navigate('dashboard');
        } else {
            loginOverlay.style.display = 'flex';
        }
    }

    // Login
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const phone = loginPhone.value.trim();
        if (login(phone)) {
            initUser();
        } else {
            alert('Nomor HP tidak terdaftar! Gunakan 08123456789 (Admin) atau 08123456788 (User)');
        }
    });

    // Logout
    btnLogout.addEventListener('click', function() {
        logout();
        loginOverlay.style.display = 'flex';
        pageContent.innerHTML = '';
        mainNav.innerHTML = '';
    });

    // Toggle sidebar
    btnToggle.addEventListener('click', function() {
        sidebar.classList.toggle('open');
    });

    // Tutup sidebar jika klik di luar (mobile)
    document.addEventListener('click', function(e) {
        if (window.innerWidth <= 768) {
            const isSidebar = sidebar.contains(e.target);
            const isToggle = btnToggle.contains(e.target);
            if (!isSidebar && !isToggle) {
                sidebar.classList.remove('open');
            }
        }
    });

    // Init
    initUser();

    // Expose navigate ke global agar bisa dipanggil dari komponen
    window.navigate = navigate;
});

// ========== MODAL GLOBAL ==========
function showModal(title, bodyHTML, onSave) {
    const overlay = document.getElementById('modalOverlay');
    document.getElementById('modalTitle').textContent = title;
    document.getElementById('modalBody').innerHTML = bodyHTML;
    const footer = document.getElementById('modalFooter');
    footer.innerHTML = `
        <button class="btn btn-outline" onclick="closeModal()">Batal</button>
        <button class="btn btn-primary" id="modalSaveBtn">Simpan</button>
    `;
    overlay.classList.add('show');
    document.getElementById('modalSaveBtn').onclick = function() {
        if (onSave) onSave();
    };
}

function closeModal() {
    document.getElementById('modalOverlay').classList.remove('show');
}

// Event close modal
document.getElementById('modalClose').addEventListener('click', closeModal);
document.getElementById('modalOverlay').addEventListener('click', function(e) {
    if (e.target === this) closeModal();
});

// Expose ke global
window.showModal = showModal;
window.closeModal = closeModal;