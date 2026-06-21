/* ==========================================================================
   DATA STORE - SIMULASI DATABASE HARUM USING LOCALSTORAGE
   ========================================================================== */

// 1. Data Default / Awal (Seeding Data)
const defaultData = {
    // Kumpulan Amalan Sabilun Najah
    amalan: [
        { id: "1", judul: "Tawasul Syaikhuna", teks: "Khususon ila hadroti Syaikhuna Siddiq Abdullah...", deskripsi: "Dibaca sebelum memulai amalan utama." },
        { id: "2", judul: "Surah Yasin", teks: "Yaa Siiin. Wal Qur'anil hakiim...", deskripsi: "Dibaca rutin bersama-sama." },
        { id: "3", judul: "Tahlil", teks: "Laa ilaha illallah, Muhammadur Rasulullah...", deskripsi: "Amalan thariqah dan kirim doa arwah." },
        { id: "4", judul: "Hizib Bahar", teks: "Ya Aliyyu ya Azhimu ya Halimu ya Alim...", deskripsi: "Amalan benteng diri dan keselamatan dari Syaikhuna." },
        { id: "5", judul: "Hizib Nashor", teks: "Allahumma bika astaiynu fa a'inni...", deskripsi: "Dibaca untuk pertolongan khusus." }
    ],

    // Anggota & Iuran Rutin Jumat Pahing (Selapanan)
    iuranJumat: [
        { id: "1", nama: "Ahmad Mudzakkir", status: "Lunas", nominal: 20000, tanggal: "2026-06-19" },
        { id: "2", nama: "Siti Rahmawati", status: "Belum", nominal: 0, tanggal: "-" },
        { id: "3", nama: "M. Thohir", status: "Lunas", nominal: 20000, tanggal: "2026-06-19" },
        { id: "4", nama: "Bambang Al-Ghozi", status: "Belum", nominal: 0, tanggal: "-" }
    ],

    // Laporan Uang Kas Organisasi
    uangKas: [
        { id: "1", keterangan: "Saldo Awal Kas HARUM", tipe: "masuk", nominal: 1500000, tanggal: "2026-06-01" },
        { id: "2", keterangan: "Pembelian Konsumsi Rapat", tipe: "keluar", nominal: 250000, tanggal: "2026-06-10" },
        { id: "3", keterangan: "Iuran Jumat Pahing Juni", tipe: "masuk", nominal: 40000, tanggal: "2026-06-19" }
    ],

    // Papan Informasi / Pengumuman digital
    pengumuman: [
        { id: "1", judul: "Rapat Koordinasi Haul Akbar", isi: "Diharapkan kehadirannya untuk seluruh pengurus HARUM pada hari Ahad besok di sekretariat.", tanggal: "2026-06-20" },
        { id: "2", judul: "Pembukaan Pendaftaran Rombongan Malang", isi: "Pendaftaran akomodasi rombongan ke Malang resmi dibuka sampai akhir bulan ini.", tanggal: "2026-06-15" }
    ],

    // Agenda Khusus 1: Persiapan Kedatangan Putri Syaikhuna
    agendaPutri: [
        { id: "1", kegiatan: "Sewa Tenda & Panggung Utama", penanggungJawab: "Divisi Logistik", status: "Selesai" },
        { id: "2", kegiatan: "Konfirmasi Jadwal Penyambutan di Bandara", penanggungJawab: "Humas", status: "Proses" },
        { id: "3", kegiatan: "Konsumsi VIP & Jamuan Utama", penanggungJawab: "Divisi Konsumsi", status: "Belum" }
    ],

    // Agenda Khusus 2: Haul Akbar Syaikhuna
    agendaHaul: {
        tema: "Meneladani Jejak Dakwah Syaikhuna Siddiq Abdullah untuk Ummat",
        waktu: "Ahad Kliwon, 12 Juli 2026",
        tempat: "Pondok Pesantren Roudlotul Ulum Pusat",
        rundown: [
            { jam: "07:00 - 08:30", acara: "Pembukaan & Pembacaan Khotmil Qur'an" },
            { jam: "08:30 - 10:00", acara: "Pembalaan Sabilun Najah (Yasin, Tahlil, Hizib)" },
            { jam: "10:00 - selesai", acara: "Mauidhoh Hasanah & Doa Penutup" }
        ]
    },

    // Iuran Dana Rombongan ke Malang (Haul Akbar)
    iuranMalang: [
        { id: "1", nama: "Zainal Arifin", jumlahKursi: 1, totalBayar: 150000, status: "Lunas" },
        { id: "2", nama: "Keluarga H. Mansur", jumlahKursi: 3, totalBayar: 450000, status: "Lunas" },
        { id: "3", nama: "Rahmat Hidayat", jumlahKursi: 2, totalBayar: 100000, status: "DP" }
    ],

    // Kumpulan Quote Al-Qur'an Dinamis
    quotes: [
        "“Maka ingatlah kepada-Ku, Aku pun akan ingat kepadamu.” (QS. Al-Baqarah: 152)",
        "“Cukuplah Allah bagi kami dan Dia adalah sebaik-baik pelindung.” (QS. Ali 'Imran: 173)",
        "“Sesungguhnya sesudah kesulitan itu ada kemudahan.” (QS. Al-Insyirah: 6)",
        "“Dan barangsiapa bertawakal kepada Allah, niscaya Allah akan mencukupkan (keperluan)nya.” (QS. At-Talaq: 3)"
    ]
};

// 2. Fungsi Inisialisasi & Ambil Data dari LocalStorage
const HARUM_DB = {
    // Fungsi untuk cek dan mengisi database awal jika kosong
    init() {
        if (!localStorage.getItem('harum_data')) {
            localStorage.setItem('harum_data', JSON.stringify(defaultData));
        }
    },

    // Mengambil seluruh data saat ini
    getAll() {
        this.init();
        return JSON.parse(localStorage.getItem('harum_data'));
    },

    // Menyimpan kembali data yang sudah di-update
    save(data) {
        localStorage.setItem('harum_data', JSON.stringify(data));
        // Memicu event custom agar tampilan otomatis terupdate jika ada perubahan data
        window.dispatchEvent(new Event('dbUpdated'));
    }
};

// Jalankan inisialisasi awal database
HARUM_DB.init();
