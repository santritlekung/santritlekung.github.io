// ==========================================================================
// DATA SIMULASI UTAMA (Bisa dipindahkan ke Firebase jika ingin dinamis)
// ==========================================================================
const quoteQuran = [
    { ayat: "إِنَّ مَعَ الْعُسْرِ يُسْرًا", arti: "Sesungguhnya sesudah kesulitan itu ada kemudahan.", surah: "QS. Al-Insyirah: 6" },
    { ayat: "وَاصْبِرْ لِحُكْمِ رَبِّكَ فَإِنَّكَ بِأَعْيُنِنَا", arti: "Dan bersabarlah menunggu ketetapan Tuhanmu, karena sesungguhnya kamu berada dalam pengawasan Kami.", surah: "QS. At-Thur: 48" },
    { ayat: "ادْعُونِي أَسْتَجِبْ لَكُمْ", arti: "Berdoalah kepada-Ku, niscaya akan Kuperkenankan bagimu.", surah: "QS. Ghafir: 60" }
];

const mediaData = {
    youtubeId: "dQw4w9WgXcQ", // Ganti dengan ID video YouTube pengajian/kegiatan Anda
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3", // Contoh file audio/murottal
    imageUrl: "https://images.unsplash.com/photo-1564507592333-c60657eea523?q=80&w=600" // Contoh foto kegiatan jemaah
};

// ==========================================================================
// FUNGSI UTAMA RENDER HALAMAN BERANDA
// ==========================================================================
export function renderBeranda(role) {
    // Ambil quote acak setiap kali halaman dibuka
    const randomQuote = quoteQuran[Math.floor(Math.random() * quoteQuran.length)];

    // Cek apakah user adalah Admin untuk menampilkan tombol manajemen/edit data
    const isAdmin = role === 'Admin';
    const adminControlHtml = isAdmin ? `
        <div class="admin-actions-bar" style="background: #fff3cd; padding: 10px; border-radius: 8px; margin-bottom: 1.5rem; border: 1px solid #ffeba2; display: flex; justify-content: space-between; align-items: center;">
            <span style="color: #664d03; font-weight: 600;"><i class="fa-solid fa-lock-open"></i> Mode Admin Aktif: Anda bisa mengelola konten Beranda.</span>
            <button class="btn btn-success btn-sm" onclick="alert('Fitur edit media via Firebase akan diintegrasikan pada tahap berikutnya.')">
                <i class="fa-solid fa-pen-to-square"></i> Edit Konten
            </button>
        </div>
    ` : '';

    return `
        <div class="page-beranda">
            ${adminControlHtml}

            <section class="card-quote" style="background: linear-gradient(135deg, var(--primary-color), var(--secondary-color)); color: white; padding: 2rem; border-radius: 12px; text-align: center; margin-bottom: 2rem; box-shadow: var(--shadow);">
                <i class="fa-solid fa-quote-left" style="font-size: 2rem; opacity: 0.3; margin-bottom: 0.5rem; display: block;"></i>
                <p class="arabic-text" style="color: white; text-align: center; font-size: 1.8rem; padding: 0.5rem 0; direction: rtl;">
                    ${randomQuote.ayat}
                </p>
                <p class="quote-arti" style="font-style: italic; font-size: 1rem; margin-top: 0.5rem; opacity: 0.9;">
                    "${randomQuote.arti}"
                </p>
                <span class="quote-surah" style="display: block; margin-top: 0.75rem; font-size: 0.8rem; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; color: var(--accent-color);">
                    ${randomQuote.surah}
                </span>
            </section>

            <h2 style="margin-bottom: 1rem; font-weight: 700; color: var(--primary-color); font-size: 1.4rem; border-left: 4px solid var(--accent-color); padding-left: 10px;">
                Media Jemaah HARUM
            </h2>
            
            <div class="media-grid" style="display: grid; grid-template-columns: 1fr; gap: 1.5rem;">
                
                <div class="media-card" style="background: white; padding: 1rem; border-radius: 12px; box-shadow: var(--shadow); border: 1px solid var(--border-color);">
                    <h3 style="font-size: 1rem; margin-bottom: 0.75rem; color: var(--dark-color); display: flex; align-items: center; gap: 0.5rem;">
                        <i class="fa-brands fa-youtube" style="color: #ff0000; font-size: 1.25rem;"></i> Video Pengajian Terbaru
                    </h3>
                    <div class="video-responsive">
                        <iframe 
                            src="https://www.youtube.com/embed/${mediaData.youtubeId}" 
                            title="YouTube video player" 
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                            allowfullscreen>
                        </iframe>
                    </div>
                </div>

                <div style="display: grid; grid-template-columns: 1fr; gap: 1.5rem;">
                    
                    <div class="media-card" style="background: white; padding: 1rem; border-radius: 12px; box-shadow: var(--shadow); border: 1px solid var(--border-color);">
                        <h3 style="font-size: 1rem; margin-bottom: 0.75rem; color: var(--dark-color); display: flex; align-items: center; gap: 0.5rem;">
                            <i class="fa-solid fa-radio" style="color: var(--secondary-color);"></i> Audio / Murottal
                        </h3>
                        <audio controls style="width: 100%; margin-top: 0.5rem;">
                            <source src="${mediaData.audioUrl}" type="audio/mpeg">
                            Browser Anda tidak mendukung pemutar audio langsung.
                        </audio>
                    </div>

                    <div class="media-card" style="background: white; padding: 1rem; border-radius: 12px; box-shadow: var(--shadow); border: 1px solid var(--border-color);">
                        <h3 style="font-size: 1rem; margin-bottom: 0.75rem; color: var(--dark-color); display: flex; align-items: center; gap: 0.5rem;">
                            <i class="fa-solid fa-image" style="color: #3182ce;"></i> Dokumentasi Kegiatan Majelis
                        </h3>
                        <img src="${mediaData.imageUrl}" alt="Foto Majelis" style="width: 100%; height: 200px; object-fit: cover; border-radius: 8px; margin-top: 0.5rem;">
                    </div>

                </div>

            </div>
        </div>
    `;
}
