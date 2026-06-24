function loadDashboard(container) {
    container.innerHTML = `
        <div class="page-title">
            <i class="fas fa-home" style="color:var(--primary);margin-right:10px;"></i>
            Beranda
        </div>
        <div class="card-grid" id="dashboard-cards"></div>
    `;
    
    loadDashboardData();
}

function loadDashboardData() {
    DB.pengumuman.on('value', (snapshot) => {
        const data = snapshot.val();
        const items = data ? Object.values(data) : [];
        updateDashboardCard('pengumuman', items);
    });
    
    DB.artikel.on('value', (snapshot) => {
        const data = snapshot.val();
        const items = data ? Object.values(data) : [];
        updateDashboardCard('artikel', items);
    });
    
    DB.iuran.on('value', (snapshot) => {
        const data = snapshot.val();
        const items = data ? Object.values(data) : [];
        updateDashboardCard('iuran', items);
    });
    
    DB.transaksi.on('value', (snapshot) => {
        const data = snapshot.val();
        const items = data ? Object.values(data) : [];
        updateDashboardCard('transaksi', items);
    });
    
    DB.donasi.on('value', (snapshot) => {
        const data = snapshot.val();
        const items = data ? Object.values(data) : [];
        updateDashboardCard('donasi', items);
    });
    
    DB.rombongan.on('value', (snapshot) => {
        const data = snapshot.val();
        const items = data ? Object.values(data) : [];
        updateDashboardCard('rombongan', items);
    });
    
    DB.kedatanganNyai.on('value', (snapshot) => {
        const data = snapshot.val();
        const items = data ? Object.values(data) : [];
        updateDashboardCard('nyai', items);
    });
}

function updateDashboardCard(type, data) {
    const container = document.getElementById('dashboard-cards');
    if (!container) return;
    
    const configs = {
        'pengumuman': {
            icon: '📢',
            color: '#FF6B6B',
            title: 'Pengumuman',
            getValue: () => data.length > 0 ? data[0].judul || 'Ada pengumuman' : 'Tidak ada',
            getSubtitle: () => data.length > 0 ? `${data.length} pengumuman` : '',
            page: 'pengumuman'
        },
        'artikel': {
            icon: '📖',
            color: '#4ECDC4',
            title: 'Artikel',
            getValue: () => data.length > 0 ? data[0].judul || 'Ada artikel' : 'Tidak ada',
            getSubtitle: () => data.length > 0 ? `${data.length} artikel` : '',
            page: 'artikel'
        },
        'iuran': {
            icon: '📅',
            color: '#45B7D1',
            title: 'Jumat Pahing',
            getValue: () => {
                const active = data.filter(d => d.status === 'lunas').length;
                return `${active} anggota aktif`;
            },
            getSubtitle: () => {
                const total = data.reduce((sum, d) => sum + (d.nominal || 0), 0);
                return `Total: ${formatCurrency(total)}`;
            },
            page: 'jumat-pahing'
        },
        'transaksi': {
            icon: '💰',
            color: '#96CEB4',
            title: 'Saldo Kas',
            getValue: () => {
                const total = data.reduce((sum, d) => sum + (d.jenis === 'masuk' ? d.nominal : -d.nominal), 0);
                return formatCurrency(total);
            },
            getSubtitle: () => 'Klik untuk detail',
            page: 'kas'
        },
        'donasi': {
            icon: '🤲',
            color: '#F7DC6F',
            title: 'Donasi Haul',
            getValue: () => {
                const total = data.reduce((sum, d) => sum + (d.nominal || 0), 0);
                return formatCurrency(total);
            },
            getSubtitle: () => `${data.length} donatur`,
            page: 'donasi-haul'
        },
        'rombongan': {
            icon: '🚌',
            color: '#85C1E9',
            title: 'Rombongan Malang',
            getValue: () => `${data.length} peserta`,
            getSubtitle: () => 'Klik untuk daftar',
            page: 'rombongan'
        },
        'nyai': {
            icon: '👩',
            color: '#F1948A',
            title: 'Kedatangan Nyai',
            getValue: () => `${data.length} terdaftar`,
            getSubtitle: () => 'Klik untuk info acara',
            page: 'kedatangan-nyai'
        }
    };
    
    const config = configs[type];
    if (!config) return;
    
    let card = container.querySelector(`[data-type="${type}"]`);
    if (!card) {
        card = document.createElement('div');
        card.className = 'card';
        card.dataset.type = type;
        card.style.borderLeftColor = config.color;
        container.appendChild(card);
    }
    
    card.innerHTML = `
        <div style="font-size:28px;margin-bottom:8px;">${config.icon}</div>
        <div class="card-title">${config.title}</div>
        <div class="card-value">${config.getValue()}</div>
        <div class="card-subtitle">${config.getSubtitle()}</div>
    `;
    
    card.onclick = () => navigateTo(config.page);
}