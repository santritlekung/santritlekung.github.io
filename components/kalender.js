// ==========================================================================
// LOGIKA UTAMA KONVERSI & PERHITUNGAN PASARAN JAWA (TERKALIBRASI AKURAT)
// ==========================================================================
function getPasaranJawa(date) {
    // Kalibrasi Utama berdasarkan data yang Anda berikan:
    // 24 Juni 2026 adalah hari Rabu Pahing
    const baseDate = new Date(2026, 5, 24); // 5 berarti Juni di JavaScript
    const pasaranArr = ["Pahing", "Pon", "Wage", "Kliwon", "Legi"];
    
    // Hitung selisih hari dari tanggal acuan
    const diffTime = date.getTime() - baseDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    // Hitung index siklus 5 harian pasaran
    let index = diffDays % 5;
    if (index < 0) index += 5; 
    
    return pasaranArr[index];
}

function getTanggalHijriyah(date) {
    // Kalibrasi Utama berdasarkan data yang Anda berikan:
    // 24 Juni 2026 = 9 Muharram 1448 H
    const baseDate = new Date(2026, 5, 24);
    const baseHijriDay = 9;
    
    const diffTime = date.getTime() - baseDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    // Estimasi pergeseran tanggal Hijriyah sederhana untuk kebutuhan display bulanan
    let currentHijriDay = baseHijriDay + diffDays;
    let bulanHijriyah = "Muharram";
    let tahunHijriyah = 1448;
    
    // Logika pengondisian jika hari melebihi batas siklus bulan qomariyah (29/30 hari)
    if (currentHijriDay > 30) {
        currentHijriDay = currentHijriDay - 30;
        bulanHijriyah = "Safar";
    } else if (currentHijriDay <= 0) {
        // Antisipasi jika user melihat tanggal sebelum hari kalibrasi
        currentHijriDay = 30 + currentHijriDay;
        bulanHijriyah = "Dzulhijjah";
        tahunHijriyah = 1447;
    }
    
    return `${currentHijriDay} ${bulanHijriyah} ${tahunHijriyah} H`;
}

// ==========================================================================
// FUNGSI UTAMA RENDER HALAMAN KALENDER
// ==========================================================================
export function renderKalender(role) {
    const hariIni = new Date();
    
    // Format tanggal Masehi bahasa Indonesia
    const opsiMasehi = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const tglMasehiStr = hariIni.toLocaleDateString('id-ID', opsiMasehi);
    
    // Eksekusi kalkulasi otomatis berbasis rumus kalibrasi baru
    const pasaranHariIni = getPasaranJawa(hariIni);
    const tglHijriyahStr = getTanggalHijriyah(hariIni);

    return `
        <div class="page-kalender">
            <h2 style="margin-bottom: 0.5rem; font-weight: 700; color: var(--primary-color); font-size: 1.4rem;">
                Kalender Hijriyah & Pasaran Jawa
            </h2>
            <p style="color: #4a5568; margin-bottom: 1.5rem; font-size: 0.9rem;">
                Informasi penanggalan Islam dan pasaran Jawa untuk mempermudah penentuan waktu ibadah, selapanan, dan kegiatan jemaah HARUM.
            </p>

            <div class="hari-ini-box" style="background: white; border-radius: 12px; box-shadow: var(--shadow); border: 1px solid var(--border-color); padding: 1.5rem; margin-bottom: 2rem; display: grid; grid-template-columns: 1fr; gap: 1rem; text-align: center;">
                <div>
                    <span style="font-size: 0.8rem; text-transform: uppercase; font-weight: 700; color: #718096; letter-spacing: 1px;">Hari Ini</span>
                    <h3 style="font-size: 1.5rem; color: var(--dark-color); font-weight: 700; margin-top: 0.25rem;">${tglMasehiStr}</h3>
                </div>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; border-top: 1px solid var(--border-color); padding-top: 1rem;">
                    <div style="background: #e8f5e9; padding: 1rem; border-radius: 8px; border: 1px solid #c8e6c9;">
                        <span style="font-size: 0.75rem; color: var(--primary-color); font-weight: 700; display: block; margin-bottom: 0.25rem;">PENANGGALAN ISLAM</span>
                        <span style="font-size: 1.2rem; font-weight: 700; color: #1b5e20;" id="display-hijriyah">${tglHijriyahStr}</span>
                    </div>
                    <div style="background: #fff8e1; padding: 1rem; border-radius: 8px; border: 1px solid #ffe082;">
                        <span style="font-size: 0.75rem; color: #b78103; font-weight: 700; display: block; margin-bottom: 0.25rem;">PASARAN JAWA</span>
                        <span style="font-size: 1.2rem; font-weight: 700; color: #744210;" id="display-pasaran">Rabu ${pasaranHariIni}</span>
                    </div>
                </div>
            </div>

            <h3 style="font-size: 1.1rem; color: var(--primary-color); margin-bottom: 1rem; font-weight: 700; border-left: 4px solid var(--accent-color); padding-left: 10px;">
                Patokan Agenda Rutin Organisasi
            </h3>
            
            <div class="agenda-pasaran-list">
                <div class="agenda-item" style="background: white; padding: 1rem; border-radius: 8px; border-left: 4px solid var(--secondary-color); margin-bottom: 0.75rem; box-shadow: var(--shadow); display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <h4 style="font-size: 0.95rem; font-weight: 700; color: var(--dark-color);">Iuran Rutin Selapanan</h4>
                        <p style="font-size: 0.8rem; color: #718096;">Penarikan iuran kas wajib oleh bendahara jemaah</p>
                    </div>
                    <span class="badge" style="background: #dc2626; color: white; font-weight: 700;">Setiap Jumat Pahing</span>
                </div>

                <div class="agenda-item" style="background: white; padding: 1rem; border-radius: 8px; border-left: 4px solid var(--accent-color); margin-bottom: 0.75rem; box-shadow: var(--shadow); display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <h4 style="font-size: 0.95rem; font-weight: 700; color: var(--dark-color);">Khotmil Qur'an & Pembacaan Sabilun Najah</h4>
                        <p style="font-size: 0.8rem; color: #718096;">Majelis dzikir bersama para sepuh dan jemaah</p>
                    </div>
                    <span class="badge" style="background: #e2e8f0; color: #4a5568; font-weight: 700;">Setiap Malam Kliwon</span>
                </div>
            </div>
        </div>
    `;
}
