import { FIREBASE_URL } from '../app.js';

// ==========================================================================
// DATA DEFAULT/MOCK AMALAN (Sebagai cadangan sebelum data Firebase dimuat)
// ==========================================================================
const amalanDefault = [
    {
        id: "amalan-1",
        judul: "Tawasul Syaikhuna",
        deskripsi: "Bacaan tawasul silsilah thariqah dan sanad keilmuan Syaikhuna Siddiq Abdullah.",
        konten: [
            { jenis: "latin", teks: "Ila hadrotin nabiyyil musthofa Muhammadin sallallahu 'alaihi wasallam..." },
            { jenis: "arab", teks: "إِلَى حَضْرَةِ النَّبِيِّ الْمُصْطَفَى مُحَمَّدٍ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ..." },
            { jenis: "latin", teks: "Wa ila hadroti Syaikhuna Siddiq Abdullah..." },
            { jenis: "arab", teks: "وَإِلَى حَضْرَةِ شَيْخِنَا صِدِّيق عَبْدِ اللهِ لَهُ الْفَاتِحَة..." }
        ]
    },
    {
        id: "amalan-2",
        judul: "Hizib Bahar",
        deskripsi: "Amalan keselamatan dan keteguhan hati dari Syaikh Abi Hasan Asy-Syadzili.",
        konten: [
            { jenis: "arab", teks: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ. يَا عَلِيُّ يَا عَظِيمُ يَا حَلِيمُ يَا عَلِيمُ" },
            { jenis: "latin", teks: "Bismillahirrohmanirrohim. Ya 'Aliyyu Ya 'Adhimu Ya Halimu Ya 'Alimu..." },
            { jenis: "arab", teks: "أَنْتَ رَبِّي وَعِلْمُكَ حَسْبِي فَنِعْمَ الرَّبُّ رَبِّي وَنِعْمَ الْحَسْبُ حَسْبِي" }
        ]
    }
];

// ==========================================================================
// FUNGSI UTAMA RENDER HALAMAN SABILUN NAJAH
// ==========================================================================
export async function renderSabilunNajah(role) {
    const isAdmin = role === 'Admin';
    let daftarAmalan = amalanDefault;

    // Ambil data real-time dari Firebase (jika sudah di-setup)
    try {
        const response = await fetch(`${FIREBASE_URL}/sabilun_najah.json`);
        const dataCloud = await response.json();
        if (dataCloud) {
            // Konversi objek Firebase ke format Array
            daftarAmalan = Object.keys(dataCloud).map(key => ({ id: key, ...dataCloud[key] }));
        }
    } catch (error) {
        console.warn("Menggunakan data lokal amalan karena database belum disetup:", error);
    }

    // HTML untuk tombol tambah data jika pengguna adalah Admin
    const adminHeaderHtml = isAdmin ? `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; background: #e8f5e9; padding: 1rem; border-radius: 8px; border: 1px solid #c8e6c9;">
            <span style="color: #2e7d32; font-weight: 600;"><i class="fa-solid fa-user-shield"></i> Mode Admin: Anda bisa mengelola kitab amalan.</span>
            <button class="btn btn-success" onclick="alert('Form tambah amalan ke Firebase akan terbuka di sini.')">
                <i class="fa-solid fa-plus"></i> Tambah Amalan Baru
            </button>
        </div>
    ` : '';

    // Loop data amalan menjadi deretan kartu daftar amalan
    let listAmalanHtml = '';
    daftarAmalan.forEach(amalan => {
        // Render isi amalan (Arab/Latin secara berurutan)
        let isiAmalanHtml = '';
        amalan.konten.forEach(item => {
            if (item.jenis === 'arab') {
                isiAmalanHtml += `<p class="arabic-text">${item.teks}</p>`;
            } else {
                isiAmalanHtml += `<p style="font-style: italic; color: #4a5568; margin-bottom: 1rem; font-size: 0.95rem; padding: 0 0.5rem;">${item.teks}</p>`;
            }
        });

        // Tombol aksi khusus Admin di setiap amalan
        const adminActionButtons = isAdmin ? `
            <div style="display: flex; gap: 0.5rem; justify-content: flex-end; margin-top: 1rem; padding-top: 1rem; border-top: 1px solid var(--border-color);">
                <button class="btn btn-primary" style="padding: 0.35rem 0.75rem; font-size: 0.8rem;" onclick="alert('Fungsi Edit ID: ${amalan.id}')">
                    <i class="fa-solid fa-pen-to-square"></i> Edit Teks
                </button>
                <button class="btn btn-danger" style="padding: 0.35rem 0.75rem; font-size: 0.8rem;" onclick="alert('Fungsi Hapus ID: ${amalan.id}')">
                    <i class="fa-solid fa-trash"></i> Hapus
                </button>
            </div>
        ` : '';

        listAmalanHtml += `
            <article class="card-amalan" style="background: white; padding: 1.5rem; border-radius: 12px; box-shadow: var(--shadow); margin-bottom: 1.5rem; border: 1px solid var(--border-color);">
                <div style="border-bottom: 2px solid var(--light-color); padding-bottom: 0.75rem; margin-bottom: 1rem;">
                    <h3 style="color: var(--primary-color); font-size: 1.25rem; font-weight: 700;">${amalan.judul}</h3>
                    <p style="font-size: 0.85rem; color: #718096; margin-top: 0.25rem;">${amalan.deskripsi}</p>
                </div>
                
                <div class="konten-kitab" style="max-height: 400px; overflow-y: auto; padding-right: 5px;">
                    ${isiAmalanHtml}
                </div>

                ${adminActionButtons}
            </article>
        `;
    });

    return `
        <div class="page-sabilun-najah">
            <h2 style="margin-bottom: 0.5rem; font-weight: 700; color: var(--primary-color); font-size: 1.4rem;">
                Sabilun Najah
            </h2>
            <p style="color: #4a5568; margin-bottom: 1.5rem; font-size: 0.9rem;">
                Kumpulan wirid, hizib, dan amalan utama yang diijazahkan oleh Syaikhuna Siddiq Abdullah.
            </p>

            ${adminHeaderHtml}

            <div class="daftar-amalan-container">
                ${listAmalanHtml}
            </div>
        </div>
    `;
}
