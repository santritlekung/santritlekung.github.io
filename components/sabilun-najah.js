// components/sabilun-najah.js - Sabilun Najah (Amalan)

import { getData, saveData, DATA_KEYS } from '../utils/storage.js';
import { isAdmin } from '../utils/auth.js';

let selectedAmalan = null;

export function renderSabilunNajah({ user, isAdmin: isAdminUser }) {
    const amalan = getData(DATA_KEYS.AMALAN) || {};
    const amalanList = Object.entries(amalan);
    
    return `
        <div class="page-container">
            <div class="card">
                <div class="card-title">
                    <i class="fas fa-book-quran"></i> Sabilun Najah
                    <span style="font-size: 14px; font-weight: 400; color: var(--text-light); margin-left: 8px;">
                        Kumpulan Amalan Syaikhuna Siddiq Abdullah
                    </span>
                    ${isAdminUser ? `
                        <button onclick="showAddAmalan()" class="btn btn-primary btn-sm" style="margin-left: auto;">
                            <i class="fas fa-plus"></i> Tambah Amalan
                        </button>
                    ` : ''}
                </div>
                
                <div style="display: grid; grid-template-columns: 1fr 2fr; gap: 20px;">
                    <!-- List Amalan -->
                    <div>
                        <h4 style="margin-bottom: 12px; color: var(--text-light);">Daftar Amalan</h4>
                        <div class="amalan-list">
                            ${amalanList.length > 0 ? amalanList.map(([key, data]) => `
                                <div class="amalan-item" onclick="selectAmalan('${key}')">
                                    <h4>${data.title}</h4>
                                    <p>${data.description || ''}</p>
                                    ${isAdminUser ? `
                                        <div style="margin-top: 8px; display: flex; gap: 8px;">
                                            <button onclick="event.stopPropagation(); editAmalan('${key}')" 
                                                    class="btn btn-sm btn-outline">
                                                <i class="fas fa-edit"></i>
                                            </button>
                                            <button onclick="event.stopPropagation(); deleteAmalan('${key}')" 
                                                    class="btn btn-sm btn-danger">
                                                <i class="fas fa-trash"></i>
                                            </button>
                                        </div>
                                    ` : ''}
                                </div>
                            `).join('') : `
                                <p style="color: var(--text-light); text-align: center; padding: 20px;">
                                    Belum ada amalan. ${isAdminUser ? 'Klik "Tambah Amalan" untuk menambahkan.' : ''}
                                </p>
                            `}
                        </div>
                    </div>
                    
                    <!-- Detail Amalan -->
                    <div>
                        <h4 style="margin-bottom: 12px; color: var(--text-light);">Detail Amalan</h4>
                        <div id="amalan-detail" class="amalan-detail">
                            ${selectedAmalan && amalan[selectedAmalan] ? `
                                <h3>${amalan[selectedAmalan].title}</h3>
                                <p style="color: var(--text-light);">${amalan[selectedAmalan].description || ''}</p>
                                <div class="${amalan[selectedAmalan].arabic ? 'arabic-text' : ''}">
                                    ${amalan[selectedAmalan].content || 'Konten belum tersedia.'}
                                </div>
                            ` : `
                                <p style="color: var(--text-light); text-align: center; padding: 40px 0;">
                                    <i class="fas fa-hand-pointer" style="font-size: 32px; display: block; margin-bottom: 12px;"></i>
                                    Pilih amalan dari daftar di samping
                                </p>
                            `}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// ===== GLOBAL FUNCTIONS =====
window.selectAmalan = function(key) {
    selectedAmalan = key;
    const amalan = getData(DATA_KEYS.AMALAN) || {};
    const detail = document.getElementById('amalan-detail');
    if (detail && amalan[key]) {
        detail.innerHTML = `
            <h3>${amalan[key].title}</h3>
            <p style="color: var(--text-light);">${amalan[key].description || ''}</p>
            <div class="${amalan[key].arabic ? 'arabic-text' : ''}">
                ${amalan[key].content || 'Konten belum tersedia.'}
            </div>
            <div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid var(--border);">
                <small style="color: var(--text-light);">
                    <i class="fas fa-info-circle"></i> 
                    ${amalan[key].arabic ? 'Teks Arab' : 'Teks Latin'} 
                </small>
            </div>
        `;
    }
    // Refresh list to highlight selected
    renderSabilunNajahRefresh();
};

window.showAddAmalan = function() {
    if (!isAdmin()) return;
    const modal = createModal(`
        <h3>Tambah Amalan Baru</h3>
        <form id="add-amalan-form">
            <div class="form-group">
                <label>Key (slug)</label>
                <input type="text" id="amalan-key" placeholder="contoh: doa-pagi" required />
                <small style="color: var(--text-light);">Gunakan huruf kecil dan tanda hubung</small>
            </div>
            <div class="form-group">
                <label>Judul</label>
                <input type="text" id="amalan-title" placeholder="Judul amalan" required />
            </div>
            <div class="form-group">
                <label>Deskripsi</label>
                <input type="text" id="amalan-desc" placeholder="Deskripsi singkat" />
            </div>
            <div class="form-group">
                <label>Konten</label>
                <textarea id="amalan-content" rows="6" placeholder="Teks amalan" required></textarea>
            </div>
            <div class="form-group">
                <label>
                    <input type="checkbox" id="amalan-arabic" checked />
                    Teks Arab (gunakan font Amiri)
                </label>
            </div>
            <button type="submit" class="btn btn-primary btn-block">Simpan Amalan</button>
        </form>
    `);
    
    document.body.appendChild(modal);
    
    document.getElementById('add-amalan-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const key = document.getElementById('amalan-key').value.trim();
        const title = document.getElementById('amalan-title').value.trim();
        const description = document.getElementById('amalan-desc').value.trim();
        const content = document.getElementById('amalan-content').value.trim();
        const arabic = document.getElementById('amalan-arabic').checked;
        
        if (!key || !title || !content) {
            alert('Mohon isi semua field yang wajib!');
            return;
        }
        
        const amalan = getData(DATA_KEYS.AMALAN) || {};
        if (amalan[key]) {
            alert('Key sudah digunakan!');
            return;
        }
        
        amalan[key] = { title, description, content, arabic };
        saveData(DATA_KEYS.AMALAN, amalan);
        modal.remove();
        renderSabilunNajahRefresh();
        alert('Amalan berhasil ditambahkan!');
    });
};

window.editAmalan = function(key) {
    if (!isAdmin()) return;
    const amalan = getData(DATA_KEYS.AMALAN) || {};
    const data = amalan[key];
    if (!data) return;
    
    const modal = createModal(`
        <h3>Edit Amalan</h3>
        <form id="edit-amalan-form">
            <div class="form-group">
                <label>Judul</label>
                <input type="text" id="edit-amalan-title" value="${data.title}" required />
            </div>
            <div class="form-group">
                <label>Deskripsi</label>
                <input type="text" id="edit-amalan-desc" value="${data.description || ''}" />
            </div>
            <div class="form-group">
                <label>Konten</label>
                <textarea id="edit-amalan-content" rows="6" required>${data.content || ''}</textarea>
            </div>
            <div class="form-group">
                <label>
                    <input type="checkbox" id="edit-amalan-arabic" ${data.arabic ? 'checked' : ''} />
                    Teks Arab
                </label>
            </div>
            <button type="submit" class="btn btn-primary btn-block">Update Amalan</button>
        </form>
    `);
    
    document.body.appendChild(modal);
    
    document.getElementById('edit-amalan-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const title = document.getElementById('edit-amalan-title').value.trim();
        const description = document.getElementById('edit-amalan-desc').value.trim();
        const content = document.getElementById('edit-amalan-content').value.trim();
        const arabic = document.getElementById('edit-amalan-arabic').checked;
        
        if (!title || !content) {
            alert('Judul dan konten wajib diisi!');
            return;
        }
        
        const amalan = getData(DATA_KEYS.AMALAN) || {};
        amalan[key] = { title, description, content, arabic };
        saveData(DATA_KEYS.AMALAN, amalan);
        modal.remove();
        renderSabilunNajahRefresh();
        alert('Amalan berhasil diupdate!');
    });
};

window.deleteAmalan = function(key) {
    if (!isAdmin()) return;
    if (!confirm(`Yakin ingin menghapus amalan "${key}"?`)) return;
    
    const amalan = getData(DATA_KEYS.AMALAN) || {};
    delete amalan[key];
    saveData(DATA_KEYS.AMALAN, amalan);
    if (selectedAmalan === key) selectedAmalan = null;
    renderSabilunNajahRefresh();
    alert('Amalan berhasil dihapus!');
};

function renderSabilunNajahRefresh() {
    const user = JSON.parse(localStorage.getItem('harum_session') || '{}');
    const isAdminUser = user.role === 'admin';
    const container = document.querySelector('#content-area');
    if (container) {
        container.innerHTML = renderSabilunNajah({ user, isAdmin: isAdminUser });
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
        max-width: 600px;
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
    
    // Close on overlay click
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) overlay.remove();
    });
    
    return overlay;
}