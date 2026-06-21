function renderIuranMalang() {
    const data = loadData('iuranMalang');
    const isAdmin = window.isAdmin ? window.isAdmin() : false;
    let html = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem;">
            <h3>Iuran Dana Rombongan ke Malang</h3>
            ${isAdmin ? `<button class="btn btn-success btn-sm" onclick="tambahPesertaMalang()"><i class="fas fa-plus"></i> Tambah Peserta</button>` : ''}
        </div>
        <div class="table-wrap">
            <table>
                <thead><tr><th>#</th><th>Nama</th><th>Status Bayar</th>${isAdmin ? '<th>Aksi</th>' : ''}</tr></thead>
                <tbody>
    `;
    data.forEach((p, idx) => {
        const badge = p.sudahBayar ? 'badge-success' : 'badge-danger';
        const label = p.sudahBayar ? 'Sudah' : 'Belum';
        html += `<tr>
            <td>${idx+1}</td>
            <td>${p.nama}</td>
            <td><span class="badge ${badge}">${label}</span></td>
            ${isAdmin ? `<td>
                <button class="btn btn-warning btn-sm" onclick="toggleBayarMalang(${p.id})"><i class="fas fa-sync"></i></button>
                <button class="btn btn-danger btn-sm" onclick="hapusPesertaMalang(${p.id})"><i class="fas fa-trash"></i></button>
            </td>` : ''}
        </tr>`;
    });
    html += `</tbody></table></div>`;
    document.getElementById('pageContent').innerHTML = html;
}

function tambahPesertaMalang() {
    showModal('Tambah Peserta', `
        <div class="form-group"><label>Nama</label><input id="f_nama" class="form-control" /></div>
    `, () => {
        const nama = document.getElementById('f_nama').value.trim();
        if (!nama) return alert('Nama harus diisi!');
        const data = loadData('iuranMalang');
        data.push({ id: genId(data), nama, sudahBayar: false });
        saveData('iuranMalang', data);
        closeModal();
        renderIuranMalang();
    });
}

function toggleBayarMalang(id) {
    let data = loadData('iuranMalang');
    const item = data.find(p => p.id === id);
    if (item) {
        item.sudahBayar = !item.sudahBayar;
        saveData('iuranMalang', data);
        renderIuranMalang();
    }
}

function hapusPesertaMalang(id) {
    if (!confirm('Hapus peserta?')) return;
    let data = loadData('iuranMalang');
    data = data.filter(p => p.id !== id);
    saveData('iuranMalang', data);
    renderIuranMalang();
}

window.tambahPesertaMalang = tambahPesertaMalang;
window.toggleBayarMalang = toggleBayarMalang;
window.hapusPesertaMalang = hapusPesertaMalang;