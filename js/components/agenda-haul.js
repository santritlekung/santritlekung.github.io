function renderAgendaHaul() {
    const data = loadData('agendaHaul');
    const isAdmin = window.isAdmin ? window.isAdmin() : false;
    let html = `
        <h3>Haul Akbar Syaikhuna</h3>
        <div style="margin:1rem 0; background:#f8fafc; padding:1.5rem; border-radius:16px;">
            <p>${data.info || 'Informasi belum tersedia.'}</p>
        </div>
        ${isAdmin ? `<button class="btn btn-warning" onclick="editAgendaHaul()"><i class="fas fa-edit"></i> Edit</button>` : ''}
    `;
    document.getElementById('pageContent').innerHTML = html;
}

function editAgendaHaul() {
    const data = loadData('agendaHaul');
    showModal('Edit Info Haul', `
        <div class="form-group"><label>Informasi Haul</label><textarea id="f_info" rows="4" class="form-control">${data.info || ''}</textarea></div>
    `, () => {
        const info = document.getElementById('f_info').value.trim();
        saveData('agendaHaul', { info });
        closeModal();
        renderAgendaHaul();
    });
}

window.editAgendaHaul = editAgendaHaul;