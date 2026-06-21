// components/iuran-malang.js - Iuran Rombongan ke Malang

import { getData, saveData, DATA_KEYS } from '../utils/storage.js';
import { isAdmin } from '../utils/auth.js';

export function renderIuranMalang({ user, isAdmin: isAdminUser }) {
    const data = getData(DATA_KEYS.IURAN_MALANG) || {
        target: 5000000,
        terkumpul: 0,
        peserta: []
    };
    
    const totalPeserta = data.peserta ? data.peserta.length : 0;
    const sudahBayar = data.peserta ? data.peserta.filter(p => p.sudah_bayar).length : 0;
    const persentase = data.target > 0 ? Math.round((data.terkumpul / data.target) * 100) : 0;
    
    return `
        <div class="page-container">
            <div class="card">
                <div class="card-title">
                    <i class="fas fa-bus"></i> Iuran Rombongan ke Malang
                    <span style="font-size: 14px; font-weight: 400; color: var(--text-light); margin-left: 8px;">
                        Haul Akbar Syaikhuna
                    </span>
                    ${isAdminUser ? `
                        <button onclick="showTambahPeserta()" class="btn btn-primary btn-sm" style="margin-left: auto;">
                            <i class="fas fa-user-plus"></i> Tambah Peserta
                        </button>
                    ` : ''}
                </div>
                
                <!-- Fundraising Stats -->
                <div style="margin-bottom: 20px;">
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 12px;">
                        <div style="background: var(--bg); padding: 16px; border-radius: 8px; text-align: center;">
                            <small style="color: var(--text-light);">Target Dana</small>
                            <p style="font-size: 20px; font-weight: 700; margin: 4px 0; color: var(--primary);">
                                Rp ${formatRupiah(data.target)}
                            </p>
                        </div>
                        <div style="background: var(--bg); padding: 16px; border-radius: 8px; text-align: center;">
                            <small style="color: var(--text-light);">Terkumpul</small>
                            <p style="font-size: 20px; font-weight: 700; margin: 4px 0; color: #28a745;">
                                Rp ${formatRupiah(data.terkumpul || 0)}
                            </p>
                        </div>
                        <div style="background: var(--bg); padding: 16px; border-radius: 8px; text-align: center;">
                            <small style="color: var(--text-light);">Kekurangan</small>
                            <p style="font-size: 20px; font-weight: 700; margin: 4px 0; color: #dc3545;">
                                Rp ${formatRupiah(Math.max(0, data.target - (data.terkumpul || 0)))}
                            </p>
                        </div>
                    </div>
                    
                    <!-- Progress Bar -->
                    <div style="margin-top: 12px;">
                        <div style="display: flex; justify-content: space-between; font-size: 13px; margin-bottom: 4px;">
                            <span>Progress Pengumpulan Dana</span>
                            <span>${persentase}%</span>
                        </div>
                        <div style="width: 100%; height: 10px; background: var(--bg); border-radius: 5px; overflow: hidden;">
                            <div style="width: ${Math.min(100, persentase)}%; height: 100%; background: linear-gradient(90deg, var(--primary-light), var(--secondary)); transition: width 0.5s ease;"></div>
                        </div>
                    </div>
                </div>
                
                <!-- Participants -->
                <div>
                    <h4 style="color: var(--text-light); margin-bottom: 12px;">
                        <i class="fas fa-users"></i> Daftar Peserta (${totalPeserta})
                    </h4>
                    <div class="table-responsive">
                        <table>
                            <thead>
                                <tr>
                                    <th>No</th>
                                    <th>Nama</th>
                                    <th>Nominal</th>
                                    <th>Status</th>
                                    ${isAdminUser ? '<th>Aksi</th>' : ''}
                                </tr>
                            </thead>
                            <tbody>
                                ${data.peserta && data.peserta.length > 0 ? data.peserta.map((p, index) => `
                                    <tr>
                                        <td>${index + 1}</td>
                                        <td>${p.name}</td>
                                        <td>Rp ${formatRupiah(p.nominal || 0)}</td>
                                        <td>
                                            <span class="status-badge ${p.sudah_bayar ? 'lunas' : 'belum'}">
                                                ${p.sudah_bayar ? '✅ Sudah Bayar' : '⏳ Belum'}
                                            </span>
                                        </td>
                                        ${isAdminUser ? `
                                            <td>
                                                <button onclick="toggleBayarPeserta(${index})" class="btn btn-sm ${p.sudah_bayar ? 'btn-outline' : 'btn-primary'}" style="margin-right: 4px;">
                                                    ${p.sudah_bayar ? 'Batalkan' : 'Bayar'}
                                                </button>
                                                <button onclick="editPeserta(${index})" class="btn btn-sm btn-outline" style="margin-right: 4px;">
                                                    <i class="fas fa-edit"></i>
                                                </button>
                                                <button onclick="deletePeserta(${index})" class="btn btn-sm btn-danger">
                                                    <i class="fas fa-trash"></i>
                                                </button>
                                            </td>
                                        ` : ''}
                                    </tr>
                                `).join('') : `
                                    <tr>
                                        <td colspan="${isAdminUser ? 5 : 4}" style="text-align: center; color: var(--text-light);">
                                            Belum ada peserta. ${isAdminUser ? 'Klik "Tambah Peserta" untuk menambahkan.' : ''}
                                        </td>
                                    </tr>
                                `}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// ===== HELPER FUNCTIONS =====
function formatRupiah(amount) {
    return new Intl.NumberFormat('id-ID').format(amount);
}

// ===== GLOBAL FUNCTIONS =====
window.showTambahPeserta = function() {
    if (!isAdmin()) return;
    const modal = createModal(`
        <h3>Tambah Peserta</h3>
        <form id="tambah-peserta-form">
            <div class="form-group">
                <label>Nama Peserta</label>
                <input type="text" id="peserta-name" placeholder="Nama lengkap" required />
            </div>
            <div class="form-group">
                <label>Nominal Iuran (Rp)</label>
                <input type="number" id="peserta-nominal" placeholder="0" required min="1" />
            </div>
            <div class="form-group">
                <label>
                    <input type="checkbox" id="peserta-sudah-bayar" />
                    Sudah Bayar
                </label>
            </div>
            <button type="submit" class="btn btn-primary btn-block">Tambah Peserta</button>
        </form>
    `);
    
    document.body.appendChild(modal);
    
    document.getElementById('tambah-peserta-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('peserta-name').value.trim();
        const nominal = parseInt(document.getElementById('peserta-nominal').value);
        const sudah_bayar = document.getElementById('peserta-sudah-bayar').checked;
        
        if (!name || !nominal) {
            alert('Nama dan nominal wajib diisi!');
            return;
        }
        
        const data = getData(DATA_KEYS.IURAN_MALANG) || { target: 5000000, terkumpul: 0, peserta: [] };
        if (!data.peserta) data.peserta = [];
        
        data.peserta.push({ name, nominal, sudah_bayar });
        if (sudah_bayar) {
            data.terkumpul = (data.terkumpul || 0) + nominal;
        }
        
        saveData(DATA_KEYS.IURAN_MALANG, data);
        modal.remove();
        renderIuranMalangRefresh();
        alert('Peserta berhasil ditambahkan!');
    });
};

window.toggleBayarPeserta = function(index) {
    if (!isAdmin()) return;
    const data = getData(DATA_KEYS.IURAN_MALANG) || { target: 5000000, terkumpul: 0, peserta: [] };
    if (data.peserta && data.peserta[index]) {
        const p = data.peserta[index];
        if (p.sudah_bayar) {
            // Refund
            p.sudah_bayar = false;
            data.terkumpul = (data.terkumpul || 0) - (p.nominal || 0);
        } else {
            p.sudah_bayar = true;
            data.terkumpul = (data.terkumpul || 0) + (p.nominal || 0);
        }
        saveData(DATA_KEYS.IURAN_MALANG, data);
        renderIuranMalangRefresh();
    }
};

window.editPeserta = function(index) {
    if (!isAdmin()) return;
    const data = getData(DATA_KEYS.IURAN_MALANG) || { target: 5000000, terkumpul: 0, peserta: [] };
    const p = data.peserta && data.peserta[index];
    if (!p) return;
    
    const modal = createModal(`
        <h3>Edit Peserta</h3>
        <form id="edit-peserta-form">
            <div class="form-group">
                <label>Nama Peserta</label>
                <input type="text" id="edit-peserta-name" value="${p.name}" required />
            </div>
            <div class="form-group">
                <label>Nominal Iuran (Rp)</label>
                <input type="number" id="edit-peserta-nominal" value="${p.nominal || 0}" required min="1" />
            </div>
            <div class="form-group">
                <label>
                    <input type="checkbox" id="edit-peserta-sudah-bayar" ${p.sudah_bayar ? 'checked' : ''} />
                    Sudah Bayar
                </label>
            </div>
            <button type="submit" class="btn btn-primary btn-block">Update Peserta</button>
        </form>
    `);
    
    document.body.appendChild(modal);
    
    document.getElementById('edit-peserta-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('edit-peserta-name').value.trim();
        const nominal = parseInt(document.getElementById('edit-peserta-nominal').value);
        const sudah_bayar = document.getElementById('edit-peserta-sudah-bayar').checked;
        
        if (!name || !nominal) {
            alert('Nama dan nominal wajib diisi!');
            return;
        }
        
        const data = getData(DATA_KEYS.IURAN_MALANG) || { target: 5000000, terkumpul: 0, peserta: [] };
        const oldP = data.peserta[index];
        
        // Adjust total
        if (oldP.sudah_bayar) {
            data.terkumpul = (data.terkumpul || 0) - (oldP.nominal || 0);
        }
        if (sudah_bayar) {
            data.terkumpul = (data.terkumpul || 0) + nominal;
        }
        
        data.peserta[index] = { name, nominal, sudah_bayar };
        saveData(DATA_KEYS.IURAN_MALANG, data);
        modal.remove();
        renderIuranMalangRefresh();
        alert('Peserta berhasil diupdate!');
    });
};

window.deletePeserta = function(index) {
    if (!isAdmin()) return;
    if (!confirm('Yakin ingin menghapus peserta ini?')) return;
    
    const data = getData(DATA_KEYS.IURAN_MALANG) || { target: 5000000, terkumpul: 0, peserta: [] };
    if (data.peserta && data.peserta[index]) {
        const p = data.peserta[index];
        if (p.sudah_bayar) {
            data.terkumpul = (data.terkumpul || 0) - (p.nominal || 0);
        }
        data.peserta.splice(index, 1);
        saveData(DATA_KEYS.IURAN_MALANG, data);
        renderIuranMalangRefresh();
        alert('Peserta berhasil dihapus!');
    }
};

function renderIuranMalangRefresh() {
    const user = JSON.parse(localStorage.getItem('harum_session') || '{}');
    const isAdminUser = user.role === 'admin';
    const container = document.querySelector('#content-area');
    if (container) {
        container.innerHTML = renderIuranMalang({ user, isAdmin: isAdminUser });
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