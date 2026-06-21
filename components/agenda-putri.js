// components/agenda-putri.js - Agenda Persiapan Kedatangan Putri Syaikhuna

import { getData, saveData, DATA_KEYS } from '../utils/storage.js';
import { isAdmin } from '../utils/auth.js';

export function renderAgendaPutri({ user, isAdmin: isAdminUser }) {
    const agenda = getData(DATA_KEYS.AGENDA_PUTRI) || {
        status: 'persiapan',
        tanggal_kedatangan: '',
        rundown: [],
        logistik: []
    };
    
    const statusMap = {
        'persiapan': '🔄 Dalam Persiapan',
        'siap': '✅ Siap Menyambut',
        'selesai': '📌 Selesai'
    };
    
    return `
        <div class="page-container">
            <div class="card">
                <div class="card-title">
                    <i class="fas fa-user-graduate"></i> Agenda Kedatangan Putri Syaikhuna
                    ${isAdminUser ? `
                        <button onclick="showEditAgendaPutri()" class="btn btn-primary btn-sm" style="margin-left: auto;">
                            <i class="fas fa-edit"></i> Edit Agenda
                        </button>
                    ` : ''}
                </div>
                
                <!-- Status -->
                <div style="background: var(--bg); padding: 16px; border-radius: 8px; margin-bottom: 20px;">
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 12px;">
                        <div>
                            <small style="color: var(--text-light);">Status</small>
                            <p style="font-size: 18px; font-weight: 600; margin: 4px 0; color: var(--primary);">
                                ${statusMap[agenda.status] || agenda.status}
                            </p>
                        </div>
                        <div>
                            <small style="color: var(--text-light);">Tanggal Kedatangan</small>
                            <p style="font-size: 18px; font-weight: 600; margin: 4px 0;">
                                ${agenda.tanggal_kedatangan ? formatDate(agenda.tanggal_kedatangan) : 'Belum ditentukan'}
                            </p>
                        </div>
                        <div>
                            <small style="color: var(--text-light);">Hari Menuju</small>
                            <p style="font-size: 18px; font-weight: 600; margin: 4px 0; color: var(--secondary);">
                                ${agenda.tanggal_kedatangan ? getDaysUntil(agenda.tanggal_kedatangan) : '-'}
                            </p>
                        </div>
                    </div>
                </div>
                
                <!-- Rundown -->
                <div style="margin-bottom: 20px;">
                    <h4 style="color: var(--text-light); margin-bottom: 12px;">
                        <i class="fas fa-clock"></i> Rundown Acara
                    </h4>
                    ${agenda.rundown && agenda.rundown.length > 0 ? `
                        <div style="display: grid; gap: 8px;">
                            ${agenda.rundown.map(item => `
                                <div style="
                                    display: flex;
                                    justify-content: space-between;
                                    align-items: center;
                                    padding: 10px 14px;
                                    background: var(--bg);
                                    border-radius: 6px;
                                    border-left: 3px solid var(--secondary);
                                ">
                                    <div>
                                        <strong>${item.waktu || '-'}</strong>
                                        <span style="margin-left: 12px;">${item.kegiatan || '-'}</span>
                                    </div>
                                    <small style="color: var(--text-light);">${item.penanggung_jawab || '-'}</small>
                                </div>
                            `).join('')}
                        </div>
                    ` : `
                        <p style="color: var(--text-light); text-align: center; padding: 20px 0;">
                            Belum ada rundown acara.
                        </p>
                    `}
                </div>
                
                <!-- Logistik -->
                <div>
                    <h4 style="color: var(--text-light); margin-bottom: 12px;">
                        <i class="fas fa-boxes"></i> Logistik
                    </h4>
                    ${agenda.logistik && agenda.logistik.length > 0 ? `
                        <div class="table-responsive">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Item</th>
                                        <th>Kuantitas</th>
                                        <th>Status</th>
                                        ${isAdminUser ? '<th>Aksi</th>' : ''}
                                    </tr>
                                </thead>
                                <tbody>
                                    ${agenda.logistik.map((item, index) => `
                                        <tr>
                                            <td>${item.item || '-'}</td>
                                            <td>${item.qty || 0}</td>
                                            <td>
                                                <span class="status-badge ${item.status === 'ready' ? 'lunas' : 'belum'}">
                                                    ${item.status === 'ready' ? '✅ Siap' : '⏳ Pending'}
                                                </span>
                                            </td>
                                            ${isAdminUser ? `
                                                <td>
                                                    <button onclick="toggleLogistikStatus(${index})" class="btn btn-sm ${item.status === 'ready' ? 'btn-outline' : 'btn-primary'}">
                                                        ${item.status === 'ready' ? 'Batalkan' : 'Siapkan'}
                                                    </button>
                                                    <button onclick="deleteLogistik(${index})" class="btn btn-sm btn-danger">
                                                        <i class="fas fa-trash"></i>
                                                    </button>
                                                </td>
                                            ` : ''}
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                    ` : `
                        <p style="color: var(--text-light); text-align: center; padding: 20px 0;">
                            Belum ada data logistik.
                        </p>
                    `}
                    ${isAdminUser ? `
                        <button onclick="showTambahLogistik()" class="btn btn-outline btn-sm" style="margin-top: 12px;">
                            <i class="fas fa-plus"></i> Tambah Logistik
                        </button>
                    ` : ''}
                </div>
            </div>
        </div>
    `;
}

// ===== HELPER FUNCTIONS =====
function formatDate(dateStr) {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return date.toLocaleDateString('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
}

function getDaysUntil(dateStr) {
    const target = new Date(dateStr);
    const now = new Date();
    const diff = Math.ceil((target - now) / (1000 * 60 * 60 * 24));
    if (diff < 0) return 'Sudah berlalu';
    if (diff === 0) return 'Hari ini! 🎉';
    return `${diff} hari lagi`;
}

// ===== GLOBAL FUNCTIONS =====
window.showEditAgendaPutri = function() {
    if (!isAdmin()) return;
    const agenda = getData(DATA_KEYS.AGENDA_PUTRI) || {};
    
    const modal = createModal(`
        <h3>Edit Agenda Putri</h3>
        <form id="edit-agenda-putri-form">
            <div class="form-group">
                <label>Status</label>
                <select id="edit-agenda-status">
                    <option value="persiapan" ${agenda.status === 'persiapan' ? 'selected' : ''}>Dalam Persiapan</option>
                    <option value="siap" ${agenda.status === 'siap' ? 'selected' : ''}>Siap Menyambut</option>
                    <option value="selesai" ${agenda.status === 'selesai' ? 'selected' : ''}>Selesai</option>
                </select>
            </div>
            <div class="form-group">
                <label>Tanggal Kedatangan</label>
                <input type="date" id="edit-agenda-tanggal" value="${agenda.tanggal_kedatangan || ''}" />
            </div>
            <div class="form-group">
                <label>Rundown Acara (format: Waktu|Kegiatan|Penanggung Jawab)</label>
                <textarea id="edit-agenda-rundown" rows="4" placeholder="Contoh:&#10;08:00|Pembukaan|Panitia&#10;09:00|Sambutan|H. Ahmad">${agenda.rundown ? agenda.rundown.map(r => `${r.waktu}|${r.kegiatan}|${r.penanggung_jawab}`).join('\n') : ''}</textarea>
                <small style="color: var(--text-light);">Pisahkan dengan garis vertikal (|) per item</small>
            </div>
            <button type="submit" class="btn btn-primary btn-block">Update Agenda</button>
        </form>
    `);
    
    document.body.appendChild(modal);
    
    document.getElementById('edit-agenda-putri-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const status = document.getElementById('edit-agenda-status').value;
        const tanggal = document.getElementById('edit-agenda-tanggal').value;
        const rundownText = document.getElementById('edit-agenda-rundown').value;
        
        const agenda = getData(DATA_KEYS.AGENDA_PUTRI) || {};
        agenda.status = status;
        agenda.tanggal_kedatangan = tanggal;
        
        // Parse rundown
        if (rundownText.trim()) {
            agenda.rundown = rundownText.split('\n')
                .filter(line => line.trim())
                .map(line => {
                    const parts = line.split('|').map(s => s.trim());
                    return {
                        waktu: parts[0] || '',
                        kegiatan: parts[1] || '',
                        penanggung_jawab: parts[2] || ''
                    };
                });
        }
        
        saveData(DATA_KEYS.AGENDA_PUTRI, agenda);
        modal.remove();
        renderAgendaPutriRefresh();
        alert('Agenda berhasil diupdate!');
    });
};

window.showTambahLogistik = function() {
    if (!isAdmin()) return;
    const modal = createModal(`
        <h3>Tambah Logistik</h3>
        <form id="tambah-logistik-form">
            <div class="form-group">
                <label>Nama Item</label>
                <input type="text" id="logistik-item" placeholder="Nama barang" required />
            </div>
            <div class="form-group">
                <label>Kuantitas</label>
                <input type="number" id="logistik-qty" placeholder="Jumlah" required min="1" />
            </div>
            <div class="form-group">
                <label>Status</label>
                <select id="logistik-status">
                    <option value="pending">Pending</option>
                    <option value="ready">Siap</option>
                </select>
            </div>
            <button type="submit" class="btn btn-primary btn-block">Tambah Logistik</button>
        </form>
    `);
    
    document.body.appendChild(modal);
    
    document.getElementById('tambah-logistik-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const item = document.getElementById('logistik-item').value.trim();
        const qty = parseInt(document.getElementById('logistik-qty').value);
        const status = document.getElementById('logistik-status').value;
        
        if (!item || !qty) {
            alert('Semua field wajib diisi!');
            return;
        }
        
        const agenda = getData(DATA_KEYS.AGENDA_PUTRI) || {};
        if (!agenda.logistik) agenda.logistik = [];
        agenda.logistik.push({ item, qty, status });
        saveData(DATA_KEYS.AGENDA_PUTRI, agenda);
        modal.remove();
        renderAgendaPutriRefresh();
        alert('Logistik berhasil ditambahkan!');
    });
};

window.toggleLogistikStatus = function(index) {
    if (!isAdmin()) return;
    const agenda = getData(DATA_KEYS.AGENDA_PUTRI) || {};
    if (agenda.logistik && agenda.logistik[index]) {
        const current = agenda.logistik[index].status;
        agenda.logistik[index].status = current === 'ready' ? 'pending' : 'ready';
        saveData(DATA_KEYS.AGENDA_PUTRI, agenda);
        renderAgendaPutriRefresh();
    }
};

window.deleteLogistik = function(index) {
    if (!isAdmin()) return;
    if (!confirm('Yakin ingin menghapus item logistik ini?')) return;
    const agenda = getData(DATA_KEYS.AGENDA_PUTRI) || {};
    if (agenda.logistik) {
        agenda.logistik.splice(index, 1);
        saveData(DATA_KEYS.AGENDA_PUTRI, agenda);
        renderAgendaPutriRefresh();
    }
};

function renderAgendaPutriRefresh() {
    const user = JSON.parse(localStorage.getItem('harum_session') || '{}');
    const isAdminUser = user.role === 'admin';
    const container = document.querySelector('#content-area');
    if (container) {
        container.innerHTML = renderAgendaPutri({ user, isAdmin: isAdminUser });
    }
}

function createModal(content) {
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        inset: 0;
        background: rgba(0,0,0,0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        padding: 20px;
        animation: fadeIn 0.3s ease;
    `;
    
    const modal = document.createElement('div');
    modal.style.cssText = `
        background: white;
        border-radius: 12px;
        padding: 32px;
        max-width: 500px;
        width: 100%;
        max-height: 90vh;
        overflow-y: auto;
        position: relative;
    `;
    
    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '×';
    closeBtn.style.cssText = `
        position: absolute;
        top: 12px;
        right: 16px;
        background: none;
        border: none;
        font-size: 28px;
        cursor: pointer;
        color: var(--text-light);
    `;
    closeBtn.onclick = () => overlay.remove();
    
    modal.innerHTML = content;
    modal.prepend(closeBtn);
    overlay.appendChild(modal);
    
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) overlay.remove();
    });
    
    return overlay;
}