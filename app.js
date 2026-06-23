// ==================== app.js - HARUM Application ====================

let currentUser = null;
let currentRole = null; // 'admin' atau 'user'

// Data cache (akan di-load dari JSON)
let appData = {
    members: [],
    amalan: [],
    kas: [],
    announcements: [],
    quotes: [],
    iuranMalang: []
};

// Dummy users untuk demo
const users = {
    "0811111111": { name: "Admin Harum", role: "admin" },
    "0822222222": { name: "User Anggota", role: "user" }
};

// ==================== Utility Functions ====================

function saveToLocalStorage() {
    localStorage.setItem('harum_currentUser', JSON.stringify(currentUser));
}

function loadFromLocalStorage() {
    const saved = localStorage.getItem('harum_currentUser');
    if (saved) {
        currentUser = JSON.parse(saved);
        currentRole = currentUser.role;
        document.getElementById('user-role').textContent = 
            `\( {currentUser.name} ( \){currentRole === 'admin' ? 'Admin' : 'Anggota'})`;
    }
}

async function loadJSON(file) {
    try {
        const response = await fetch(`data/${file}`);
        if (!response.ok) throw new Error(`Gagal load ${file}`);
        return await response.json();
    } catch (error) {
        console.warn(`Warning: ${file} tidak ditemukan atau kosong.`, error);
        return [];
    }
}

async function loadAllData() {
    appData.members = await loadJSON('members.json');
    appData.amalan = await loadJSON('amalan.json');
    appData.kas = await loadJSON('kas.json');
    appData.announcements = await loadJSON('announcements.json');
    appData.quotes = await loadJSON('quotes.json');
    appData.iuranMalang = await loadJSON('iuran-malang.json');
}

// ==================== Login System ====================

function login() {
    const phone = document.getElementById('phone-input').value.trim();
    
    if (!phone) {
        alert("Masukkan nomor HP!");
        return;
    }

    if (users[phone]) {
        currentUser = { phone, ...users[phone] };
        currentRole = currentUser.role;
        
        saveToLocalStorage();
        
        document.getElementById('login-modal').style.display = 'none';
        document.getElementById('user-role').textContent = 
            `\( {currentUser.name} ( \){currentRole === 'admin' ? 'Admin' : 'Anggota'})`;
        
        // Tampilkan tombol admin jika admin
        toggleAdminControls();
        
        // Load halaman beranda
        navigateTo('beranda');
    } else {
        alert("Nomor HP tidak terdaftar. Gunakan:\n0811111111 (Admin)\n0822222222 (User)");
    }
}

function logout() {
    if (confirm("Yakin ingin logout?")) {
        localStorage.removeItem('harum_currentUser');
        currentUser = null;
        currentRole = null;
        document.getElementById('login-modal').style.display = 'flex';
        document.getElementById('content-area').innerHTML = '';
    }
}

function toggleAdminControls() {
    const adminElements = document.querySelectorAll('.admin-only');
    adminElements.forEach(el => {
        el.style.display = currentRole === 'admin' ? 'block' : 'none';
    });
}

// ==================== Routing ====================

function navigateTo(page) {
    document.querySelectorAll('nav li').forEach(li => {
        li.classList.remove('active');
        if (li.getAttribute('onclick').includes(`'${page}'`)) {
            li.classList.add('active');
        }
    });

    document.getElementById('page-title').textContent = getPageTitle(page);
    renderPage(page);
}

function getPageTitle(page) {
    const titles = {
        'beranda': 'Beranda',
        'sabilun-najah': 'Sabilun Najah',
        'kalender': 'Kalender Hijriyah & Pasaran Jawa',
        'iuran-rutin': 'Iuran Rutin (Jumat Pahing)',
        'uang-kas': 'Uang Kas',
        'pengumuman': 'Pengumuman',
        'agenda-putri': 'Persiapan Kedatangan Putri Syaikhuna',
        'haul-akbar': 'Haul Akbar Syaikhuna',
        'iuran-malang': 'Iuran Dana Rombongan ke Malang'
    };
    return titles[page] || 'HARUM';
}

// ==================== Page Renderers ====================

async function renderPage(page) {
    const content = document.getElementById('content-area');
    content.innerHTML = '<p style="text-align:center; padding:50px;">Memuat...</p>';

    switch(page) {
        case 'beranda':
            renderBeranda(content);
            break;
        case 'sabilun-najah':
            renderSabilunNajah(content);
            break;
        case 'kalender':
            renderKalender(content);
            break;
        case 'iuran-rutin':
            renderIuranRutin(content);
            break;
        case 'uang-kas':
            renderUangKas(content);
            break;
        case 'pengumuman':
            renderPengumuman(content);
            break;
        default:
            content.innerHTML = `<h3>Halaman ${getPageTitle(page)} sedang dalam pengembangan.</h3>`;
    }
}

function renderBeranda(content) {
    const quote = appData.quotes.length ? 
        appData.quotes[Math.floor(Math.random() * appData.quotes.length)] : 
        { arab: "وَمَنْ يَتَّقِ اللَّهَ يَجْعَلْ لَهُ مِنْ أَمْرِهِ يُسْرًا", terjemah: "Barangsiapa bertakwa kepada Allah, niscaya Dia akan memberikan kemudahan baginya dalam segala urusannya." };

    content.innerHTML = `
        <div class="hero">
            <h1>Selamat Datang di HARUM</h1>
            <p>Sabilun Najah - Jalan Menuju Kebahagiaan</p>
        </div>
        
        <div class="widget">
            <h3>Quote Ayat Hari Ini</h3>
            <div class="quote-card">
                <p class="arabic">${quote.arab}</p>
                <p class="translation">${quote.terjemah}</p>
            </div>
        </div>

        <div class="announcement-preview">
            <h3>Pengumuman Terbaru</h3>
            ${appData.announcements.slice(0, 3).map(a => `
                <div class="ann-card">
                    <strong>${a.title}</strong>
                    <p>${a.content.substring(0, 120)}...</p>
                </div>
            `).join('') || '<p>Belum ada pengumuman.</p>'}
        </div>
    `;
}

async function renderSabilunNajah(content) {
    content.innerHTML = `
        <h3>Daftar Amalan Syaikhuna Siddiq Abdullah</h3>
        <div class="amalan-list">
            ${appData.amalan.map(am => `
                <div class="amalan-card">
                    <h4>${am.judul}</h4>
                    <p class="arabic">${am.arab}</p>
                    <p><strong>Terjemahan:</strong> ${am.terjemah || '-'}</p>
                    \( {am.audio ? `<audio controls src=" \){am.audio}"></audio>` : ''}
                </div>
            `).join('')}
        </div>
    `;
}

function renderKalender(content) {
    content.innerHTML = `
        <h3>Kalender Hijriyah & Pasaran Jawa</h3>
        <p style="color:#666;">Fitur kalender interaktif akan dikembangkan lebih lanjut.</p>
        <div class="placeholder">
            <p><strong>Contoh:</strong> Hari ini - 28 Muharram 1448 H | Jumat Pahing</p>
        </div>
    `;
}

function renderIuranRutin(content) {
    content.innerHTML = `
        <h3>Iuran Rutin - Jumat Pahing</h3>
        <table class="data-table">
            <thead>
                <tr>
                    <th>Nama</th>
                    <th>Status Bayar (Periode Terakhir)</th>
                    ${currentRole === 'admin' ? '<th>Aksi</th>' : ''}
                </tr>
            </thead>
            <tbody>
                ${appData.members.map(m => `
                    <tr>
                        <td>${m.nama}</td>
                        <td>${m.statusIuran || 'Belum Bayar'}</td>
                        \( {currentRole === 'admin' ? `<td><button onclick="markPaid(' \){m.id}')">Tandai Bayar</button></td>` : ''}
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

function renderUangKas(content) {
    let totalMasuk = 0, totalKeluar = 0;
    appData.kas.forEach(t => {
        if (t.tipe === 'masuk') totalMasuk += t.jumlah;
        else totalKeluar += t.jumlah;
    });
    const saldo = totalMasuk - totalKeluar;

    content.innerHTML = `
        <h3>Laporan Uang Kas</h3>
        <div class="kas-summary">
            <div>Masuk: <strong>Rp ${totalMasuk.toLocaleString('id-ID')}</strong></div>
            <div>Keluar: <strong>Rp ${totalKeluar.toLocaleString('id-ID')}</strong></div>
            <div>Saldo: <strong style="color:green;">Rp ${saldo.toLocaleString('id-ID')}</strong></div>
        </div>
        ${currentRole === 'admin' ? `<button onclick="showAddTransactionForm()">+ Tambah Transaksi</button>` : ''}
    `;
}

function renderPengumuman(content) {
    content.innerHTML = `
        <h3>Pengumuman</h3>
        ${currentRole === 'admin' ? `<button onclick="showAddAnnouncementForm()">+ Tambah Pengumuman</button>` : ''}
        <div class="ann-list">
            ${appData.announcements.map(a => `
                <div class="ann-card">
                    <h4>${a.title}</h4>
                    <p>${a.content}</p>
                </div>
            `).join('')}
        </div>
    `;
}

// ==================== Initialize ====================

async function initApp() {
    await loadAllData();
    loadFromLocalStorage();

    const modal = document.getElementById('login-modal');
    
    if (!currentUser) {
        modal.style.display = 'flex';
    } else {
        modal.style.display = 'none';
        toggleAdminControls();
        navigateTo('beranda');
    }
}

// Jalankan aplikasi
document.addEventListener('DOMContentLoaded', initApp);