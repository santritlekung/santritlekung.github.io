let selectedAmalanId = null; // state untuk menyimpan id yang dipilih

function renderSabilun() {
    const amalan = loadData('amalan');
    const isAdmin = window.isAdmin ? window.isAdmin() : false;

    // Jika ada yang dipilih, tampilkan detail
    if (selectedAmalanId) {
        const item = amalan.find(a => a.id === selectedAmalanId);
        if (item) {
            showDetailAmalan(item);
            return;
        } else {
            selectedAmalanId = null; // reset jika data hilang
        }
    }

    // Tampilan daftar (blog list)
    let html = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.5rem;">
            <h3>📖 Sabilun Najah — Kumpulan Amalan</h3>
            ${isAdmin ? `<button class="btn btn-success btn-sm" onclick="tambahAmalan()"><i class="fas fa-plus"></i> Tambah Amalan</button>` : ''}
        </div>
        <div class="blog-list">
    `;
    amalan.forEach(a => {
        html += `
            <div class="blog-item" onclick="pilihAmalan(${a.id})">
                <strong>${a.judul}</strong>
                <span style="float:right; color:#94a3b8;"><i class="fas fa-chevron-right"></i></span>
            </div>
        `;
    });
    html += `</div>`;
    if (amalan.length === 0) {
        html += `<p style="color:#94a3b8;">Belum ada amalan. Tambahkan oleh admin.</p>`;
    }
    document.getElementById('pageContent').innerHTML = html;
}

function pilihAmalan(id) {
    selectedAmalanId = id;
    renderSabilun();
}

function showDetailAmalan(item) {
    const isAdmin = window.isAdmin ? window.isAdmin() : false;
    let html = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem;">
            <h3>${item.judul}</h3>
            <div>
                <button class="btn btn-outline btn-sm" onclick="kembaliKeDaftar()"><i class="fas fa-arrow-left"></i> Kembali</button>
                ${isAdmin ? `
                    <button class="btn btn-warning btn-sm" onclick="editAmalan(${item.id})"><i class="fas fa-edit"></i></button>
                    <button class="btn btn-danger btn-sm" onclick="hapusAmalan(${item.id})"><i class="fas fa-trash"></i></button>
                ` : ''}
            </div>
        </div>
        <div class="blog-detail">
            <div class="arab-text">${item.teks}</div>
        </div>
    `;
    document.getElementById('pageContent').innerHTML = html;
}

function kembaliKeDaftar() {
    selectedAmalanId = null;
    renderSabilun();
}

// Override fungsi tambah/edit/hapus agar setelah aksi kembali ke daftar
function tambahAmalan() {
    showModal('Tambah Amalan', `
        <div class="form-group"><label>Judul</label><input id="f_judul" class="form-control" /></div>
        <div class="form-group"><label>Teks (Arab)</label><textarea id="f_teks" class="form-control" rows="6" style="font-family:'Amiri',serif; direction:rtl;"></textarea></div>
    `, () => {
        const judul = document.getElementById('f_judul').value.trim();
        const teks = document.getElementById('f_teks').value.trim();
        if (!judul || !teks) return alert('Isi semua field!');
        const amalan = loadData('amalan');
        amalan.push({ id: genId(amalan), judul, teks });
        saveData('amalan', amalan);
        closeModal();
        selectedAmalanId = null;
        renderSabilun();
    });
}

function editAmalan(id) {
    const amalan = loadData('amalan');
    const item = amalan.find(a => a.id === id);
    if (!item) return;
    showModal('Edit Amalan', `
        <div class="form-group"><label>Judul</label><input id="f_judul" class="form-control" value="${item.judul}" /></div>
        <div class="form-group"><label>Teks (Arab)</label><textarea id="f_teks" class="form-control" rows="6" style="font-family:'Amiri',serif; direction:rtl;">${item.teks}</textarea></div>
    `, () => {
        const judul = document.getElementById('f_judul').value.trim();
        const teks = document.getElementById('f_teks').value.trim();
        if (!judul || !teks) return alert('Isi semua field!');
        const idx = amalan.findIndex(a => a.id === id);
        amalan[idx] = { id, judul, teks };
        saveData('amalan', amalan);
        closeModal();
        // Tampilkan detail yang sudah diupdate
        selectedAmalanId = id;
        renderSabilun();
    });
}

function hapusAmalan(id) {
    if (!confirm('Yakin hapus amalan ini?')) return;
    let amalan = loadData('amalan');
    amalan = amalan.filter(a => a.id !== id);
    saveData('amalan', amalan);
    selectedAmalanId = null;
    renderSabilun();
}

// Ekspos fungsi ke global
window.pilihAmalan = pilihAmalan;
window.kembaliKeDaftar = kembaliKeDaftar;
window.tambahAmalan = tambahAmalan;
window.editAmalan = editAmalan;
window.hapusAmalan = hapusAmalan;