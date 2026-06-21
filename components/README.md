# HARUM Components

## Struktur Komponen
Setiap file komponen bertanggung jawab untuk merender satu halaman spesifik.

### Daftar Komponen:
1. **dashboard.js** - Halaman beranda dengan statistik dan widget
2. **sabilun-najah.js** - Kumpulan amalan Syaikhuna
3. **kalender.js** - Kalender Hijriyah + Pasaran Jawa
4. **iuran-jumat.js** - Iuran rutin Jumat Pahing
5. **uang-kas.js** - Laporan keuangan kas
6. **quote.js** - Widget quote ayat Al-Qur'an
7. **pengumuman.js** - Papan pengumuman digital
8. **agenda-putri.js** - Agenda kedatangan putri Syaikhuna
9. **haul-akbar.js** - Informasi Haul Akbar
10. **iuran-malang.js** - Iuran rombongan ke Malang

### Pola Komponen:
```javascript
export function renderNamaHalaman({ user, isAdmin }) {
    // Kembalikan HTML string
    return `<div class="page-container">...</div>`;
}