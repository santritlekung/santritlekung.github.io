/* ==========================================================================
   COMPONENTS - VIEW GENERATOR (DYNAMIC HTML RENDERER)
   ========================================================================== */

const HARUM_Components = {
    
    // UTALITAS HELPER: Cek Status Admin untuk Proteksi UI (RBAC)
    isAdmin() {
        return localStorage.getItem('harum_role') === 'admin';
    },

    // 1. DASHBOARD COMPONENT
    dashboard() {
        const db = HARUM_DB.getAll();
        const totalKasMasuk = db.uangKas.filter(k => k.tipe === 'masuk').reduce((sum, item) => sum + item.nominal, 0);
        const totalKasKeluar = db.uangKas.filter(k => k.tipe === 'keluar').reduce((sum, item) => sum + item.nominal, 0);
        const saldoKas = totalKasMasuk - totalKasKeluar;

        // Hitung Kalender Hari Ini
        const infoKalender = this.getTodayJavaneseAndHijri();

        let html = `
            <div class="card" style="background: linear-gradient(135deg, var(--primary-color), var(--primary-light)); color: white;">
                <h2 style="margin-bottom: 5px;">Selamat Datang di Aplikasi HARUM</h2>
                <p style="opacity: 0.9;">Halaman Informasi Alumni, Amalan, & Manajemen Organisasi Roudlotul Ulum.</p>
                <div style="margin-top: 15px; font-weight: 500; background: rgba(255,255,255,0.15); padding: 10px; border-radius: 8px; display: inline-block;">
                    <i class="fas fa-calendar-day"></i> Hari Ini: ${infoKalender.masehi} | <strong>${infoKalender.hijriyah} (${infoKalender.pasaran})</strong>
                </div>
            </div>

            <!-- Ringkasan Finansial & Pengumuman Utama -->
            <div class="grid-3">
                <div class="card" style="border-left: 5px solid var(--success);">
                    <small class="text-muted">TOTAL SALDO KAS</small>
                    <h3 style="font-size: 1.5rem; color: var(--success); margin-top: 5px;">Rp ${saldoKas.toLocaleString('id-ID')}</h3>
                </div>
                <div class="card" style="border-left: 5px solid var(--accent-color);">
                    <small class="text-muted">AMALAN SABILUN NAJAH</small>
                    <h3 style="font-size: 1.5rem; color: var(--primary-color); margin-top: 5px;">${db.amalan.length} Amalan Utama</h3>
                </div>
                <div class="card" style="border-left: 5px solid #3182ce;">
                    <small class="text-muted">ROMBONGAN MALANG</small>
                    <h3 style="font-size: 1.5rem; color: #3182ce; margin-top: 5px;">${db.iuranMalang.length} Pendaftar</h3>
                </div>
            </div>

            <div class="card">
                <div class="card-header">
                    <span class="card-title"><i class="fas fa-bullhorn"></i> Pengumuman Terbaru</span>
                </div>
                <ul style="list-style: none;">
        `;

        db.pengumuman.slice(0, 2).forEach(p => {
            html += `
                <li style="margin-bottom: 15px; padding-bottom: 15px; border-bottom: 1px solid #e2e8f0;">
                    <strong style="color: var(--primary-color); display:block; font-size: 1rem;">${p.judul}</strong>
                    <small class="text-muted" style="font-size:0.75rem;"><i class="fas fa-clock"></i> ${p.tanggal}</small>
                    <p style="margin-top: 5px; font-size: 0.9rem;">${p.isi}</p>
                </li>
            `;
        });

        html += `</ul></div>`;
        return html;
    },

    // 2. SABILUN NAJAH COMPONENT (Kumpulan Amalan)
    sabilunNajah() {
        const db = HARUM_DB.getAll();
        let html = `
            <div class="card">
                <div class="card-header">
                    <span class="card-title"><i class="fas fa-book-open"></i> Sabilun Najah - Amalan Syaikhuna</span>
                    ${this.isAdmin() ? `<button class="btn-sm btn-primary" onclick="HARUM_App.showActionModal('amalan')"><i class="fas fa-plus"></i> Tambah</button>` : ''}
                </div>
                <p class="text-muted" style="margin-bottom: 15px; font-size:0.9rem;">Berikut adalah daftar amalan sanad dari Syaikhuna Siddiq Abdullah:</p>
                
                <div style="display: flex; flex-direction: column; gap: 15px;">
        `;

        db.amalan.forEach(a => {
            html += `
                <div style="background: #fafafa; border: 1px solid #e2e8f0; padding: 15px; border-radius: 8px; position:relative;">
                    <h4 style="color: var(--primary-color); font-size: 1.1rem; margin-bottom: 5px;">${a.judul}</h4>
                    <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 10px; font-style:italic;">${a.deskripsi}</p>
                    <div style="background: white; border: 1px solid #edf2f7; padding: 15px; border-radius: 6px; font-family: sans-serif; font-size: 1.1rem; line-height: 1.8; color: #2d3748; text-align: right; direction: rtl; margin-bottom: 10px;">
                        ${a.teks}
                    </div>
                    ${this.isAdmin() ? `
                        <div class="admin-actions" style="justify-content: flex-end;">
                            <button class="btn-sm btn-danger" onclick="HARUM_App.deleteItem('amalan', '${a.id}')"><i class="fas fa-trash"></i> Hapus</button>
                        </div>
                    ` : ''}
                </div>
            `;
        });

        html += `</div></div>`;
        return html;
    },

    // 3. KALENDER HIJRIYAH & PASARAN JAWA
    kalender() {
        const info = this.getTodayJavaneseAndHijri();
        return `
            <div class="card">
                <div class="card-header">
                    <span class="card-title"><i class="fas fa-calendar-alt"></i> Kalender Hijriyah & Pasaran Jawa</span>
                </div>
                <div style="text-align: center; padding: 30px 10px;">
                    <div style="font-size: 5rem; color: var(--primary-color); font-weight: 700; line-height: 1;">
                        ${new Date().getDate()}
                    </div>
                    <div style="font-size: 1.3rem; font-weight: 600; margin-top: 10px; color: var(--text-dark);">
                        ${info.masehi}
                    </div>
                    <hr style="width: 100px; margin: 20px auto; border: 1px solid var(--accent-color);">
                    <div style="font-size: 1.6rem; font-weight: 600; color: var(--primary-light);">
                        ${info.hijriyah}
                    </div>
                    <div style="display: inline-block; margin-top: 10px; background: var(--accent-color); color: var(--primary-color); padding: 5px 15px; border-radius: 20px; font-weight: bold; font-size: 1.1rem;">
                        Pasaran: ${info.pasaran}
                    </div>
                </div>
                <div style="background: #f7fafc; padding: 15px; border-radius: 8px; font-size: 0.85rem; color: var(--text-muted); line-height: 1.5;">
                    <i class="fas fa-info-circle"></i> <strong>Catatan Selapanan:</strong> Pencatatan Iuran Rutin HARUM ditarik berkala setiap selapanan sekali, bertepatan pada hari pasaran <strong>Jumat Pahing</strong>.
                </div>
            </div>
        `;
    },

    // 4. IURAN RUTIN (JUMAT PAHING) COMPONENT
    iuranJumat() {
        const db = HARUM_DB.getAll();
        let html = `
            <div class="card">
                <div class="card-header">
                    <span class="card-title"><i class="fas fa-hand-holding-usd"></i> Pencatatan Iuran Rutin (Jumat Pahing)</span>
                    ${this.isAdmin() ? `<button class="btn-sm btn-primary" onclick="HARUM_App.showActionModal('iuranJumat')"><i class="fas fa-plus"></i> Tambah Anggota</button>` : ''}
                </div>
                <div class="table-responsive">
                    <table>
                        <thead>
                            <tr>
                                <th>Nama Anggota</th>
                                <th>Status Bayar</th>
                                <th>Nominal</th>
                                <th>Tanggal Bayar</th>
                                ${this.isAdmin() ? '<th>Aksi</th>' : ''}
                            </tr>
                        </thead>
                        <tbody>
        `;

        db.iuranJumat.forEach(i => {
            const badgeClass = i.status === 'Lunas' ? 'status-lunas' : 'status-belum';
            html += `
                <tr>
                    <td><strong>${i.nama}</strong></td>
                    <td><span class="status-badge ${badgeClass}">${i.status}</span></td>
                    <td>Rp ${i.nominal.toLocaleString('id-ID')}</td>
                    <td>${i.tanggal}</td>
                    ${this.isAdmin() ? `
                        <td>
                            <div class="admin-actions">
                                ${i.status === 'Belum' ? `<button class="btn-sm btn-primary" style="background:#38a169" onclick="HARUM_App.lunasiIuranJumat('${i.id}')">Lunasi</button>` : ''}
                                <button class="btn-sm btn-danger" onclick="HARUM_App.deleteItem('iuranJumat', '${i.id}')"><i class="fas fa-trash"></i></button>
                            </div>
                        </td>
                    ` : ''}
                </tr>
            `;
        });

        html += `</tbody></table></div></div>`;
        return html;
    },

    // 5. UANG KAS COMPONENT
    uangKas() {
        const db = HARUM_DB.getAll();
        const totalMasuk = db.uangKas.filter(k => k.tipe === 'masuk').reduce((sum, item) => sum + item.nominal, 0);
        const totalKeluar = db.uangKas.filter(k => k.tipe === 'keluar').reduce((sum, item) => sum + item.nominal, 0);
        const saldo = totalMasuk - totalKeluar;

        let html = `
            <div class="grid-3" style="margin-bottom: 20px;">
                <div class="card" style="margin-bottom:0; background: #e6fffa; border: 1px solid #b2f5ea;"><small class="text-muted">KAS MASUK</small><h3 style="color:#234e52;">Rp ${totalMasuk.toLocaleString('id-ID')}</h3></div>
                <div class="card" style="margin-bottom:0; background: #fff5f5; border: 1px solid #fed7d7;"><small class="text-muted">KAS KELUAR</small><h3 style="color:#742a2a;">Rp ${totalKeluar.toLocaleString('id-ID')}</h3></div>
                <div class="card" style="margin-bottom:0; background: #ebf8ff; border: 1px solid #bee3f8;"><small class="text-muted">SALDO AKHIR</small><h3 style="color:#2b6cb0;">Rp ${saldo.toLocaleString('id-ID')}</h3></div>
            </div>

            <div class="card">
                <div class="card-header">
                    <span class="card-title"><i class="fas fa-wallet"></i> Buku Jurnal Kas Keuangan</span>
                    ${this.isAdmin() ? `<button class="btn-sm btn-primary" onclick="HARUM_App.showActionModal('uangKas')"><i class="fas fa-plus"></i> Catat Transaksi</button>` : ''}
                </div>
                <div class="table-responsive">
                    <table>
                        <thead>
                            <tr>
                                <th>Tanggal</th>
                                <th>Keterangan</th>
                                <th>Jenis</th>
                                <th>Nominal</th>
                                ${this.isAdmin() ? '<th>Aksi</th>' : ''}
                            </tr>
                        </thead>
                        <tbody>
        `;

        db.uangKas.forEach(k => {
            html += `
                <tr>
                    <td>${k.tanggal}</td>
                    <td>${k.keterangan}</td>
                    <td><span class="status-badge ${k.tipe === 'masuk' ? 'status-lunas' : 'status-belum'}">${k.tipe.toUpperCase()}</span></td>
                    <td style="font-weight:600; color: ${k.tipe === 'masuk' ? 'var(--success)' : 'var(--danger)'}">Rp ${k.nominal.toLocaleString('id-ID')}</td>
                    ${this.isAdmin() ? `<td><button class="btn-sm btn-danger" onclick="HARUM_App.deleteItem('uangKas', '${k.id}')"><i class="fas fa-trash"></i></button></td>` : ''}
                </tr>
            `;
        });

        html += `</tbody></table></div></div>`;
        return html;
    },

    // 6. PENGUMUMAN COMPONENT
    pengumuman() {
        const db = HARUM_DB.getAll();
        let html = `
            <div class="card">
                <div class="card-header">
                    <span class="card-title"><i class="fas fa-bullhorn"></i> Mading / Papan Pengumuman Organisasi</span>
                    ${this.isAdmin() ? `<button class="btn-sm btn-primary" onclick="HARUM_App.showActionModal('pengumuman')"><i class="fas fa-plus"></i> Buat Pengumuman</button>` : ''}
                </div>
                <div style="display:flex; flex-direction:column; gap:15px;">
        `;

        db.pengumuman.forEach(p => {
            html += `
                <div style="border: 1px solid #e2e8f0; padding: 20px; border-radius: var(--border-radius); background: white;">
                    <div style="display:flex; justify-content:space-between; align-items:flex-start;">
                        <h4 style="color:var(--primary-color); font-size:1.1rem;">${p.judul}</h4>
                        <small class="text-muted">${p.tanggal}</small>
                    </div>
                    <p style="margin-top:10px; font-size:0.95rem; line-height:1.6;">${p.isi}</p>
                    ${this.isAdmin() ? `
                        <div style="margin-top:10px; text-align:right;">
                            <button class="btn-sm btn-danger" onclick="HARUM_App.deleteItem('pengumuman', '${p.id}')"><i class="fas fa-trash"></i> Hapus</button>
                        </div>
                    ` : ''}
                </div>
            `;
        });

        html += `</div></div>`;
        return html;
    },

    // 7. AGENDA KHUSUS 1 (PUTRI SYAIKHUNA)
    agendaPutri() {
        const db = HARUM_DB.getAll();
        let html = `
            <div class="card">
                <div class="card-header">
                    <span class="card-title"><i class="fas fa-user-clock"></i> Persiapan Kedatangan Putri Syaikhuna</span>
                    ${this.isAdmin() ? `<button class="btn-sm btn-primary" onclick="HARUM_App.showActionModal('agendaPutri')"><i class="fas fa-plus"></i> Tambah Logistik</button>` : ''}
                </div>
                <p class="text-muted" style="font-size:0.85rem; margin-bottom:15px;">Daftar checklist kontrol persiapan sarana prasana & rundown penyambutan:</p>
                <div class="table-responsive">
                    <table>
                        <thead>
                            <tr>
                                <th>Kebutuhan Ketenagaan / Logistik</th>
                                <th>Penanggung Jawab</th>
                                <th>Status Checklist</th>
                                ${this.isAdmin() ? '<th>Aksi</th>' : ''}
                            </tr>
                        </thead>
                        <tbody>
        `;

        db.agendaPutri.forEach(a => {
            let statusClass = 'status-belum';
            if(a.status === 'Selesai') statusClass = 'status-lunas';
            if(a.status === 'Proses') statusClass = 'role-user';

            html += `
                <tr>
                    <td><strong>${a.kegiatan}</strong></td>
                    <td>${a.penanggungJawab}</td>
                    <td><span class="status-badge ${statusClass}">${a.status}</span></td>
                    ${this.isAdmin() ? `
                        <td>
                            <div class="admin-actions">
                                ${a.status !== 'Selesai' ? `<button class="btn-sm btn-primary" style="background:var(--success)" onclick="HARUM_App.updateStatusPutri('${a.id}')"><i class="fas fa-check"></i></button>` : ''}
                                <button class="btn-sm btn-danger" onclick="HARUM_App.deleteItem('agendaPutri', '${a.id}')"><i class="fas fa-trash"></i></button>
                            </div>
                        </td>
                    ` : ''}
                </tr>
            `;
        });

        html += `</tbody></table></div></div>`;
        return html;
    },

    // 8. AGENDA KHUSUS 2 (HAUL AKBAR)
    agendaHaul() {
        const db = HARUM_DB.getAll();
        return `
            <div class="card" style="border-top: 4px solid var(--accent-color);">
                <div class="card-header">
                    <span class="card-title"><i class="fas fa-mosque"></i> Informasi Utama Haul Akbar Syaikhuna</span>
                </div>
                <div style="line-height:1.8; font-size:0.95rem;">
                    <p><strong>Tema Acara:</strong> <br><span style="color:var(--primary-color); font-weight:600; font-size:1.1rem;">"${db.agendaHaul.tema}"</span></p>
                    <p style="margin-top:10px;"><strong>Waktu Pelaksanaan:</strong> <br><i class="fas fa-clock text-muted"></i> ${db.agendaHaul.waktu}</p>
                    <p style="margin-top:10px;"><strong>Tempat/Pusat Acara:</strong> <br><i class="fas fa-map-marker-alt text-muted"></i> ${db.agendaHaul.tempat}</p>
                </div>
            </div>

            <div class="card">
                <div class="card-header">
                    <span class="card-title"><i class="fas fa-stream"></i> Susunan Acara (Rundown)</span>
                </div>
                <div class="table-responsive">
                    <table>
                        <thead>
                            <tr>
                                <th style="width:150px;">Waktu / Jam</th>
                                <th>Nama Kegiatan Acara</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${db.agendaHaul.rundown.map(r => `
                                <tr>
                                    <td><code style="background:#edf2f7; padding:2px 6px; border-radius:4px; font-weight:600;">${r.jam}</code></td>
                                    <td>${r.acara}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    },

    // 9. IURAN ROMBONGAN MALANG
    iuranMalang() {
        const db = HARUM_DB.getAll();
        let html = `
            <div class="card">
                <div class="card-header">
                    <span class="card-title"><i class="fas fa-bus"></i> Dana Akomodasi Rombongan Haul ke Malang</span>
                    ${this.isAdmin() ? `<button class="btn-sm btn-primary" onclick="HARUM_App.showActionModal('iuranMalang')"><i class="fas fa-plus"></i> Daftar Warga</button>` : ''}
                </div>
                <div class="table-responsive">
                    <table>
                        <thead>
                            <tr>
                                <th>Nama Jamaah</th>
                                <th>Jumlah Kursi</th>
                                <th>Total Bayar</th>
                                <th>Status Pembayaran</th>
                                ${this.isAdmin() ? '<th>Aksi</th>' : ''}
                            </tr>
                        </thead>
                        <tbody>
        `;

        db.iuranMalang.forEach(m => {
            let badge = 'status-belum';
            if(m.status === 'Lunas') badge = 'status-lunas';
            if(m.status === 'DP') badge = 'role-user';

            html += `
                <tr>
                    <td><strong>${m.nama}</strong></td>
                    <td>${m.jumlahKursi} Kursi</td>
                    <td>Rp ${m.totalBayar.toLocaleString('id-ID')}</td>
                    <td><span class="status-badge ${badge}">${m.status}</span></td>
                    ${this.isAdmin() ? `
                        <td>
                            <div class="admin-actions">
                                ${m.status !== 'Lunas' ? `<button class="btn-sm btn-primary" style="background:#38a169" onclick="HARUM_App.lunasiMalang('${m.id}')">Lunas</button>` : ''}
                                <button class="btn-sm btn-danger" onclick="HARUM_App.deleteItem('iuranMalang', '${m.id}')"><i class="fas fa-trash"></i></button>
                            </div>
                        </td>
                    ` : ''}
                </tr>
            `;
        });

        html += `</tbody></table></div></div>`;
        return html;
    },

    // ==========================================================================
    // ALGORITMA UTALITAS: KALENDER HIJRIYAH & PASARAN JAWA
    // ==========================================================================
    getTodayJavaneseAndHijri() {
        const d = new Date();
        
        // Sederhana Pasaran Jawa (Berbasis penanggalan siklus 5 harian asli)
        // Nilai referensi acuan tanggal yang valid
        const pasaranArr = ["Kliwon", "Legi", "Pahing", "Pon", "Wage"];
        const refDate = new Date("1970-01-02"); // Hari Pasaran Kliwon
        const diffDays = Math.floor((d - refDate) / (1000 * 60 * 60 * 24));
        const pasaranToday = pasaranArr[((diffDays % 5) + 5) % 5];

        // Konversi Estimasi Hijriyah Sederhana (Akurasi +/- 1 hari untuk mockup client-side)
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        const formatMasehi = d.toLocaleDateString('id-ID', options);
        
        // Simulasi kalkulasi kalender Hijriyah berdasarkan kalender internasional Ummul Qura
        const hijriFormatter = new Intl.DateTimeFormat('id-ID-u-ca-islamic', {
            day: 'numeric', month: 'long', year: 'numeric'
        });
        const formatHijri = hijriFormatter.format(d);

        return {
            masehi: formatMasehi,
            hijriyah: formatHijri,
            pasaran: pasaranToday
        };
    }
};
