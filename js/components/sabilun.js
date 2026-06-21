function renderSabilun() {
    const amalan = loadData('amalan');
    const isAdmin = window.isAdmin ? window.isAdmin() : false;
    let html = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem;">
            <h3>Daftar Amalan</h3>
            ${isAdmin ? `<button class="btn btn-success btn-sm" onclick="tambahAmalan()"><i class="fas fa-plus"></i> Tambah</button>` : ''}
        </div>
        <div class="table-wrap">
            <table>
                <thead><tr><th>#</th><th>Judul</th><th>Teks</th>${isAdmin ? '<th>Aksi</th>' : ''}</tr></thead>
                <tbody>
    `;
    amalan.forEach((a, idx) => {
        html += `<tr>
            <td>${idx+1}</td>
            <td><strong>${a.judul}</strong></td>
            <td>${a.teks.substring(0, 50)}${a.teks.length > 50 ? '...' : ''}</td>
            ${isAdmin ? `<td>
                <button class="btn btn-warning btn-sm" onclick="editAmalan(${a.id})"><i class="fas fa-edit"></i></button>
                <button class="btn btn-danger btn-sm" onclick="hapusAmalan(${a.id})"><i class="fas fa-trash"></i></button>
            </td>` : ''}
        </tr>`;
    });
    html += `</tbody></table></div>`;
    document.getElementById('pageContent').innerHTML = html;
}

// Fungsi CRUD (dipanggil dari tombol)
function tambahAmalan() {
    showModal('Tambah Amalan', `
        <div class="form-group"><label>Judul</label><input id="f_judul" class="form-control" /></div>
        <div class="form-group"><label>Teks</label><textarea id="f_teks" class="form-control" rows="3"></textarea></div>
    `, () => {
        const judul = document.getElementById('f_judul').value.trim();
        const teks = document.getElementById('f_teks').value.trim();
        if (!judul || !teks) return alert('Isi semua field!');
        const amalan = loadData('amalan');
        amalan.push({ id: genId(amalan), judul, teks });
        saveData('amalan', amalan);
        closeModal();
        renderSabilun();
    });
}

function editAmalan(id) {
    const amalan = loadData('amalan');
    const item = amalan.find(a => a.id === id);
    if (!item) return;
    showModal('Edit Amalan', `
        <div class="form-group"><label>Judul</label><input id="f_judul" class="form-control" value="${item.judul}" /></div>
        <div class="form-group"><label>Teks</label><textarea id="f_teks" class="form-control" rows="3">${item.teks}</textarea></div>
    `, () => {
        const judul = document.getElementById('f_judul').value.trim();
        const teks = document.getElementById('f_teks').value.trim();
        if (!judul || !teks) return alert('Isi semua field!');
        const idx = amalan.findIndex(a => a.id === id);
        amalan[idx] = { id, judul, teks };
        saveData('amalan', amalan);
        closeModal();
        renderSabilun();
    });
}

function hapusAmalan(id) {
    if (!confirm('Yakin hapus?')) return;
    let amalan = loadData('amalan');
    amalan = amalan.filter(a => a.id !== id);
    saveData('amalan', amalan);
    renderSabilun();
}

// Ekspor agar bisa dipanggil dari HTML (onclick)
window.tambahAmalan = tambahAmalan;
window.editAmalan = editAmalan;
window.hapusAmalan = hapusAmalan;