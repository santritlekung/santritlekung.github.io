// Data default untuk inisialisasi
const DEFAULT_DATA = {
    amalan: [
        { id: 1, judul: 'Tawasul', teks: 'Teks tawasul ...' },
        { id: 2, judul: 'Yasin', teks: 'Surat Yasin ...' },
        { id: 3, judul: 'Tahlil', teks: 'Tahlil ...' },
        { id: 4, judul: 'Hizib Bahar', teks: 'Hizib Bahar ...' },
        { id: 5, judul: 'Hizib Nashor', teks: 'Hizib Nashor ...' }
    ],
    anggota: [
        { id: 1, nama: 'Ahmad Fauzi', status: 'Lunas' },
        { id: 2, nama: 'Budi Santoso', status: 'Belum' },
        { id: 3, nama: 'Citra Dewi', status: 'Lunas' },
        { id: 4, nama: 'Dedi Kurniawan', status: 'Belum' },
        { id: 5, nama: 'Eka Putri', status: 'Lunas' }
    ],
    kas: [
        { id: 1, tipe: 'masuk', jumlah: 200000, keterangan: 'Iuran Jumat Pahing' },
        { id: 2, tipe: 'keluar', jumlah: 50000, keterangan: 'Beli perlengkapan' },
        { id: 3, tipe: 'masuk', jumlah: 150000, keterangan: 'Donasi' }
    ],
    pengumuman: [
        { id: 1, judul: 'Kegiatan Rutin', isi: 'Pengajian setiap Jumat malam.' },
        { id: 2, judul: 'Info Penting', isi: 'Persiapan Haul Akbar.' }
    ],
    iuranMalang: [
        { id: 1, nama: 'Ahmad Fauzi', sudahBayar: false },
        { id: 2, nama: 'Budi Santoso', sudahBayar: true },
        { id: 3, nama: 'Citra Dewi', sudahBayar: false }
    ],
    agendaPutri: {
        rundown: '08.00 - Sambutan\n09.00 - Acara Inti\n12.00 - Makan Siang',
        logistik: 'Tenda, kursi, konsumsi'
    },
    agendaHaul: {
        info: 'Haul Akbar Syaikhuna akan diadakan pada 15 Rajab.'
    }
};

// Fungsi baca data dari localStorage, jika kosong maka inisialisasi
function loadData(key) {
    let data = localStorage.getItem('harum_' + key);
    if (!data) {
        // set default jika belum ada
        localStorage.setItem('harum_' + key, JSON.stringify(DEFAULT_DATA[key]));
        return DEFAULT_DATA[key];
    }
    return JSON.parse(data);
}

function saveData(key, value) {
    localStorage.setItem('harum_' + key, JSON.stringify(value));
}

// Inisialisasi semua data jika belum
Object.keys(DEFAULT_DATA).forEach(k => {
    if (!localStorage.getItem('harum_' + k)) {
        localStorage.setItem('harum_' + k, JSON.stringify(DEFAULT_DATA[k]));
    }
});

// Helper untuk generate ID
function genId(arr) {
    return arr.length ? Math.max(...arr.map(a => a.id)) + 1 : 1;
}