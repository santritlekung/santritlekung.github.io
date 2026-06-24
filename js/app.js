// Application
let currentPage = 'home';

function navigateTo(page) {
    if (!currentUser) {
        showLoginPage();
        return;
    }
    
    if (page === 'admin-panel' && !isAdmin) {
        showToast('Akses ditolak. Anda bukan admin.', 'error');
        return;
    }
    
    currentPage = page;
    closeSidebar();
    
    const content = document.getElementById('page-content');
    content.innerHTML = '';
    
    switch(page) {
        case 'home':
            loadDashboard(content);
            break;
        case 'pengumuman':
            loadPengumuman(content);
            break;
        case 'artikel':
            loadArtikel(content);
            break;
        case 'jumat-pahing':
            loadJumatPahing(content);
            break;
        case 'kas':
            loadKas(content);
            break;
        case 'kalender':
            loadKalender(content);
            break;
        case 'haul':
            loadHaul(content);
            break;
        case 'donasi-haul':
            loadDonasiHaul(content);
            break;
        case 'rombongan':
            loadRombongan(content);
            break;
        case 'kedatangan-nyai':
            loadKedatanganNyai(content);
            break;
        case 'profil':
            loadProfil(content);
            break;
        case 'admin-panel':
            loadAdminPanel(content);
            break;
        default:
            loadDashboard(content);
    }
    
    document.querySelectorAll('.sidebar-nav a').forEach(link => {
        link.classList.remove('active');
        if (link.dataset.page === page) {
            link.classList.add('active');
        }
    });
}

// Sidebar
document.getElementById('menu-toggle').addEventListener('click', toggleSidebar);
document.getElementById('sidebar-overlay').addEventListener('click', closeSidebar);

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    sidebar.classList.toggle('open');
    overlay.classList.toggle('active');
    document.body.style.overflow = sidebar.classList.contains('open') ? 'hidden' : '';
}

function closeSidebar() {
    document.getElementById('sidebar').classList.remove('open');
    document.getElementById('sidebar-overlay').classList.remove('active');
    document.body.style.overflow = '';
}

// Clock
function startClock() {
    function updateClock() {
        const now = new Date();
        const time = now.toLocaleTimeString('id-ID', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
        document.getElementById('time-display').textContent = time;
    }
    updateClock();
    setInterval(updateClock, 1000);
}

// Kalender
function loadKalender(container) {
    const now = new Date();
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const dayName = days[now.getDay()];
    const pasarans = ['Legi', 'Pahing', 'Pon', 'Wage', 'Kliwon'];
    const pasaran = pasarans[Math.floor(now.getTime() / (1000 * 60 * 60 * 24)) % 5];
    
    container.innerHTML = `
        <div class="page-title">
            <i class="fas fa-calendar-alt" style="color:var(--primary);margin-right:10px;"></i>
            Kalender
        </div>
        <div class="card" style="border-left-color:#FF6B6B;cursor:default;">
            <div style="text-align:center;padding:20px;">
                <div style="font-size:48px;margin-bottom:10px;">📅</div>
                <div style="font-size:28px;font-weight:bold;color:var(--primary);">
                    ${dayName} ${pasaran}
                </div>
                <div style="font-size:18px;margin:10px 0;">
                    ${now.toLocaleDateString('id-ID', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric'
                    })} M
                </div>
                <div style="font-size:18px;color:var(--text-secondary);">
                    Kalender Hijriyah akan ditampilkan di sini
                </div>
            </div>
        </div>
    `;
}

// Profil
function loadProfil(container) {
    container.innerHTML = `
        <div class="page-title">
            <i class="fas fa-user-circle" style="color:var(--primary);margin-right:10px;"></i>
            Profil Saya
        </div>
        <div class="card" style="border-left-color:#1a237e;cursor:default;">
            <div style="text-align:center;padding:20px;">
                <div style="font-size:64px;margin-bottom:10px;">👤</div>
                <div style="font-size:22px;font-weight:bold;color:var(--primary);">
                    ${currentUserData?.nama || 'Anggota'}
                </div>
                <div style="font-size:14px;color:var(--text-secondary);margin:4px 0;">
                    <i class="fas fa-phone"></i> ${currentUser?.phoneNumber || 'Tidak ada'}
                </div>
                <div style="font-size:14px;color:var(--text-secondary);">
                    <i class="fas fa-user-tag"></i> ${currentUserData?.role === 'admin' ? 'Admin' : 'Anggota'}
                </div>
            </div>
        </div>
    `;
}