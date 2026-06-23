// Konfigurasi Firebase Realtime Database Anda
const FIREBASE_URL = "https://harum-app-default-rtdb.firebaseio.com/";

// Data Cadangan Lokal (Otomatis digunakan jika Firebase belum terisi data)
const defaultData = {
    kas: { total: 0, riwayat: [] },
    sabilun: { total: 0, riwayat: [] },
    jumat: { total: 0, riwayat: [] },
    sosial: { total: 0, riwayat: [] },
    agenda: []
};

// Fungsi global untuk mengambil data dari Firebase
async function fetchData(path) {
    try {
        const response = await fetch(`${FIREBASE_URL}${path}.json`);
        if (!response.ok) throw new Error("Gagal mengambil data dari peladen.");
        const data = await response.json();
        
        // Jika data di Firebase masih kosong, gunakan data cadangan lokal
        if (data === null && defaultData[path]) {
            return defaultData[path];
        }
        return data;
    } catch (error) {
        console.error(`Error Fetch (${path}):`, error);
        return defaultData[path] || null;
    }
}

// Fungsi global untuk menyimpan/memperbarui data ke Firebase
async function saveData(path, data) {
    try {
        const response = await fetch(`${FIREBASE_URL}${path}.json`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error("Gagal menyimpan data ke peladen.");
        return true;
    } catch (error) {
        console.error(`Error Save (${path}):`, error);
        alert("Gagal menyambung ke server cloud. Pastikan koneksi internet aktif.");
        return false;
    }
}

// Inisialisasi status Login Pengguna saat aplikasi dibuka
document.addEventListener("DOMContentLoaded", () => {
    console.log("Aplikasi HARUM telah terhubung ke Firebase:", FIREBASE_URL);
});
