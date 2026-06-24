function loadAdminPanel(container) {
    if (!isAdmin) {
        container.innerHTML = `
            <div style="text-align:center;padding:40px;">
                <div style="font-size:64px;margin-bottom:20px;">🚫</div>
                <h2 style="color:var(--danger);">Akses Ditolak</h2>
                <p style="color:var(--text-secondary);">Anda tidak memiliki izin untuk mengakses halaman ini.</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = `
        <div class="page-title">
            <i class="fas fa-cog" style="color:var(--primary);margin-right:10px;"></i>
            Admin Panel
        </div>
        <div style="display:flex;gap:12px;overflow-x:auto;padding-bottom:12px;margin-bottom:16px;" id="admin-tabs">
            ${['pengumuman', 'artikel', 'anggota', 'iuran', 'transaksi', 'donasi', 'rombongan', 'nyai'].map(tab => `
                <button class="btn btn-sm ${tab === 'pengumuman' ? 'btn-primary' : 'btn-secondary'}" 
                        onclick="switchAdminTab('${tab}')"
                        data-tab="${tab}">
                    ${tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
            `).join('')}
        </div>
        <div id="admin-content"></div>
    `;
    
    switchAdminTab('pengumuman');
}

let currentAdminTab = 'pengumuman';
let adminData = [];

function switchAdminTab(tab) {
    currentAdminTab = tab;
    
    document.querySelectorAll('#admin-tabs .btn').forEach(btn => {
        btn.className = `btn btn-sm ${btn.dataset.tab === tab ? 'btn-primary' : 'btn-secondary'}`;
    });
    
    const container = document.getElementById('admin-content');
    container.innerHTML = `
        <div style="display:flex;gap:12px;margin-bottom:16px;">
            <button class="btn btn-success btn-sm" onclick="showAddForm()">
                <i class="fas fa-plus"></i> Tambah
            </button>
            <button class="btn btn-secondary btn-sm" onclick="refreshAdminData()">
                <i class="fas fa-sync"></i> Refresh
            </button>
        </div>
        <div id="admin-list" style="background:white;border-radius:12px;box-shadow:0 2px 8px rgba(0,0,0,0.1);padding:8px;">
            <p style="color:var(--text-secondary);text-align:center;padding:20px;">Memuat data...</p>
        </div>
    `;
    
    loadAdminData(tab);
}

function loadAdminData(tab) {
    const refs = {
        'pengumuman': DB.pengumuman,
        'artikel': DB.artikel,
        'anggota': DB.anggota,
        'iuran': DB.iuran,
        'transaksi': DB.transaksi,
        'donasi': DB.donasi,
        'rombongan': DB.rombongan,
        'nyai': DB.kedatanganNyai
    };
    
    const ref = refs[tab];
    if (!ref) return;
    
    ref.on('value', (snapshot) => {
        const data = snapshot.val();
        adminData = data ? Object.keys(data).map(key => ({
            id: key,
            ...data[key]
        })) : [];
        renderAdminList(tab, adminData);
    });
}

function renderAdminList(tab, data) {
    const container = document.getElementById('admin-list');
    if (!container) return;
    
    if (data.length === 0) {
        container.innerHTML = `<p style="color:var(--text-secondary);text-align:center;padding:20px;">Tidak ada data</p>`;
        return;
    }
    
    container.innerHTML = data.map(item => `
        <div class="data-item">
            <div class="content">
                <div class="title">${item.judul || item.nama || item.hp || 'Data'}</div>
                <div class="meta">
                    ${item.tanggal ? formatDate(item.tanggal) : ''}
                    ${item.nominal ? formatCurrency(item.nominal) : ''}
                    ${item.status ? `<span class="badge ${item.status === 'lunas' ? 'badge-success' : 'badge-warning'}">${item.status}</span>` : ''}
                </div>
            </div>
            <div class="actions">
                <button class="edit-btn" onclick="editAdminItem('${tab}', '${item.id}')">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="delete-btn" onclick="deleteAdminItem('${tab}', '${item.id}')">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
}

function showAddForm() {
    const container = document.getElementById('admin-content');
    const form = document.createElement('div');
    form.className = 'form-container';
    form.id = 'admin-form';
    
    form.innerHTML = `
        <h3><i class="fas fa-plus-circle"></i> Tambah ${currentAdminTab.charAt(0).toUpperCase() + currentAdminTab.slice(1)}</h3>
        <form id="admin-form-fields">
            <div class="form-group">
                <label>Judul</label>
                <input type="text" id="form-judul" required>
            </div>
            <div class="form-group">
                <label>Konten</label>
                <textarea id="form-konten" rows="4"></textarea>
            </div>
            <div class="form-actions">
                <button type="button" class="btn btn-secondary" onclick="cancelAdminForm()">Batal</button>
                <button type="submit" class="btn btn-success">Simpan</button>
            </div>
        </form>
    `;
    
    const list = document.getElementById('admin-list');
    container.insertBefore(form, list);
    
    document.getElementById('admin-form-fields').addEventListener('submit', handleAdminFormSubmit);
}

function cancelAdminForm() {
    const form = document.getElementById('admin-form');
    if (form) form.remove();
}

let editingItemId = null;

function editAdminItem(tab, id) {
    editingItemId = id;
    const item = adminData.find(d => d.id === id);
    if (!item) return;
    
    showAddForm();
    document.getElementById('form-judul').value = item.judul || item.nama || '';
    document.getElementById('form-konten').value = item.isi || item.konten || '';
    document.querySelector('#admin-form h3').textContent = `Edit ${tab.charAt(0).toUpperCase() + tab.slice(1)}`;
}

function handleAdminFormSubmit(e) {
    e.preventDefault();
    
    const data = {
        judul: document.getElementById('form-judul').value,
        isi: document.getElementById('form-konten').value,
        tanggal: new Date().toISOString()
    };
    
    const refs = {
        'pengumuman': DB.pengumuman,
        'artikel': DB.artikel,
        'anggota': DB.anggota,
        'iuran': DB.iuran,
        'transaksi': DB.transaksi,
        'donasi': DB.donasi,
        'rombongan': DB.rombongan,
        'nyai': DB.kedatanganNyai
    };
    
    const ref = refs[currentAdminTab];
    if (!ref) return;
    
    const saveBtn = e.target.querySelector('button[type="submit"]');
    saveBtn.disabled = true;
    saveBtn.textContent = 'Menyimpan...';
    
    if (editingItemId) {
        ref.child(editingItemId).update(data)
            .then(() => {
                showToast('Data berhasil diupdate', 'success');
                cancelAdminForm();
                editingItemId = null;
                saveBtn.disabled = false;
                saveBtn.textContent = 'Simpan';
            })
            .catch(err => {
                showToast('Error: ' + err.message, 'error');
                saveBtn.disabled = false;
                saveBtn.textContent = 'Simpan';
            });
    } else {
        ref.push(data)
            .then(() => {
                showToast('Data berhasil ditambahkan', 'success');
                cancelAdminForm();
                saveBtn.disabled = false;
                saveBtn.textContent = 'Simpan';
            })
            .catch(err => {
                showToast('Error: ' + err.message, 'error');
                saveBtn.disabled = false;
                saveBtn.textContent = 'Simpan';
            });
    }
}

function deleteAdminItem(tab, id) {
    if (!confirm('Apakah Anda yakin ingin menghapus data ini?')) return;
    
    const refs = {
        'pengumuman': DB.pengumuman,
        'artikel': DB.artikel,
        'anggota': DB.anggota,
        'iuran': DB.iuran,
        'transaksi': DB.transaksi,
        'donasi': DB.donasi,
        'rombongan': DB.rombongan,
        'nyai': DB.kedatanganNyai
    };
    
    const ref = refs[tab];
    if (!ref) return;
    
    ref.child(id).remove()
        .then(() => showToast('Data berhasil dihapus', 'success'))
        .catch(err => showToast('Error: ' + err.message, 'error'));
}

function refreshAdminData() {
    loadAdminData(currentAdminTab);
    showToast('Data di-refresh', 'success');
}