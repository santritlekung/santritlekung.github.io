// components/dashboard.js - Beranda/Halaman Utama

export function renderDashboard({ user, isAdmin }) {
    return `
        <div class="page-container">
            <!-- Welcome Section -->
            <div class="card" style="background: linear-gradient(135deg, var(--primary-dark), var(--primary)); color: white; border: none;">
                <div style="display: flex; align-items: center; gap: 16px; flex-wrap: wrap;">
                    <img src="assets/logo.png" alt="Logo" style="width: 60px; height: 60px; border-radius: 50%; background: white; padding: 8px;" />
                    <div>
                        <h2 style="color: white; margin-bottom: 4px;">Selamat Datang di HARUM</h2>
                        <p style="color: rgba(255,255,255,0.8); margin: 0;">
                            ${isAdmin ? '👑 Admin - Anda memiliki akses penuh' : '👤 User - Mode baca'}
                        </p>
                        <small style="color: rgba(255,255,255,0.6);">${user.name || user.phone}</small>
                    </div>
                </div>
            </div>

            <!-- Quick Stats -->
            <div class="grid-3" style="margin-top: 20px;">
                <div class="card" style="border-left: 4px solid var(--secondary);">
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <i class="fas fa-book-quran" style="font-size: 24px; color: var(--secondary);"></i>
                        <div>
                            <h3 style="font-size: 14px; color: var(--text-light); margin: 0;">Amalan</h3>
                            <p style="font-size: 24px; font-weight: 700; margin: 0; color: var(--primary);">5</p>
                            <small style="color: var(--text-light);">Sabilun Najah</small>
                        </div>
                    </div>
                </div>
                <div class="card" style="border-left: 4px solid #28a745;">
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <i class="fas fa-users" style="font-size: 24px; color: #28a745;"></i>
                        <div>
                            <h3 style="font-size: 14px; color: var(--text-light); margin: 0;">Anggota</h3>
                            <p style="font-size: 24px; font-weight: 700; margin: 0; color: var(--primary);">8</p>
                            <small style="color: var(--text-light);">Aktif: 6</small>
                        </div>
                    </div>
                </div>
                <div class="card" style="border-left: 4px solid #ffc107;">
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <i class="fas fa-wallet" style="font-size: 24px; color: #ffc107;"></i>
                        <div>
                            <h3 style="font-size: 14px; color: var(--text-light); margin: 0;">Kas</h3>
                            <p style="font-size: 24px; font-weight: 700; margin: 0; color: var(--primary);">Rp 750.000</p>
                            <small style="color: var(--text-light);">Saldo akhir</small>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Media Section -->
            <div class="card">
                <div class="card-title">
                    <i class="fas fa-video"></i> Media Terbaru
                </div>
                <div class="media-grid">
                    <div class="media-item">
                        <div class="media-container">
                            <iframe 
                                src="https://www.youtube.com/embed/dQw4w9WgXcQ" 
                                allowfullscreen
                                loading="lazy"
                            ></iframe>
                        </div>
                        <div class="media-info">
                            <h4>Pengajian Rutin Jumat Pahing</h4>
                            <p>📅 20 Januari 2024 • 45 menit</p>
                        </div>
                    </div>
                    <div class="media-item">
                        <div class="media-container">
                            <iframe 
                                src="https://www.youtube.com/embed/3JZ_D3ELwOQ" 
                                allowfullscreen
                                loading="lazy"
                            ></iframe>
                        </div>
                        <div class="media-info">
                            <h4>Tausiyah Syaikhuna</h4>
                            <p>📅 15 Januari 2024 • 30 menit</p>
                        </div>
                    </div>
                    <div class="media-item">
                        <div class="media-container">
                            <iframe 
                                src="https://www.youtube.com/embed/0NlBvD_q7XA" 
                                allowfullscreen
                                loading="lazy"
                            ></iframe>
                        </div>
                        <div class="media-info">
                            <h4>Doa Bersama Haul Akbar</h4>
                            <p>📅 10 Januari 2024 • 20 menit</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Quick Links -->
            <div class="grid-2">
                <div class="card">
                    <div class="card-title">
                        <i class="fas fa-calendar-alt"></i> Agenda Mendekat
                    </div>
                    <ul style="list-style: none; padding: 0;">
                        <li style="padding: 8px 0; border-bottom: 1px solid var(--border);">
                            <strong>Haul Akbar</strong>
                            <span style="float: right; color: var(--secondary);">15 Rajab 1446 H</span>
                        </li>
                        <li style="padding: 8px 0; border-bottom: 1px solid var(--border);">
                            <strong>Kedatangan Putri Syaikhuna</strong>
                            <span style="float: right; color: var(--secondary);">15 Februari 2024</span>
                        </li>
                        <li style="padding: 8px 0;">
                            <strong>Iuran Jumat Pahing</strong>
                            <span style="float: right; color: var(--secondary);">Setiap selapanan</span>
                        </li>
                    </ul>
                </div>
                <div class="card">
                    <div class="card-title">
                        <i class="fas fa-bullhorn"></i> Pengumuman Terbaru
                    </div>
                    <div id="dashboard-pengumuman">
                        <p style="color: var(--text-light);">Memuat pengumuman...</p>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Load pengumuman after render
setTimeout(() => {
    const container = document.getElementById('dashboard-pengumuman');
    if (container) {
        const pengumuman = JSON.parse(localStorage.getItem('harum_pengumuman') || '[]');
        if (pengumuman.length > 0) {
            const latest = pengumuman.slice(0, 3);
            container.innerHTML = latest.map(p => `
                <div style="padding: 8px 0; border-bottom: 1px solid var(--border);">
                    <strong>${p.title}</strong>
                    <p style="margin: 4px 0 0; font-size: 13px; color: var(--text-light);">${p.content.substring(0, 60)}${p.content.length > 60 ? '...' : ''}</p>
                    <small style="color: var(--text-light);">${p.date}</small>
                    ${p.priority === 'high' ? ' <span class="badge" style="background: #dc3545; color: white;">Penting</span>' : ''}
                </div>
            `).join('');
        } else {
            container.innerHTML = '<p style="color: var(--text-light);">Belum ada pengumuman.</p>';
        }
    }
}, 100);