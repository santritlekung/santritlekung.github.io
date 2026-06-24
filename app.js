// --- 1. SETTING DATA MENU SIDEBAR ---
const menus = [
    { id: 'dashboard', nama: 'Beranda', ikon: 'fa-home' },
    { id: 'pengumuman', nama: 'Pengumuman', ikon: 'fa-bullhorn' },
    { id: 'artikel', nama: 'Buku Artikel/Blog', ikon: 'fa-book-open' },
    { id: 'jumatpahing', nama: 'Jumat Pahing', ikon: 'fa-calendar-check' },
    { id: 'uangkas', nama: 'Uang Kas', ikon: 'fa-wallet' },
    { id: 'kalender', nama: 'Kalender', ikon: 'fa-calendar-alt' },
    { id: 'haul', nama: 'Haul Akbar', ikon: 'fa-mosque' },
    { id: 'donasi', nama: 'Donasi Haul', ikon: 'fa-hands-helping' },
    { id: 'rombongan', nama: 'Rombongan Malang', ikon: 'fa-bus' },
    { id: 'nyai', nama: 'Kedatangan Nyai', ikon: 'fa-user-grace' },
    { id: 'profil', nama: 'Profil Saya', ikon: 'fa-user' },
    { id: 'admin', nama: 'Admin Panel', ikon: 'fa-cog' }
];

// --- 2. LOGIKA KETIKA HALAMAN DI-LOAD ---
document.addEventListener("DOMContentLoaded", () => {
    // A. Masukkan menu ke sidebar HTML
    const menuKonten = document.getElementById('menuKonten');
    menuKonten.innerHTML = '';
    menus.forEach(m => {
        const btn = document.createElement('button');
        btn.className = `w-full flex items-center space-x-3 p-3 rounded-lg text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 font-medium text-sm text-left transition`;
        btn.onclick = () => { bukaHalaman(m.id); kendaliSidebar(); };
        btn.innerHTML = `<i class="fas ${m.ikon} w-6 text-center text-emerald-600"></i> <span>${m.nama}</span>`;
        menuKonten.appendChild(btn);
    });

    // B. Load file halaman.html ke dalam komponen utama index.html
    fetch('halaman.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('kontenHalaman').innerHTML = data;
        }).catch(err => {
            console.error("Gagal memuat halaman.html, pastikan filenya ada di satu folder.", err);
        });

    // C. Jalankan Jam Digital
    setInterval(() => {
        document.getElementById('jamDigital').innerText = new Date().toLocaleTimeString('id-ID');
    }, 1000);

    // D. Cek apakah ada riwayat login lokal biar tidak perlu login terus
    if (localStorage.getItem('user_harum')) {
        let hpSaved = localStorage.getItem('user_harum');
        eksekusiMasuk(hpSaved);
    }
});

// --- 3. FUNGSI SIDEBAR HAMBURGER ---
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('sidebarOverlay');
const btnHamburger = document.getElementById('btnHamburger');

function kendaliSidebar() {
    const isTutup = sidebar.classList.contains('-translate-x-full');
    if (isTutup) {
        sidebar.classList.remove('-translate-x-full');
        overlay.classList.remove('hidden');
    } else {
        sidebar.classList.add('-translate-x-full');
        overlay.classList.add('hidden');
    }
}
if(btnHamburger) btnHamburger.addEventListener('click', kendaliSidebar);
if(overlay) overlay.addEventListener('click', kendaliSidebar);

// --- 4. FUNGSI NAVIGASI HALAMAN (SPA) ---
window.bukaHalaman = function(idHalaman) {
    document.querySelectorAll('.menu-halaman').forEach(h => h.classList.add('hidden'));
    const target = document.getElementById(`hal-${idHalaman}`);
    if (target) target.classList.remove('hidden');
}

// --- 5. LOGIKA BYPASS LOGIN MANDIRI ---
window.prosesLoginDemo = function() {
    const noHP = document.getElementById('inputNoHP').value.trim();
    if (!noHP) return alert("Silakan isi nomor HP!");

    localStorage.setItem('user_harum', noHP);
    eksekusiMasuk(noHP);
};

function eksekusiMasuk(noHP) {
    document.getElementById('layarLogin').classList.add('hidden');
    document.getElementById('userPhoneDisplay').innerText = "HP: " + noHP;
    
    // Set teks di halaman profil
    setTimeout(() => {
        if(document.getElementById('txtHPProfil')) document.getElementById('txtHPProfil').innerText = noHP;
    }, 500);
}

window.logoutAplikasi = function() {
    if (confirm("Keluar aplikasi?")) {
        localStorage.removeItem('user_harum');
        location.reload();
    }
}
