// components/pengumuman.js - Papan Pengumuman Digital

import { getData, saveData, DATA_KEYS } from '../utils/storage.js';
import { isAdmin } from '../utils/auth.js';

export function renderPengumuman({ user, isAdmin: isAdminUser }) {
    const pengumuman = getData(DATA_KEYS.PENGUMUMAN) || [];
    const sorted = [...pengumuman].sort((a, b) => {
        // High priority first, then by date
        if (a.priority === 'high' && b.priority !== 'high') return -1;
        if (a.priority !== 'high' && b.priority === 'high') return 1;
        return new Date(b.date) - new Date(a.date);
    });
    
    return `
        <div class="page-container">
            <div class="card">
                <div class="card-title">
                    <i class="fas fa-bullhorn"></i> Papan Pengumuman
                    ${isAdminUser ? `
                        <button onclick="showTambahPengumuman()" class="btn btn-primary btn-sm" style="margin-left: auto;">
                            <i class="fas fa-plus"></i> Tambah Pengumuman
                        </button>
                    ` : ''}
                </div>
                
                ${sorted.length > 0 ? sorted.map(p => `
                    <div style="
                        padding: 16px;
                        margin-bottom: 12px;
                        border-radius: 8px;
                        border-left: 4px solid ${p.priority === 'high' ? '#dc3545' : 'var(--secondary)'};
                        background: ${p.priority === 'high' ? '#fff5f5' : 'var(--bg)'};
                        position: relative;
                    ">
                        ${p.priority === 'high' ? `
                            <span style="
                                position: absolute;
                                top: 8px;
                                right: 8px;
                                background: #dc3545;
                                color: white;
                                padding: 2px 10px;
                                border-radius: 12px;
                                font-size: 11px;
                                font-weight: 600;
                            ">Penting</span>
                        ` : ''}
                        
                        <h4 style="margin: 0 0 8px 0; color: var(--primary);">${p.title}</h4>
                        <p style="margin: 0 0 8px 0; color: var(--text);">${p.content}</p>
                        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap;">
                            <small style="color: var(--text-light);">
                                <i class="far fa-calendar-alt"></i> ${formatDate(p.date)}
                            </small>
                            ${isAdminUser ? `
                                <div style="display: flex; gap: 8px;">
                                    <button onclick="editPengumuman(${p.id})" class="btn btn-sm btn-outline">
                                        <i class="fas fa-edit"></i>
                                    </button>
                                    <button onclick="deletePengumuman(${p.id})" class="btn btn-sm btn-danger">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </div>
                            ` : ''}
                        </div>
                    </div>
                `).join('') : `
                    <div style="text-align: center; padding: 40px 0; color: var(--text-light);">
                        <i class="fas fa-info-circle" style="font-size: 32px; display: block; margin-bottom: 12px;"></i>
                        Belum ada pengumuman.
                        ${isAdminUser ? ' Klik "Tambah Pengumuman" untuk menambahkan.' : ''}
                    </div>
                `}
            </div>
        </div>
    `;
}

// ===== HELPER FUNCTIONS =====
function formatDate(dateStr) {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return date.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
}

// ===== GLOBAL FUNCTIONS =====
window.showTambahPengumuman = function() {
    if (!isAdmin()) return;
    const modal = createModal(`
        <h3>Tambah Pengumuman</h3>
        <form id="tambah-pengumuman-form">
            <div class="form-group">
                <label>Judul Pengumuman</label>
                <input type="text" id="pengumuman-title" placeholder="Masukkan judul" required />
            </div>
            <div class="form-group">
                <label>Isi Pengumuman</label>
                <textarea id="pengumuman-content" rows="4" placeholder="Tulis pengumuman..." required></textarea>
            </div>
            <div class="form-group">
                <label>Prioritas</label>
                <select id="pengumuman-priority">
                    <option value="normal">Normal</option>
                    <option value="high">Penting</option>
                </select>
            </div>
            <div class="form-group">
                <label>Tanggal</label>
                <input type="date" id="pengumuman-date" value="${new Date().toISOString().split('T')[0]}" required />
            </div>
            <button type="submit" class="btn btn-primary btn-block">Publikasikan</button>
        </form>
    `);
    
    document.body.appendChild(modal);
    
    document.getElementById('tambah-pengumuman-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const title = document.getElementById('pengumuman-title').value.trim();
        const content = document.getElementById('pengumuman-content').value.trim();
        const priority = document.getElementById('pengumuman-priority').value;
        const date = document.getElementById('pengumuman-date').value;
        
        if (!title || !content) {
            alert('Judul dan isi pengumuman wajib diisi!');
            return;
        }
        
        const pengumuman = getData(DATA_KEYS.PENGUMUMAN) || [];
        const newPengumuman = {
            id: Date.now(),
            title,
            content,
            priority,
            date,
        };
        pengumuman.push(newPengumuman);
        saveData(DATA_KEYS.PENGUMUMAN, pengumuman);
        modal.remove();
        renderPengumumanRefresh();
        alert('Pengumuman berhasil dipublikasikan!');
    });
};

window.editPengumuman = function(id) {
    if (!isAdmin()) return;
    const pengumuman = getData(DATA_KEYS.PENGUMUMAN) || [];
    const p = pengumuman.find(item => item.id === id);
    if (!p) return;
    
    const modal = createModal(`
        <h3>Edit Pengumuman</h3>
        <form id="edit-pengumuman-form">
            <div class="form-group">
                <label>Judul Pengumuman</label>
                <input type="text" id="edit-pengumuman-title" value="${p.title}" required />
            </div>
            <div class="form-group">
                <label>Isi Pengumuman</label>
                <textarea id="edit-pengumuman-content" rows="4" required>${p.content}</textarea>
            </div>
            <div class="form-group">
                <label>Prioritas</label>
                <select id="edit-pengumuman-priority">
                    <option value="normal" ${p.priority === 'normal' ? 'selected' : ''}>Normal</option>
                    <option value="high" ${p.priority === 'high' ? 'selected' : ''}>Penting</option>
                </select>
            </div>
            <div class="form-group">
                <label>Tanggal</label>
                <input type="date" id="edit-pengumuman-date" value="${p.date}" required />
            </div>
            <button type="submit" class="btn btn-primary btn-block">Update Pengumuman</button>
        </form>
    `);
    
    document.body.appendChild(modal);
    
    document.getElementById('edit-pengumuman-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const title = document.getElementById('edit-pengumuman-title').value.trim();
        const content = document.getElementById('edit-pengumuman-content').value.trim();
        const priority = document.getElementById('edit-pengumuman-priority').value;
        const date = document.getElementById('edit-pengumuman-date').value;
        
        if (!title || !content) {
            alert('Judul dan isi pengumuman wajib diisi!');
            return;
        }
        
        const pengumuman = getData(DATA_KEYS.PENGUMUMAN) || [];
        const index = pengumuman.findIndex(item => item.id === id);
        if (index !== -1) {
            pengumuman[index] = { ...pengumuman[index], title, content, priority, date };
            saveData(DATA_KEYS.PENGUMUMAN, pengumuman);
            modal.remove();
            renderPengumumanRefresh();
            alert('Pengumuman berhasil diupdate!');
        }
    });
};

window.deletePengumuman = function(id) {
    if (!isAdmin()) return;
    if (!confirm('Yakin ingin menghapus pengumuman ini?')) return;
    
    let pengumuman = getData(DATA_KEYS.PENGUMUMAN) || [];
    pengumuman = pengumuman.filter(p => p.id !== id);
    saveData(DATA_KEYS.PENGUMUMAN, pengumuman);
    renderPengumumanRefresh();
    alert('Pengumuman berhasil dihapus!');
};

function renderPengumumanRefresh() {
    const user = JSON.parse(localStorage.getItem('harum_session') || '{}');
    const isAdminUser = user.role === 'admin';
    const container = document.querySelector('#content-area');
    if (container) {
        container.innerHTML = renderPengumuman({ user, isAdmin: isAdminUser });
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