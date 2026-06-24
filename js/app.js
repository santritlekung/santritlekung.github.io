// ========================================
// BAGIAN 1: Kode dari LANGKAH 6 (sudah ada)
// ========================================

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


// ============================================
// BAGIAN 2: TAMBAHKAN KODE DI BAWAH INI (LANGKAH 9)
// ============================================

// ===== PENGUMUMAN =====
function loadPengumuman(container) {
    container.innerHTML = `
        <div class="page-title">
            <i class="fas fa-bullhorn" style="color:var(--primary);margin-right:10px;"></i>
            Pengumuman
        </div>
        <div id="pengumuman-list" class="data-list"></div>
    `;
    
    DB.pengumuman.orderByChild('tanggal').limitToLast(50).on('value', (snapshot) => {
        const data = snapshot.val();
        const list = document.getElementById('pengumuman-list');
        if (!data) {
            list.innerHTML = '<p style="padding:20px;text-align:center;color:var(--text-secondary);">Belum ada pengumuman</p>';
            return;
        }
        
        const items = Object.keys(data).map(key => ({id: key, ...data[key]}))
            .sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal));
        
        list.innerHTML = items.map(item => `
            <div class="data-item" style="flex-direction:column;align-items:flex-start;gap:8px;">
                <div style="display:flex;justify-content:space-between;width:100%;">
                    <div class="title">${item.judul || 'Pengumuman'}</div>
                    <span style="font-size:12px;color:var(--text-secondary);">${formatDate(item.tanggal)}</span>
                </div>
                <div style="font-size:14px;color:var(--text-secondary);">${item.isi || ''}</div>
                ${item.author ? `<div style="font-size:12px;color:var(--text-secondary);">- ${item.author}</div>` : ''}
            </div>
        `).join('');
    });
}

// ===== ARTIKEL =====
function loadArtikel(container) {
    container.innerHTML = `
        <div class="page-title">
            <i class="fas fa-book" style="color:var(--primary);margin-right:10px;"></i>
            Buku Artikel / Blog
        </div>
        <div id="artikel-list" class="data-list"></div>
    `;
    
    DB.artikel.orderByChild('tanggal').on('value', (snapshot) => {
        const data = snapshot.val();
        const list = document.getElementById('artikel-list');
        if (!data) {
            list.innerHTML = '<p style="padding:20px;text-align:center;color:var(--text-secondary);">Belum ada artikel</p>';
            return;
        }
        
        const items = Object.keys(data).map(key => ({id: key, ...data[key]}))
            .sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal));
        
        list.innerHTML = items.map(item => `
            <div class="data-item" style="flex-direction:column;align-items:flex-start;gap:8px;">
                <div style="display:flex;justify-content:space-between;width:100%;">
                    <div class="title">${item.judul || 'Artikel'}</div>
                    <span style="font-size:12px;color:var(--text-secondary);">${formatDate(item.tanggal)}</span>
                </div>
                ${item.kategori ? `<span class="badge badge-success" style="font-size:11px;">${item.kategori}</span>` : ''}
                <div style="font-size:14px;color:var(--text-secondary);">${(item.konten || item.isi || '').substring(0, 100)}${(item.konten || item.isi || '').length > 100 ? '...' : ''}</div>
            </div>
        `).join('');
    });
}

// ===== JUMAT PAHING =====
function loadJumatPahing(container) {
    container.innerHTML = `
        <div class="page-title">
            <i class="fas fa-calendar-check" style="color:var(--primary);margin-right:10px;"></i>
            Jumat Pahing
        </div>
        <div id="iuran-stats" style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:16px;"></div>
        <div id="iuran-list" class="data-list"></div>
    `;
    
    DB.iuran.on('value', (snapshot) => {
        const data = snapshot.val();
        const list = document.getElementById('iuran-list');
        const stats = document.getElementById('iuran-stats');
        
        if (!data) {
            list.innerHTML = '<p style="padding:20px;text-align:center;color:var(--text-secondary);">Belum ada data iuran</p>';
            stats.innerHTML = '';
            return;
        }
        
        const items = Object.keys(data).map(key => ({id: key, ...data[key]}));
        const total = items.reduce((sum, i) => sum + (i.nominal || 0), 0);
        const lunas = items.filter(i => i.status === 'lunas').length;
        
        stats.innerHTML = `
            <div class="card" style="border-left-color:#4CAF50;cursor:default;padding:12px;">
                <div style="font-size:12px;color:var(--text-secondary);">Total Iuran</div>
                <div style="font-size:20px;font-weight:bold;">${formatCurrency(total)}</div>
            </div>
            <div class="card" style="border-left-color:#2196F3;cursor:default;padding:12px;">
                <div style="font-size:12px;color:var(--text-secondary);">Anggota Aktif</div>
                <div style="font-size:20px;font-weight:bold;">${lunas} / ${items.length}</div>
            </div>
        `;
        
        list.innerHTML = items.map(item => `
            <div class="data-item">
                <div class="content">
                    <div class="title">${item.nama || 'Anggota'}</div>
                    <div class="meta">
                        ${formatDate(item.tanggal)} - ${formatCurrency(item.nominal)}
                        <span class="badge ${item.status === 'lunas' ? 'badge-success' : 'badge-warning'}">${item.status || 'belum'}</span>
                    </div>
                </div>
            </div>
        `).join('');
    });
}

// ===== KAS =====
function loadKas(container) {
    container.innerHTML = `
        <div class="page-title">
            <i class="fas fa-money-bill-wave" style="color:var(--primary);margin-right:10px;"></i>
            Uang Kas
        </div>
        <div id="kas-stats" style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;margin-bottom:16px;"></div>
        <div id="kas-list" class="data-list"></div>
    `;
    
    DB.transaksi.on('value', (snapshot) => {
        const data = snapshot.val();
        const list = document.getElementById('kas-list');
        const stats = document.getElementById('kas-stats');
        
        if (!data) {
            list.innerHTML = '<p style="padding:20px;text-align:center;color:var(--text-secondary);">Belum ada transaksi</p>';
            stats.innerHTML = '';
            return;
        }
        
        const items = Object.keys(data).map(key => ({id: key, ...data[key]}));
        const total = items.reduce((sum, t) => sum + (t.jenis === 'masuk' ? t.nominal : -t.nominal), 0);
        const masuk = items.filter(t => t.jenis === 'masuk').reduce((sum, t) => sum + t.nominal, 0);
        const keluar = items.filter(t => t.jenis === 'keluar').reduce((sum, t) => sum + t.nominal, 0);
        
        stats.innerHTML = `
            <div class="card" style="border-left-color:#4CAF50;cursor:default;padding:12px;">
                <div style="font-size:12px;color:var(--text-secondary);">Saldo</div>
                <div style="font-size:20px;font-weight:bold;color:${total >= 0 ? '#4CAF50' : '#f44336'}">${formatCurrency(total)}</div>
            </div>
            <div class="card" style="border-left-color:#2196F3;cursor:default;padding:12px;">
                <div style="font-size:12px;color:var(--text-secondary);">Pemasukan</div>
                <div style="font-size:18px;font-weight:bold;color:#4CAF50;">${formatCurrency(masuk)}</div>
            </div>
            <div class="card" style="border-left-color:#f44336;cursor:default;padding:12px;">
                <div style="font-size:12px;color:var(--text-secondary);">Pengeluaran</div>
                <div style="font-size:18px;font-weight:bold;color:#f44336;">${formatCurrency(keluar)}</div>
            </div>
        `;
        
        list.innerHTML = items.sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal))
            .map(item => `
                <div class="data-item">
                    <div class="content">
                        <div class="title">${item.keterangan || 'Transaksi'}</div>
                        <div class="meta">
                            ${formatDate(item.tanggal)}
                            <span class="badge ${item.jenis === 'masuk' ? 'badge-success' : 'badge-danger'}">${item.jenis}</span>
                        </div>
                    </div>
                    <div style="font-weight:bold;color:${item.jenis === 'masuk' ? '#4CAF50' : '#f44336'}">
                        ${item.jenis === 'masuk' ? '+' : '-'} ${formatCurrency(item.nominal)}
                    </div>
                </div>
            `).join('');
    });
}

// ===== HAUL =====
function loadHaul(container) {
    container.innerHTML = `
        <div class="page-title">
            <i class="fas fa-mosque" style="color:var(--primary);margin-right:10px;"></i>
            Haul Akbar Syaikhuna Siddiq Abdullah
        </div>
        <div id="haul-content">
            <div class="card" style="border-left-color:#FF6B6B;cursor:default;">
                <div style="padding:16px;text-align:center;">
                    <div style="font-size:48px;margin-bottom:10px;">🕌</div>
                    <h3 style="color:var(--primary);margin-bottom:8px;">Haul Akbar</h3>
                    <p style="color:var(--text-secondary);">Informasi acara haul akan ditampilkan di sini</p>
                </div>
            </div>
        </div>
    `;
    
    DB.haulInfo.on('value', (snapshot) => {
        const data = snapshot.val();
        const container = document.getElementById('haul-content');
        if (!data) return;
        
        container.innerHTML = `
            <div class="card" style="border-left-color:#FF6B6B;cursor:default;">
                <div style="padding:16px;">
                    <h3 style="color:var(--primary);margin-bottom:8px;">${data.judul || 'Haul Akbar'}</h3>
                    <p style="color:var(--text-secondary);margin-bottom:8px;">${data.deskripsi || ''}</p>
                    ${data.tanggal ? `<p style="font-size:14px;color:var(--primary);"><i class="fas fa-calendar-alt"></i> ${formatDate(data.tanggal)}</p>` : ''}
                    ${data.tempat ? `<p style="font-size:14px;color:var(--text-secondary);"><i class="fas fa-map-marker-alt"></i> ${data.tempat}</p>` : ''}
                </div>
            </div>
        `;
    });
}

// ===== DONASI HAUL =====
function loadDonasiHaul(container) {
    container.innerHTML = `
        <div class="page-title">
            <i class="fas fa-hand-holding-heart" style="color:var(--primary);margin-right:10px;"></i>
            Donasi Haul
        </div>
        <div class="form-container" id="donasi-form-container">
            <h3><i class="fas fa-plus-circle"></i> Donasi Sekarang</h3>
            <form id="donasi-form">
                <div class="form-group">
                    <label>Nama Donatur</label>
                    <input type="text" id="donasi-nama" required placeholder="Nama lengkap">
                </div>
                <div class="form-group">
                    <label>Nominal (Rp)</label>
                    <input type="number" id="donasi-nominal" required placeholder="100000" min="1000">
                </div>
                <button type="submit" class="btn btn-success">Kirim Donasi</button>
            </form>
        </div>
        <div style="margin-top:20px;">
            <h3 style="color:var(--primary);margin-bottom:12px;"><i class="fas fa-list"></i> Daftar Donatur</h3>
            <div id="donasi-list" class="data-list"></div>
        </div>
    `;
    
    document.getElementById('donasi-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const nama = document.getElementById('donasi-nama').value;
        const nominal = parseInt(document.getElementById('donasi-nominal').value);
        
        if (!nama || !nominal || nominal < 1000) {
            showToast('Mohon isi data dengan benar', 'error');
            return;
        }
        
        const btn = e.target.querySelector('button[type="submit"]');
        btn.disabled = true;
        btn.textContent = 'Mengirim...';
        
        DB.donasi.push({
            nama: nama,
            nominal: nominal,
            tanggal: new Date().toISOString()
        }).then(() => {
            showToast('Donasi berhasil dikirim! Terima kasih 🙏', 'success');
            document.getElementById('donasi-form').reset();
            btn.disabled = false;
            btn.textContent = 'Kirim Donasi';
        }).catch(err => {
            showToast('Error: ' + err.message, 'error');
            btn.disabled = false;
            btn.textContent = 'Kirim Donasi';
        });
    });
    
    DB.donasi.orderByChild('tanggal').limitToLast(50).on('value', (snapshot) => {
        const data = snapshot.val();
        const list = document.getElementById('donasi-list');
        if (!data) {
            list.innerHTML = '<p style="padding:20px;text-align:center;color:var(--text-secondary);">Belum ada donasi</p>';
            return;
        }
        
        const items = Object.keys(data).map(key => ({id: key, ...data[key]}))
            .sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal));
        const total = items.reduce((sum, i) => sum + i.nominal, 0);
        
        list.innerHTML = `
            <div style="padding:12px 20px;background:#e8f5e9;font-weight:bold;">Total Terkumpul: ${formatCurrency(total)}</div>
            ${items.map(item => `
                <div class="data-item">
                    <div class="content">
                        <div class="title">${item.nama}</div>
                        <div class="meta">${formatDate(item.tanggal)}</div>
                    </div>
                    <div style="font-weight:bold;color:#4CAF50;">${formatCurrency(item.nominal)}</div>
                </div>
            `).join('')}
        `;
    });
}

// ===== ROMBONGAN =====
function loadRombongan(container) {
    container.innerHTML = `
        <div class="page-title">
            <i class="fas fa-bus" style="color:var(--primary);margin-right:10px;"></i>
            Rombongan Malang
        </div>
        <div class="form-container">
            <h3><i class="fas fa-user-plus"></i> Daftar Rombongan</h3>
            <form id="rombongan-form">
                <div class="form-group">
                    <label>Nama Lengkap</label>
                    <input type="text" id="rombongan-nama" required>
                </div>
                <div class="form-group">
                    <label>Nomor HP</label>
                    <input type="tel" id="rombongan-hp" required>
                </div>
                <button type="submit" class="btn btn-primary">Daftar Sekarang</button>
            </form>
        </div>
        <div style="margin-top:20px;">
            <h3 style="color:var(--primary);margin-bottom:12px;"><i class="fas fa-users"></i> Peserta Terdaftar</h3>
            <div id="rombongan-list" class="data-list"></div>
        </div>
    `;
    
    document.getElementById('rombongan-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const nama = document.getElementById('rombongan-nama').value;
        const hp = document.getElementById('rombongan-hp').value;
        
        DB.rombongan.push({
            nama: nama,
            hp: hp,
            status_konfirmasi: 'menunggu',
            tanggal_daftar: new Date().toISOString()
        }).then(() => {
            showToast('Pendaftaran berhasil!', 'success');
            document.getElementById('rombongan-form').reset();
        }).catch(err => showToast('Error: ' + err.message, 'error'));
    });
    
    DB.rombongan.on('value', (snapshot) => {
        const data = snapshot.val();
        const list = document.getElementById('rombongan-list');
        if (!data) {
            list.innerHTML = '<p style="padding:20px;text-align:center;color:var(--text-secondary);">Belum ada peserta</p>';
            return;
        }
        
        const items = Object.keys(data).map(key => ({id: key, ...data[key]}));
        list.innerHTML = items.map(item => `
            <div class="data-item">
                <div class="content">
                    <div class="title">${item.nama}</div>
                    <div class="meta">
                        ${item.hp || '-'}
                        <span class="badge ${item.status_konfirmasi === 'confirmed' ? 'badge-success' : 'badge-warning'}">
                            ${item.status_konfirmasi || 'menunggu'}
                        </span>
                    </div>
                </div>
            </div>
        `).join('');
    });
}

// ===== KEDATANGAN NYAI =====
function loadKedatanganNyai(container) {
    container.innerHTML = `
        <div class="page-title">
            <i class="fas fa-user-tie" style="color:var(--primary);margin-right:10px;"></i>
            Kedatangan Nyai
        </div>
        <div class="form-container">
            <h3><i class="fas fa-user-plus"></i> Daftar Acara</h3>
            <form id="nyai-form">
                <div class="form-group">
                    <label>Nama</label>
                    <input type="text" id="nyai-nama" required>
                </div>
                <div class="form-group">
                    <label>Nomor HP</label>
                    <input type="tel" id="nyai-hp" required>
                </div>
                <button type="submit" class="btn btn-primary">Daftar</button>
            </form>
        </div>
        <div style="margin-top:20px;">
            <h3 style="color:var(--primary);margin-bottom:12px;"><i class="fas fa-users"></i> Pendaftar</h3>
            <div id="nyai-list" class="data-list"></div>
        </div>
    `;
    
    document.getElementById('nyai-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const nama = document.getElementById('nyai-nama').value;
        const hp = document.getElementById('nyai-hp').value;
        
        DB.kedatanganNyai.push({
            nama: nama,
            hp: hp,
            status_konfirmasi: 'menunggu',
            tanggal_daftar: new Date().toISOString()
        }).then(() => {
            showToast('Pendaftaran berhasil!', 'success');
            document.getElementById('nyai-form').reset();
        }).catch(err => showToast('Error: ' + err.message, 'error'));
    });
    
    DB.kedatanganNyai.on('value', (snapshot) => {
        const data = snapshot.val();
        const list = document.getElementById('nyai-list');
        if (!data) {
            list.innerHTML = '<p style="padding:20px;text-align:center;color:var(--text-secondary);">Belum ada pendaftar</p>';
            return;
        }
        
        const items = Object.keys(data).map(key => ({id: key, ...data[key]}));
        list.innerHTML = items.map(item => `
            <div class="data-item">
                <div class="content">
                    <div class="title">${item.nama}</div>
                    <div class="meta">
                        ${item.hp || '-'}
                        <span class="badge ${item.status_konfirmasi === 'confirmed' ? 'badge-success' : 'badge-warning'}">
                            ${item.status_konfirmasi || 'menunggu'}
                        </span>
                    </div>
                </div>
            </div>
        `).join('');
    });
}

// ===== AKHIR FILE =====
// TIDAK ADA KODE LAGI DI BAWAH INI