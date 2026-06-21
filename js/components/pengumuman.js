function renderPengumuman() {
    const pengumuman = loadData('pengumuman');
    const isAdmin = window.isAdmin ? window.isAdmin() : false;
    let html = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem;">
            <h3>Pengumuman</h3>
            ${isAdmin ? `<button class="btn btn-success btn-sm" onclick="tambahPengumuman()"><i class="fas fa-plus"></i> Tambah</button>` : ''}
        </div>
    `;
    if (pengumuman.length === 0) {
        html += `<p>Tidak ada pengumuman.</p>`;
    } else {
        html += `<div class="table-wrap"><table><thead><tr><th>#</th><th>Judul</th><th>Isi</th>${isAdmin ? '<th>Aksi</th>' : ''}</tr></thead><tbody>`;
        pengumuman.forEach((p, idx) => {
            html += `<tr>
                <td>${idx+1}</td>
                <td><strong>${p.judul}</strong></td>
                <td>${p.isi}</td>
                ${isAdmin ? `<td>
                    <button class="btn btn-warning btn-sm" onclick="editPengumuman(${p.id})"><i class="fas fa-edit"></i></button>
                    <button class="btn btn-danger btn-sm" onclick="hapusPengumuman(${p.id})"><i class="fas fa-trash"></i></button>
                </td>` : ''}
            </tr>`;
        });
        html += `</tbody></table></div>`;
    }
    document.getElementById('pageContent').innerHTML = html;
}

function tambahPengumuman() {
    showModal('Tambah Pengumuman', `
        <div class="form-group"><label>Judul</label><input id="f_judul" class="form-control" /></div>
        <div class="form-group"><label>Isi</label><textarea id="f_isi" class="form-control" rows="3"></textarea></div>
    `, () => {
        const judul = document.getElementById('f_judul').value.trim();
        const isi = document.getElementById('f_isi').value.trim();
        if (!judul || !isi) return alert('Isi semua field!');
        const pengumuman = loadData('pengumuman');
        pengumuman.push({ id: genId(pengumuman), judul, isi });
        saveData('pengumuman', pengumuman);
        closeModal();
        renderPengumuman();
    });
}

function editPengumuman(id) {
    const pengumuman = loadData('pengumuman');
    const item = pengumuman.find(p => p.id === id);
    if (!item) return;
    showModal('Edit Pengumuman', `
        <div class="form-group"><label>Judul</label><input id="f_judul" class="form-control" value="${item.judul}" /></div>
        <div class="form-group"><label>Isi</label><textarea id="f_isi" class="form-control" rows="3">${item.isi}</textarea></div>
    `, () => {
        const judul = document.getElementById('f_judul').value.trim();
        const isi = document.getElementById('f_isi').value.trim();
        if (!judul || !isi) return alert('Isi semua field!');
        const idx = pengumuman.findIndex(p => p.id === id);
        pengumuman[idx] = { id, judul, isi };
        saveData('pengumuman', pengumuman);
        closeModal();
        renderPengumuman();
    });
}

function hapusPengumuman(id) {
    if (!confirm('Hapus pengumuman?')) return;
    let pengumuman = loadData('pengumuman');
    pengumuman = pengumuman.filter(p => p.id !== id);
    saveData('pengumuman', pengumuman);
    renderPengumuman();
}

window.tambahPengumuman = tambahPengumuman;
window.editPengumuman = editPengumuman;
window.hapusPengumuman = hapusPengumuman;