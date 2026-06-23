// ==========================================================================
// LOGIKA UTAMA KONVERSI & PERHITUNGAN PASARAN JAWA
// ==========================================================================
function getPasaranJawa(date) {
    // Basis perhitungan dari tanggal contoh yang sudah diketahui pasaran jawanya
    // Tanggal 24 Juni 2026 adalah hari Rabu Pon
    const baseDate = new Date(2026, 5, 24); // Note: Bulan di JS mulai dari 0 (5 = Juni)
    const pasaranArr = ["Pon", "Wage", "Kliwon", "Legi", "Pahing"];
    
    // Hitung selisih hari antara tanggal target dengan tanggal basis
    const diffTime = date.getTime() - baseDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    // Cari index pasaran menggunakan fungsi modulo (sisa pembagian 5)
    let index = diffDays % 5;
    if (index < 0) index += 5; // Antisipasi jika menghitung tanggal mundur
    
    return pasaranArr[index];
}

// ==========================================================================
// FUNGSI UTAMA RENDER HALAMAN KALENDER
// ==========================================================================
export function renderKalender(role) {
    const hariIni = new Date();
    
    // Format tanggal latin/masehi biasa
    const opsiMasehi = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const tglMasehiStr = hariIni.toLocaleDateString('id-ID', opsiMasehi);
    
    // Pasaran Jawa untuk hari ini
    const pasaranHariIni = getPasaranJawa(hariIni);
    
    // Tanggal Hijriyah berdasarkan info jemaah (9 Muharram 1448 H)
    // Di masa depan, ini bisa ditarik secara otomatis via API Aladhan atau di-adjust manual oleh Admin
    const tglHijriyahStr = "9 Muharram 1448 H";

    return `
        <div class="page-kalender">
            <h2 style="margin-bottom: 0.5rem; font-weight: 700; color: var(--primary-color); font-size: 1.4rem;">
                Kalender Hijriyah & Pasaran Jawa
            </h2>
            <p style="color: #4a5568; margin-bottom: 1.5rem; font-size: 0.9rem;">
                Informasi penanggalan Islam dan pasaran Jawa untuk mempermudah penentuan waktu ibadah, selapanan, dan kegiatan jemaah.
            </p>

            <div class="hari-ini-box" style="background: white; border-radius: 12px; box-shadow: var(--shadow); border: 1px solid var(--border-color); padding: 1.5rem; margin-bottom: 2rem; display: grid; grid-template-columns: 1fr; gap: 1rem; text-align: center;">
                <div>
                    <span style="font-size: 0.8rem; text-transform: uppercase; font-weight: 700; color: #718096; letter-spacing: 1px;">Hari Ini</span>
                    <h3 style="font-size: 1.5rem; color: var(--dark-color); font-weight: 700; margin-top: 0.25rem;">${tglMasehiStr}</h3>
                </div>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; border-top: 1px solid var(--border-color); padding-top: 1rem;">
                    <div style="background: #e8f5e9; padding: 1rem; border-radius: 8px; border: 1px solid #c8e6c9;">
                        <span style="font-size: 0.75rem; color: var(--primary-color); font-weight: 700; display: block; margin-bottom: 0.25rem;">PENANGGALAN ISLAM</span>
                        <span style="font-size: 1.2rem; font-weight: 700; color: #1b5e20;">${tglHijriyahStr}</span>
                    </div>
                    <div style="background: #fff8e1; padding: 1rem; border-radius: 8px; border: 1px solid #ffe082;">
                        <span style="font-size: 0.75rem; color: #b78103; font-weight: 700; display: block; margin-bottom: 0.25rem;">PASARAN JAWA</span>
                        <span style="font-size: 1.2rem; font-weight: 700; color: #744210;">${pasaranHariIni}</span>
                    </div>
                </div>
            </div>

            <h3 style="font-size: 1.1rem; color: var(--primary-color); margin-bottom: 1rem; font-weight: 700; border-left: 4px solid var(--accent-color); padding-left: 10px;">
                Agenda Rutin Selapanan Jemaah
            </h3>
            
            <div class="agenda-pasaran-list">
                <div class="agenda-item" style="background: white; padding: 1rem; border-radius: 8px; border-left: 4px solid var(--secondary-color); margin-bottom: 0.75rem; box-shadow: var(--shadow); display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <h4 style="font-size: 0.95rem; font-weight: 700; color: var(--dark-color);">Iuran Rutin & Santunan</h4>
                        <p style="font-size: 0.8rem; color: #718096;">Ditarik serentak oleh bendahara organisasi jemaah</p>
                    </div>
                    <span class="badge" style="background: #e2e8f0; color: #4a5568; font-weight: 700;">Setiap Jumat Pahing</span>
                </div>

                <div class="agenda-item" style="background: white; padding: 1rem; border-radius: 8px; border-left: 4px solid var(--accent-color); margin-bottom: 0.75rem; box-shadow: var(--shadow); display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <h4 style="font-size: 0.95rem; font-weight: 700; color: var(--dark-color);">Khotmil Qur'an & Doa Bersama</h4>
                        <p style="font-size: 0.8rem; color: #718096;">Pembacaan Sabilun Najah dipimpin para sepuh</p>
                    </div>
                    <span class="badge" style="background: #e2e8f0; color: #4a5568; font-weight: 700;">Setiap Malam Kliwon</span>
                </div>
            </div>
        </div>
    `;
}
