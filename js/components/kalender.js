function renderKalender() {
    const now = new Date();
    const tahun = now.getFullYear();
    const bulan = now.getMonth();
    const tanggal = now.getDate();
    // Nama bulan Hijriyah (sederhana)
    const bulanHijri = ['Muharram','Safar','Rabiul Awal','Rabiul Akhir','Jumadil Awal','Jumadil Akhir','Rajab','Sya\'ban','Ramadhan','Syawal','Dzulqa\'dah','Dzulhijjah'];
    // Perhitungan kasar (hanya demo)
    const hijriYear = tahun - 622 + Math.floor((tahun - 622)/33);
    const hijriMonth = (bulan + 6) % 12; // asumsi
    const hijriDay = (tanggal + 15) % 30 + 1;
    // Pasaran Jawa (5 hari)
    const pasaran = ['Legi','Pahing','Pon','Wage','Kliwon'];
    const pasaranIndex = (tanggal + bulan + tahun) % 5;
    const pasaranName = pasaran[pasaranIndex];

    const html = `
        <h3>Kalender Hari Ini</h3>
        <div style="display:flex; gap:2rem; flex-wrap:wrap; margin:1rem 0;">
            <div><strong>Tanggal Masehi:</strong> ${tanggal} ${now.toLocaleString('id', {month:'long'})} ${tahun}</div>
            <div><strong>Tanggal Hijriyah:</strong> ${hijriDay} ${bulanHijri[hijriMonth]} ${hijriYear}</div>
            <div><strong>Pasaran Jawa:</strong> ${pasaranName}</div>
        </div>
        <p style="color:#64748b;">* Perhitungan hijriyah bersifat perkiraan untuk demo.</p>
    `;
    document.getElementById('pageContent').innerHTML = html;
}