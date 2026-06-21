// components/uang-kas.js - Laporan Keuangan Kas

import { getData, saveData, DATA_KEYS } from '../utils/storage.js';
import { isAdmin } from '../utils/auth.js';

export function renderUangKas({ user, isAdmin: isAdminUser }) {
    const kas = getData(DATA_KEYS.KAS) || { transactions: [], saldo: 0 };
    const transactions = kas.transactions || [];
    
    // Hitung total
    const totalMasuk = transactions.filter(t => t.type === 'masuk').reduce((sum, t) => sum + t.amount, 0);
    const totalKeluar = transactions.filter(t => t.type === 'keluar').reduce((sum, t) => sum + t.amount, 0);
    const saldoAkhir = kas.saldo || 0;
    
    return `
        <div class="page-container">
            <div class="card">
                <div class="card-title">
                    <i class="fas fa-wallet"></i> Uang Kas
                    ${isAdminUser ? `
                        <button onclick="showTambahTransaksi()" class="btn btn-primary btn-sm" style="margin-left: auto;">
                            <i class="fas fa-plus"></i> Tambah Transaksi
                        </button>
                    ` : ''}
                </div>
                
                <!-- Summary Cards -->
                <div class="grid-3" style="margin-bottom: 20px;">
                    <div style="background: linear-gradient(135deg, #28a745, #20c997); padding: 20px; border-radius: 8px; color: white;">
                        <h3 style="font-size: 14px; opacity: 0.9; margin: 0;">Total Masuk</h3>
                        <p style="font-size: 28px; font-weight: 700; margin: 4px 0;">Rp ${formatRupiah(totalMasuk)}</p>
                        <small style="opacity: 0.8;">${transactions.filter(t => t.type === 'masuk').length} transaksi</small>
                    </div>
                    <div style="background: linear-gradient(135deg, #dc3545, #e74c3c); padding: 20px; border-radius: 8px; color: white;">
                        <h3 style="font-size: 14px; opacity: 0.9; margin: 0;">Total Keluar</h3>
                        <p style="font-size: 28px; font-weight: 700; margin: 4px 0;">Rp ${formatRupiah(totalKeluar)}</p>
                        <small style="opacity: 0.8;">${transactions.filter(t => t.type === 'keluar').length} transaksi</small>
                    </div>
                    <div style="background: linear-gradient(135deg, var(--primary), var(--primary-light)); padding: 20px; border-radius: 8px; color: white;">
                        <h3 style="font-size: 14px; opacity: 0.9; margin: 0;">Saldo Akhir</h3>
                        <p style="font-size: 28px; font-weight: 700; margin: 4px 0;">Rp ${formatRupiah(saldoAkhir)}</p>
                        <small style="opacity: 0.8;">${saldoAkhir >= 0 ? 'Sehat 💚' : 'Defisit ❤️'}</small>
                    </div>
                </div>
                
                <!-- Transaction List -->
                <div style="margin-top: 20px;">
                    <h4 style="margin-bottom: 12px; color: var(--text-light);">
                        <i class="fas fa-list"></i> Riwayat Transaksi
                    </h4>
                    <div class="table-responsive">
                        <table>
                            <thead>
                                <tr>
                                    <th>Tanggal</th>
                                    <th>Deskripsi</th>
                                    <th>Jenis</th>
                                    <th style="text-align: right;">Nominal</th>
                                    ${isAdminUser ? '<th>Aksi</th>' : ''}
                                </tr>
                            </thead>
                            <tbody>
                                ${transactions.length > 0 ? transactions.sort((a, b) => b.id - a.id).map(trx => `
                                    <tr>
                                        <td>${trx.date || '-'}</td>
                                        <td>${trx.desc || '-'}</td>
                                        <td>
                                            <span class="status-badge ${trx.type === 'masuk' ? 'lunas' : 'belum'}">
                                                ${trx.type === 'masuk' ? '📥 Masuk' : '📤 Keluar'}
                                            </span>
                                        </td>
                                        <td style="text-align: right; font-weight: 600; color: ${trx.type === 'masuk' ? '#28a745' : '#dc3545'};">
                                            ${trx.type === 'masuk' ? '+' : '-'} Rp ${formatRupiah(trx.amount)}
                                        </td>
                                        ${isAdminUser ? `
                                            <td>
                                                <button onclick="deleteTransaksi(${trx.id})" class="btn btn-sm btn-danger">
                                                    <i class="fas fa-trash"></i>
                                                </button>
                                            </td>
                                        ` : ''}
                                    </tr>
                                `).join('') : `
                                    <tr>
                                        <td colspan="${isAdminUser ? 5 : 4}" style="text-align: center; color: var(--text-light);">
                                            Belum ada transaksi. ${isAdminUser ? 'Klik "Tambah Transaksi" untuk menambahkan.' : ''}
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
window.showTambahTransaksi = function() {
    if (!isAdmin()) return;
    const modal = createModal(`
        <h3>Tambah Transaksi</h3>
        <form id="tambah-transaksi-form">
            <div class="form-group">
                <label>Jenis Transaksi</label>
                <select id="transaksi-type" required>
                    <option value="masuk">Kas Masuk</option>
                    <option value="keluar">Kas Keluar</option>
                </select>
            </div>
            <div class="form-group">
                <label>Nominal (Rp)</label>
                <input type="number" id="transaksi-amount" placeholder="0" required min="1" />
            </div>
            <div class="form-group">
                <label>Deskripsi</label>
                <input type="text" id="transaksi-desc" placeholder="Keterangan transaksi" required />
            </div>
            <div class="form-group">
                <label>Tanggal</label>
                <input type="date" id="transaksi-date" value="${new Date().toISOString().split('T')[0]}" required />
            </div>
            <button type="submit" class="btn btn-primary btn-block">Simpan Transaksi</button>
        </form>
    `);
    
    document.body.appendChild(modal);
    
    document.getElementById('tambah-transaksi-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const type = document.getElementById('transaksi-type').value;
        const amount = parseInt(document.getElementById('transaksi-amount').value);
        const desc = document.getElementById('transaksi-desc').value.trim();
        const date = document.getElementById('transaksi-date').value;
        
        if (!amount || amount <= 0) {
            alert('Nominal harus lebih dari 0!');
            return;
        }
        if (!desc) {
            alert('Deskripsi wajib diisi!');
            return;
        }
        
        const kas = getData(DATA_KEYS.KAS) || { transactions: [], saldo: 0 };
        const newTrx = {
            id: Date.now(),
            type,
            amount,
            desc,
            date,
        };
        
        kas.transactions.push(newTrx);
        // Update saldo
        if (type === 'masuk') {
            kas.saldo = (kas.saldo || 0) + amount;
        } else {
            kas.saldo = (kas.saldo || 0) - amount;
        }
        
        saveData(DATA_KEYS.KAS, kas);
        modal.remove();
        renderKasRefresh();
        alert('Transaksi berhasil ditambahkan!');
    });
};

window.deleteTransaksi = function(id) {
    if (!isAdmin()) return;
    if (!confirm('Yakin ingin menghapus transaksi ini?')) return;
    
    const kas = getData(DATA_KEYS.KAS) || { transactions: [], saldo: 0 };
    const trx = kas.transactions.find(t => t.id === id);
    if (trx) {
        // Reverse saldo
        if (trx.type === 'masuk') {
            kas.saldo -= trx.amount;
        } else {
            kas.saldo += trx.amount;
        }
        kas.transactions = kas.transactions.filter(t => t.id !== id);
        saveData(DATA_KEYS.KAS, kas);
        renderKasRefresh();
        alert('Transaksi berhasil dihapus!');
    }
};

function renderKasRefresh() {
    const user = JSON.parse(localStorage.getItem('harum_session') || '{}');
    const isAdminUser = user.role === 'admin';
    const container = document.querySelector('#content-area');
    if (container) {
        container.innerHTML = renderUangKas({ user, isAdmin: isAdminUser });
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