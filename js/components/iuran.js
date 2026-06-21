function renderIuran() {
    const anggota = loadData('anggota');
    const isAdmin = window.isAdmin ? window.isAdmin() : false;
    let html = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem;">
            <h3>Iuran Jumat Pahing</h3>
            ${isAdmin ? `<button class="btn btn-success btn-sm" onclick="tambahAnggota()"><i class="fas fa-plus"></i> Tambah Anggota</button>` : ''}
        </div>
        <div class="table-wrap">
            <table>
                <thead><tr><th>#</th><th>Nama</th><th>Status</th>${isAdmin ? '<th>Aksi</th>' : ''}</tr></thead>
                <tbody>
    `;
    anggota.forEach((a, idx) => {
        const badge = a.status === 'Lunas' ? 'badge-success' : 'badge-danger';
        html += `<tr>
            <td>${idx+1}</td>
            <td>${a.nama}</td>
            <td><span class="badge ${badge}">${a.status}</span></td>
            ${isAdmin ? `<td>
                <button class="btn btn-warning btn-sm" onclick="toggleStatus(${a.id})"><i class="fas fa-sync"></i></button>
                <button class="btn btn-danger btn-sm" onclick="hapusAnggota(${a.id})"><i class="fas fa-trash"></i></button>
            </td>` : ''}
        </tr>`;
    });
    html += `</tbody></table></div>`;
    document.getElementById('pageContent').innerHTML = html;
}

function tambahAnggota() {
    showModal('Tambah Anggota', `
        <div class="form-group"><label>Nama</label><input id="f_nama" class="form-control" /></div>
        <div class="form-group"><label>Status</label>
            <select id="f_status" class="form-control"><option value="Lunas">Lunas</option><option value="Belum">Belum</option></select>
        </div>
    `, () => {
        const nama = document.getElementById('f_nama').value.trim();
        if (!nama) return alert('Nama harus diisi!');
        const status = document.getElementById('f_status').value;
        const anggota = loadData('anggota');
        anggota.push({ id: genId(anggota), nama, status });
        saveData('anggota', anggota);
        closeModal();
        renderIuran();
    });
}

function toggleStatus(id) {
    let anggota = loadData('anggota');
    const item = anggota.find(a => a.id === id);
    if (item) {
        item.status = item.status === 'Lunas' ? 'Belum' : 'Lunas';
        saveData('anggota', anggota);
        renderIuran();
    }
}

function hapusAnggota(id) {
    if (!confirm('Hapus anggota?')) return;
    let anggota = loadData('anggota');
    anggota = anggota.filter(a => a.id !== id);
    saveData('anggota', anggota);
    renderIuran();
}

window.tambahAnggota = tambahAnggota;
window.toggleStatus = toggleStatus;
window.hapusAnggota = hapusAnggota;