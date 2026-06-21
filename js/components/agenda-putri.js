function renderAgendaPutri() {
    const data = loadData('agendaPutri');
    const isAdmin = window.isAdmin ? window.isAdmin() : false;
    let html = `
        <h3>Agenda Persiapan Putri Syaikhuna</h3>
        <div style="margin:1rem 0;">
            <p><strong>Rundown:</strong></p>
            <pre style="background:#f8fafc; padding:1rem; border-radius:12px;">${data.rundown || 'Belum diisi'}</pre>
            <p><strong>Logistik:</strong></p>
            <pre style="background:#f8fafc; padding:1rem; border-radius:12px;">${data.logistik || 'Belum diisi'}</pre>
        </div>
        ${isAdmin ? `<button class="btn btn-warning" onclick="editAgendaPutri()"><i class="fas fa-edit"></i> Edit</button>` : ''}
    `;
    document.getElementById('pageContent').innerHTML = html;
}

function editAgendaPutri() {
    const data = loadData('agendaPutri');
    showModal('Edit Agenda Putri', `
        <div class="form-group"><label>Rundown</label><textarea id="f_rundown" rows="4" class="form-control">${data.rundown || ''}</textarea></div>
        <div class="form-group"><label>Logistik</label><textarea id="f_logistik" rows="4" class="form-control">${data.logistik || ''}</textarea></div>
    `, () => {
        const rundown = document.getElementById('f_rundown').value.trim();
        const logistik = document.getElementById('f_logistik').value.trim();
        saveData('agendaPutri', { rundown, logistik });
        closeModal();
        renderAgendaPutri();
    });
}

window.editAgendaPutri = editAgendaPutri;