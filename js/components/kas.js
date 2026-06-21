function renderKas() {
    const kas = loadData('kas');
    const isAdmin = window.isAdmin ? window.isAdmin() : false;
    const totalMasuk = kas.filter(k => k.tipe === 'masuk').reduce((s, k) => s + k.jumlah, 0);
    const totalKeluar = kas.filter(k => k.tipe === 'keluar').reduce((s, k) => s + k.jumlah, 0);
    const saldo = totalMasuk - totalKeluar;
    let html = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem;">
            <h3>Laporan Kas</h3>
            ${isAdmin ? `<button class="btn btn-success btn-sm" onclick="tambahTransaksi()"><i class="fas fa-plus"></i> Tambah</button>` : ''}
        </div>
        <div class="row" style="margin-bottom:1.5rem;">
            <div class="stat-card"><div class="num">Rp ${totalMasuk.toLocaleString()}</div><div class="label">Kas Masuk</div></div>
            <div class="stat-card"><div class="num">Rp ${totalKeluar.toLocaleString()}</div><div class="label">Kas Keluar</div></div>
            <div class="stat-card"><div class="num">Rp ${saldo.toLocaleString()}</div><div class="label">Saldo</div></div>
        </div>
        <div class="table-wrap">
            <table>
                <thead><tr><th>#</th><th>Tipe</th><th>Jumlah</th><th>Keterangan</th>${isAdmin ? '<th>Aksi</th>' : ''}</tr></thead>
                <tbody>
    `;
    kas.forEach((k, idx) => {
        html += `<tr>
            <td>${idx+1}</td>
            <td><span class="badge ${k.tipe === 'masuk' ? 'badge-success' : 'badge-danger'}">${k.tipe}</span></td>
            <td>Rp ${k.jumlah.toLocaleString()}</td>
            <td>${k.keterangan || '-'}</td>
            ${isAdmin ? `<td><button class="btn btn-danger btn-sm" onclick="hapusTransaksi(${k.id})"><i class="fas fa-trash"></i></button></td>` : ''}
        </tr>`;
    });
    html += `</tbody></table></div>`;
    document.getElementById('pageContent').innerHTML = html;
}

function tambahTransaksi() {
    showModal('Tambah Transaksi', `
        <div class="form-group"><label>Tipe</label>
            <select id="f_tipe" class="form-control"><option value="masuk">Kas Masuk</option><option value="keluar">Kas Keluar</option></select>
        </div>
        <div class="form-group"><label>Jumlah (Rp)</label><input id="f_jumlah" type="number" class="form-control" /></div>
        <div class="form-group"><label>Keterangan</label><input id="f_ket" class="form-control" /></div>
    `, () => {
        const tipe = document.getElementById('f_tipe').value;
        const jumlah = parseInt(document.getElementById('f_jumlah').value);
        const keterangan = document.getElementById('f_ket').value.trim();
        if (!jumlah || jumlah <= 0) return alert('Jumlah harus diisi!');
        const kas = loadData('kas');
        kas.push({ id: genId(kas), tipe, jumlah, keterangan });
        saveData('kas', kas);
        closeModal();
        renderKas();
    });
}

function hapusTransaksi(id) {
    if (!confirm('Hapus transaksi?')) return;
    let kas = loadData('kas');
    kas = kas.filter(k => k.id !== id);
    saveData('kas', kas);
    renderKas();
}

window.tambahTransaksi = tambahTransaksi;
window.hapusTransaksi = hapusTransaksi;