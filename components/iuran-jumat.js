// components/iuran-jumat.js - Iuran Rutin Jumat Pahing

import { getData, saveData, DATA_KEYS } from '../utils/storage.js';
import { isAdmin } from '../utils/auth.js';

export function renderIuranJumat({ user, isAdmin: isAdminUser }) {
    const anggota = getData(DATA_KEYS.ANGGOTA) || [];
    const activeMembers = anggota.filter(a => a.active);
    
    // Hitung statistik
    const total = activeMembers.length;
    const lunas = activeMembers.filter(a => a.status === 'lunas').length;
    const belum = total - lunas;
    const persentase = total > 0 ? Math.round((lunas / total) * 100) : 0;
    
    // Cek apakah hari ini Jumat Pahing
    const today = new Date();
    const isJumat = today.getDay() === 5;
    const pasaran = getPasaran(today);
    const isJumatPahing = isJumat && pasaran === 'Pahing';
    
    return `
        <div class="page-container">
            <div class="card">
                <div class="card-title">
                    <i class="fas fa-hand-holding-usd"></i> Iuran Rutin Jumat Pahing
                    <span style="font-size: 14px; font-weight: 400; color: var(--text-light); margin-left: 8px;">
                        ${isJumatPahing ? '🌟 Hari ini Jumat Pahing!' : 'Selapanan sekali'}
                    </span>
                    ${isAdminUser ? `
                        <button onclick="showTambahAnggota()" class="btn btn-primary btn-sm" style="margin-left: auto;">
                            <i class="fas fa-user-plus"></i> Tambah Anggota
                        </button>
                    ` : ''}
                </div>
                
                <!-- Statistik -->
                <div class="grid-3" style="margin-bottom: 20px;">
                    <div style="background: var(--bg); padding: 16px; border-radius: 8px; text-align: center;">
                        <h3 style="font-size: 14px; color: var(--text-light); margin: 0;">Total Anggota</h3>
                        <p style="font-size: 28px; font-weight: 700; margin: 4px 0; color: var(--primary);">${total}</p>
                        <small style="color: var(--text-light);">Aktif</small>
                    </div>
                    <div style="background: var(--bg); padding: 16px; border-radius: 8px; text-align: center;">
                        <h3 style="font-size: 14px; color: var(--text-light); margin: 0;">Sudah Bayar</h3>
                        <p style="font-size: 28px; font-weight: 700; margin: 4px 0; color: #28a745;">${lunas}</p>
                        <small style="color: var(--text-light);">${persentase}% terkumpul</small>
                    </div>
                    <div style="background: var(--bg); padding: 16px; border-radius: 8px; text-align: center;">
                        <h3 style="font-size: 14px; color: var(--text-light); margin: 0;">Belum Bayar</h3>
                        <p style="font-size: 28px; font-weight: 700; margin: 4px 0; color: #dc3545;">${belum}</p>
                        <small style="color: var(--text-light);">${total - lunas > 0 ? 'Segera lunasi!' : 'Semua sudah lunas ✅'}</small>
                    </div>
                </div>
                
                <!-- Progress Bar -->
                <div style="margin-bottom: 20px;">
                    <div style="display: flex; justify-content: space-between; font-size: 13px; margin-bottom: 4px;">
                        <span>Progres Iuran</span>
                        <span>${persentase}%</span>
                    </div>
                    <div style="width: 100%; height: 8px; background: var(--bg); border-radius: 4px; overflow: hidden;">
                        <div style="width: ${persentase}%; height: 100%; background: linear-gradient(90deg, var(--primary-light), var(--secondary)); transition: width 0.5s ease;"></div>
                    </div>
                </div>
                
                <!-- Daftar Anggota -->
                <div class="table-responsive">
                    <table>
                        <thead>
                            <tr>
                                <th>No</th>
                                <th>Nama Anggota</th>
                                <th>Status</th>
                                ${isAdminUser ? '<th>Aksi</th>' : ''}
                            </tr>
                        </thead>
                        <tbody>
                            ${activeMembers.length > 0 ? activeMembers.map((member, index) => `
                                <tr>
                                    <td>${index + 1}</td>
                                    <td>${member.name}</td>
                                    <td>
                                        <span class="status-badge ${member.status === 'lunas' ? 'lunas' : 'belum'}">
                                            ${member.status === 'lunas' ? '✅ Lunas' : '⏳ Belum'}
                                        </span>
                                    </td>
                                    ${isAdminUser ? `
                                        <td>
                                            <button onclick="toggleStatus(${member.id})" class="btn btn-sm ${member.status === 'lunas' ? 'btn-outline' : 'btn-primary'}" style="margin-right: 4px;">
                                                ${member.status === 'lunas' ? 'Batalkan' : 'Bayar'}
                                            </button>
                                            <button onclick="deleteAnggota(${member.id})" class="btn btn-sm btn-danger">
                                                <i class="fas fa-trash"></i>
                                            </button>
                                        </td>
                                    ` : ''}
                                </tr>
                            `).join('') : `
                                <tr>
                                    <td colspan="${isAdminUser ? 4 : 3}" style="text-align: center; color: var(--text-light);">
                                        Belum ada anggota aktif. ${isAdminUser ? 'Klik "Tambah Anggota" untuk menambahkan.' : ''}
                                    </td>
                                </tr>
                            `}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
}

// ===== HELPER FUNCTIONS =====
function getPasaran(date) {
    const base = new Date(2020, 0, 1);
    const diff = Math.floor((date - base) / 86400000);
    const index = (diff + 3) % 5;
    return ['Legi', 'Pahing', 'Pon', 'Wage', 'Kliwon'][index];
}

// ===== GLOBAL FUNCTIONS =====
window.toggleStatus = function(id) {
    if (!isAdmin()) return;
    const anggota = getData(DATA_KEYS.ANGGOTA) || [];
    const member = anggota.find(a => a.id === id);
    if (member) {
        member.status = member.status === 'lunas' ? 'belum' : 'lunas';
        saveData(DATA_KEYS.ANGGOTA, anggota);
        renderIuranRefresh();
    }
};

window.deleteAnggota = function(id) {
    if (!isAdmin()) return;
    if (!confirm('Yakin ingin menghapus anggota ini?')) return;
    let anggota = getData(DATA_KEYS.ANGGOTA) || [];
    anggota = anggota.filter(a => a.id !== id);
    saveData(DATA_KEYS.ANGGOTA, anggota);
    renderIuranRefresh();
};

window.showTambahAnggota = function() {
    if (!isAdmin()) return;
    const modal = createModal(`
        <h3>Tambah Anggota</h3>
        <form id="tambah-anggota-form">
            <div class="form-group">
                <label>Nama Lengkap</label>
                <input type="text" id="anggota-name" placeholder="Masukkan nama anggota" required />
            </div>
            <div class="form-group">
                <label>Status Awal</label>
                <select id="anggota-status">
                    <option value="belum">Belum Bayar</option>
                    <option value="lunas">Sudah Bayar</option>
                </select>
            </div>
            <div class="form-group">
                <label>
                    <input type="checkbox" id="anggota-active" checked />
                    Aktif
                </label>
            </div>
            <button type="submit" class="btn btn-primary btn-block">Tambah Anggota</button>
        </form>
    `);
    
    document.body.appendChild(modal);
    
    document.getElementById('tambah-anggota-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('anggota-name').value.trim();
        const status = document.getElementById('anggota-status').value;
        const active = document.getElementById('anggota-active').checked;
        
        if (!name) {
            alert('Nama wajib diisi!');
            return;
        }
        
        const anggota = getData(DATA_KEYS.ANGGOTA) || [];
        const newMember = {
            id: Date.now(),
            name,
            status,
            active,
        };
        anggota.push(newMember);
        saveData(DATA_KEYS.ANGGOTA, anggota);
        modal.remove();
        renderIuranRefresh();
        alert(`Anggota ${name} berhasil ditambahkan!`);
    });
};

function renderIuranRefresh() {
    const user = JSON.parse(localStorage.getItem('harum_session') || '{}');
    const isAdminUser = user.role === 'admin';
    const container = document.querySelector('#content-area');
    if (container) {
        container.innerHTML = renderIuranJumat({ user, isAdmin: isAdminUser });
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