// utils/storage.js - Data persistence

export const DATA_KEYS = {
    AMALAN: 'harum_amalan',
    ANGGOTA: 'harum_anggota',
    KAS: 'harum_kas',
    PENGUMUMAN: 'harum_pengumuman',
    AGENDA_PUTRI: 'harum_agenda_putri',
    HAUL: 'harum_haul',
    IURAN_MALANG: 'harum_iuran_malang',
    QUOTES: 'harum_quotes',
};

// ===== DEFAULT DATA =====
const DEFAULT_DATA = {
    [DATA_KEYS.AMALAN]: {
        tawasul: {
            title: 'Tawasul',
            description: 'Amalan tawasul kepada Syaikhuna Siddiq Abdullah',
            content: `بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ

أَللَّهُمَّ صَلِّ عَلَىٰ سَيِّدِنَا مُحَمَّدٍ وَعَلَىٰ آلِ سَيِّدِنَا مُحَمَّدٍ

أَللَّهُمَّ إِنَّا نَتَوَسَّلُ إِلَيْكَ بِسَيِّدِنَا مُحَمَّدٍ نَبِيِّ الرَّحْمَةِ

وَبِسَيِّدِنَا الشَّيْخِ صِدِّيقِ عَبْدِ اللَّهِ

أَنْ تَغْفِرَ لَنَا وَلِمَشَايِخِنَا وَلِإِخْوَانِنَا

وَأَنْ تُعِينَنَا عَلَىٰ طَاعَتِكَ وَعِبَادَتِكَ

إِنَّكَ سَمِيعُ الدُّعَاءِ`,
            arabic: true,
        },
        yasin: {
            title: 'Surat Yasin',
            description: 'Bacaan Surat Yasin 3x setiap malam Jumat',
            content: `بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ

يسٓ ۞ وَالْقُرْآنِ الْحَكِيمِ

إِنَّكَ لَمِنَ الْمُرْسَلِينَ

عَلَىٰ صِرَاطٍ مُّسْتَقِيمٍ

تَنزِيلَ الْعَزِيزِ الرَّحِيمِ

... (lanjutan)`,
            arabic: true,
        },
        tahlil: {
            title: 'Tahlil',
            description: 'Tahlil untuk arwah para guru dan orang tua',
            content: `لَا إِلَٰهَ إِلَّا اللَّهُ

لَا إِلَٰهَ إِلَّا اللَّهُ

لَا إِلَٰهَ إِلَّا اللَّهُ

لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ

لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ يُحْيِي وَيُمِيتُ

وَهُوَ حَيٌّ لَّا يَمُوتُ بِيَدِهِ الْخَيْرُ

وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ`,
            arabic: true,
        },
        hizib_bahar: {
            title: 'Hizib Bahar',
            description: 'Hizib Bahar untuk perlindungan dan keselamatan',
            content: `بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ

يَا عَلِيُّ يَا عَظِيمُ يَا حَلِيمُ يَا كَرِيمُ

... (lanjutan)`,
            arabic: true,
        },
        hizib_nashor: {
            title: 'Hizib Nashor',
            description: 'Hizib Nashor untuk pertolongan dan kemenangan',
            content: `بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ

يَا نَاصِرُ يَا مُعِينُ يَا فَتَّاحُ يَا عَلِيمُ

... (lanjutan)`,
            arabic: true,
        },
    },
    [DATA_KEYS.ANGGOTA]: [
        { id: 1, name: 'H. Ahmad Fauzi', active: true, status: 'lunas' },
        { id: 2, name: 'Hj. Siti Maryam', active: true, status: 'lunas' },
        { id: 3, name: 'Bpk. Suparman', active: true, status: 'belum' },
        { id: 4, name: 'Ibu Kartini', active: true, status: 'lunas' },
        { id: 5, name: 'Bpk. Slamet Riyadi', active: true, status: 'lunas' },
        { id: 6, name: 'Ibu Dewi', active: false, status: 'belum' },
        { id: 7, name: 'H. M. Ali', active: true, status: 'lunas' },
        { id: 8, name: 'Hj. Nurhayati', active: true, status: 'belum' },
    ],
    [DATA_KEYS.KAS]: {
        transactions: [
            { id: 1, type: 'masuk', amount: 500000, desc: 'Iuran Jumat Pahing', date: '2024-01-05' },
            { id: 2, type: 'keluar', amount: 200000, desc: 'Pembelian perlengkapan', date: '2024-01-06' },
            { id: 3, type: 'masuk', amount: 750000, desc: 'Donasi umum', date: '2024-01-12' },
            { id: 4, type: 'keluar', amount: 300000, desc: 'Catering acara', date: '2024-01-15' },
        ],
        saldo: 750000,
    },
    [DATA_KEYS.PENGUMUMAN]: [
        {
            id: 1,
            title: 'Peringatan Haul Akbar',
            content: 'Insya Allah Haul Akbar Syaikhuna akan dilaksanakan pada tanggal 15 Rajab 1446 H.',
            date: '2024-01-20',
            priority: 'high',
        },
        {
            id: 2,
            title: 'Kegiatan Rutin Jumat Pahing',
            content: 'Diadakan setiap selapanan, diisi dengan tahlil dan doa bersama.',
            date: '2024-01-19',
            priority: 'normal',
        },
    ],
    [DATA_KEYS.AGENDA_PUTRI]: {
        status: 'persiapan',
        tanggal_kedatangan: '2024-02-15',
        rundown: [
            { waktu: '08:00', kegiatan: 'Persiapan lokasi', penanggung_jawab: 'Panitia' },
            { waktu: '10:00', kegiatan: 'Penyambutan', penanggung_jawab: 'H. Ahmad' },
            { waktu: '12:00', kegiatan: 'Acara utama', penanggung_jawab: 'Sekretariat' },
        ],
        logistik: [
            { item: 'Konsumsi', qty: 100, status: 'ready' },
            { item: 'Souvenir', qty: 50, status: 'pending' },
            { item: 'Dekorasi', qty: 1, status: 'ready' },
        ],
    },
    [DATA_KEYS.HAUL]: {
        tahun: 1446,
        tanggal: '15 Rajab 1446 H',
        tema: 'Meneladani Akhlak Syaikhuna',
        pembicara: ['Kyai H. Abdullah', 'Ustadz M. Ali', 'Kyai H. Shiddiq'],
        jadwal: [
            { waktu: '07:00', acara: 'Pembukaan' },
            { waktu: '08:00', acara: 'Tahlil & Doa' },
            { waktu: '09:30', acara: 'Sambutan' },
            { waktu: '10:00', acara: 'Pengajian Akbar' },
            { waktu: '11:30', acara: 'Doa Penutup' },
        ],
    },
    [DATA_KEYS.IURAN_MALANG]: {
        target: 5000000,
        terkumpul: 2500000,
        peserta: [
            { id: 1, name: 'H. Ahmad Fauzi', sudah_bayar: true, nominal: 500000 },
            { id: 2, name: 'Bpk. Suparman', sudah_bayar: false, nominal: 0 },
            { id: 3, name: 'Ibu Kartini', sudah_bayar: true, nominal: 300000 },
            { id: 4, name: 'Bpk. Slamet', sudah_bayar: false, nominal: 0 },
            { id: 5, name: 'Hj. Siti Maryam', sudah_bayar: true, nominal: 500000 },
        ],
    },
    [DATA_KEYS.QUOTES]: [
        {
            arabic: 'إِنَّمَا الْمُؤْمِنُونَ إِخْوَةٌ',
            translation: 'Sesungguhnya orang-orang mukmin adalah bersaudara.',
            source: 'Q.S. Al-Hujurat: 10',
        },
        {
            arabic: 'وَتَعَاوَنُوا عَلَى الْبِرِّ وَالتَّقْوَىٰ',
            translation: 'Dan tolong-menolonglah kamu dalam (mengerjakan) kebajikan dan takwa.',
            source: 'Q.S. Al-Maidah: 2',
        },
        {
            arabic: 'إِنَّ اللَّهَ مَعَ الصَّابِرِينَ',
            translation: 'Sesungguhnya Allah bersama orang-orang yang sabar.',
            source: 'Q.S. Al-Baqarah: 153',
        },
        {
            arabic: 'وَمَا تَوْفِيقِي إِلَّا بِاللَّهِ',
            translation: 'Dan tidak ada taufik bagiku kecuali dengan (pertolongan) Allah.',
            source: 'Q.S. Hud: 88',
        },
        {
            arabic: 'وَاذْكُرُوا اللَّهَ كَثِيرًا لَّعَلَّكُمْ تُفْلِحُونَ',
            translation: 'Dan berdzikirlah kepada Allah sebanyak-banyaknya agar kamu beruntung.',
            source: 'Q.S. Al-Jumu\'ah: 10',
        },
        {
            arabic: 'فَإِنَّ مَعَ الْعُسْرِ يُسْرًا',
            translation: 'Karena sesungguhnya bersama kesulitan itu ada kemudahan.',
            source: 'Q.S. Al-Insyirah: 5',
        },
    ],
};

// ===== LOAD DATA =====
export function loadData() {
    Object.entries(DEFAULT_DATA).forEach(([key, defaultVal]) => {
        if (!localStorage.getItem(key)) {
            localStorage.setItem(key, JSON.stringify(defaultVal));
        }
    });
}

// ===== GET DATA =====
export function getData(key) {
    const data = localStorage.getItem(key);
    if (!data) {
        // Try to load default
        if (DEFAULT_DATA[key]) {
            localStorage.setItem(key, JSON.stringify(DEFAULT_DATA[key]));
            return DEFAULT_DATA[key];
        }
        return null;
    }
    return JSON.parse(data);
}

// ===== SAVE DATA =====
export function saveData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

// ===== RESET DATA =====
export function resetData(key) {
    if (DEFAULT_DATA[key]) {
        localStorage.setItem(key, JSON.stringify(DEFAULT_DATA[key]));
        return DEFAULT_DATA[key];
    }
    return null;
}