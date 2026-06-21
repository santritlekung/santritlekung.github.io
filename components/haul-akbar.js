// components/haul-akbar.js - Haul Akbar Syaikhuna

import { getData, saveData, DATA_KEYS } from '../utils/storage.js';
import { isAdmin } from '../utils/auth.js';

export function renderHaulAkbar({ user, isAdmin: isAdminUser }) {
    const haul = getData(DATA_KEYS.HAUL) || {
        tahun: 1446,
        tanggal: '',
        tema: '',
        pembicara: [],
        jadwal: []
    };
    
    return `
        <div class="page-container">
            <div class="card">
                <div class="card-title">
                    <i class="fas fa-users"></i> Haul Akbar Syaikhuna
                    ${isAdminUser ? `
                        <button onclick="showEditHaul()" class="btn btn-primary btn-sm" style="margin-left: auto;">
                            <i class="fas fa-edit"></i> Edit Info
                        </button>
                    ` : ''}
                </div>
                
                <!-- Header Info -->
                <div style="background: linear-gradient(135deg, var(--primary-dark), var(--primary)); color: white; padding: 24px; border-radius: 8px; margin-bottom: 20px;">
                    <div style="text-align: center;">
                        <h2 style="color: white; font-size: 28px; margin-bottom: 8px;">
                            Haul Akbar ${haul.tahun || ''} H
                        </h2>
                        <p style="color: rgba(255,255,255,0.9); font-size: 18px;">
                            ${haul.tanggal || 'Tanggal belum ditentukan'}
                        </p>
                        ${haul.tema ? `
                            <p style="color: var(--secondary-light); font-size: 16px; margin-top: 8px;">
                                Tema: ${haul.tema}
                            </p>
                        ` : ''}
                    </div>
                </div>
                
                <!-- Pembicara -->
                <div style="margin-bottom: 20px;">
                    <h4 style="color: var(--text-light); margin-bottom: 12px;">
                        <i class="fas fa-chalkboard-teacher"></i> Pembicara
                    </h4>
                    ${haul.pembicara && haul.pembicara.length > 0 ? `
                        <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                            ${haul.pembicara.map(p => `
                                <span style="
                                    background: var(--secondary-light);
                                    padding: 6px 16px;
                                    border-radius: 20px;
                                    font-size: 14px;
                                    font-weight: 500;
                                    color: var(--primary);
                                ">
                                    ${p}
                                </span>
                            `).join('')}
                        </div>
                    ` : `
                        <p style="color: var(--text-light);">Belum ada daftar pembicara.</p>
                    `}
                </div>
                
                <!-- Jadwal -->
                <div>
                    <h4 style="color: var(--text-light); margin-bottom: 12px;">
                        <i class="fas fa-clock"></i> Jadwal Acara
                    </h4>
                    ${haul.jadwal && haul.jadwal.length > 0 ? `
                        <div style="display: grid; gap: 8px;">
                            ${haul.jadwal.map(item => `
                                <div style="
                                    display: flex;
                                    justify-content: space-between;
                                    align-items: center;
                                    padding: 10px 14px;
                                    background: var(--bg);
                                    border-radius: 6px;
                                    border-left: 3px solid var(--secondary);
                                ">
                                    <strong style="color: var(--primary);">${item.waktu || '-'}</strong>
                                    <span style="flex: 1; margin-left: 16px;">${item.acara || '-'}</span>
                                </div>
                            `).join('')}
                        </div>
                    ` : `
                        <p style="color: var(--text-light); text-align: center; padding: 20px 0;">
                            Belum ada jadwal acara.
                        </p>
                    `}
                </div>
                
                <!-- Countdown -->
                ${haul.tanggal ? `
                    <div style="margin-top: 20px; padding-top: 16px; border-top: 1px solid var(--border);">
                        <div style="text-align: center;">
                            <small style="color: var(--text-light);">Menuju Haul Akbar</small>
                            <div style="font-size: 32px; font-weight: 700; color: var(--primary); margin: 4px 0;">
                                ${getDaysUntil(haul.tanggal)}
                            </div>
                        </div>
                    </div>
                ` : ''}
            </div>
        </div>
    `;
}

// ===== HELPER FUNCTIONS =====
function getDaysUntil(dateStr) {
    if (!dateStr) return '-';
    // Parse date string like "15 Rajab 1446 H" - simplified
    // For demo, we'll just show a placeholder
    return 'Mohon tunggu...';
}

// ===== GLOBAL FUNCTIONS =====
window.showEditHaul = function() {
    if (!isAdmin()) return;
    const haul = getData(DATA_KEYS.HAUL) || {};
    
    const modal = createModal(`
        <h3>Edit Informasi Haul</h3>
        <form id="edit-haul-form">
            <div class="form-group">
                <label>Tahun Hijriyah</label>
                <input type="number" id="edit-haul-tahun" value="${haul.tahun || 1446}" />
            </div>
            <div class="form-group">
                <label>Tanggal</label>
                <input type="text" id="edit-haul-tanggal" value="${haul.tanggal || ''}" placeholder="Contoh: 15 Rajab 1446 H" />
            </div>
            <div class="form-group">
                <label>Tema</label>
                <input type="text" id="edit-haul-tema" value="${haul.tema || ''}" placeholder="Tema acara" />
            </div>
            <div class="form-group">
                <label>Pembicara (pisahkan dengan koma)</label>
                <input type="text" id="edit-haul-pembicara" value="${haul.pembicara ? haul.pembicara.join(', ') : ''}" placeholder="Kyai H. Abdullah, Ustadz M. Ali" />
            </div>
            <div class="form-group">
                <label>Jadwal Acara (format: Waktu|Acara)</label>
                <textarea id="edit-haul-jadwal" rows="4" placeholder="Contoh:&#10;07:00|Pembukaan&#10;08:00|Tahlil & Doa">${haul.jadwal ? haul.jadwal.map(j => `${j.waktu}|${j.acara}`).join('\n') : ''}</textarea>
                <small style="color: var(--text-light);">Pisahkan dengan garis vertikal (|) per item</small>
            </div>
            <button type="submit" class="btn btn-primary btn-block">Update Informasi Haul</button>
        </form>
    `);
    
    document.body.appendChild(modal);
    
    document.getElementById('edit-haul-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const tahun = parseInt(document.getElementById('edit-haul-tahun').value) || 1446;
        const tanggal = document.getElementById('edit-haul-tanggal').value.trim();
        const tema = document.getElementById('edit-haul-tema').value.trim();
        const pembicaraText = document.getElementById('edit-haul-pembicara').value;
        const jadwalText = document.getElementById('edit-haul-jadwal').value;
        
        const haul = getData(DATA_KEYS.HAUL) || {};
        haul.tahun = tahun;
        haul.tanggal = tanggal;
        haul.tema = tema;
        
        // Parse pembicara
        haul.pembicara = pembicaraText.split(',').map(s => s.trim()).filter(s => s);
        
        // Parse jadwal
        if (jadwalText.trim()) {
            haul.jadwal = jadwalText.split('\n')
                .filter(line => line.trim())
                .map(line => {
                    const parts = line.split('|').map(s => s.trim());
                    return {
                        waktu: parts[0] || '',
                        acara: parts[1] || ''
                    };
                });
        }
        
        saveData(DATA_KEYS.HAUL, haul);
        modal.remove();
        renderHaulRefresh();
        alert('Informasi Haul berhasil diupdate!');
    });
};

function renderHaulRefresh() {
    const user = JSON.parse(localStorage.getItem('harum_session') || '{}');
    const isAdminUser = user.role === 'admin';
    const container = document.querySelector('#content-area');
    if (container) {
        container.innerHTML = renderHaulAkbar({ user, isAdmin: isAdminUser });
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