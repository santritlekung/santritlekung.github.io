// Konfigurasi Alamat Firebase Realtime Database Anda
const FIREBASE_URL = "https://harum-app-default-rtdb.firebaseio.com/";

// Data Cadangan Standar (Mencegah macet/loading terus jika Firebase kosong)
const defaultData = {
    kas: { total: 0 },
    sosial: { total: 0 },
    sabilun: { total: 0 },
    jumat: { total: 0 },
    agenda: []
};

// Fungsi Mengambil Data dari Firebase
async function fetchData(path) {
    try {
        const response = await fetch(`${FIREBASE_URL}${path}.json`);
        if (!response.ok) throw new Error("Gagal mengambil data");
        const data = await response.json();
        
        // Jika data di peladen null/kosong, pakai data cadangan standar
        if (data === null) {
            return defaultData[path] || 0;
        }
        return data;
    } catch (error) {
        console.error(`Gagal memuat jalur (${path}):`, error);
        return defaultData[path] || 0;
    }
}

// Fungsi Mengisi Data ke Tampilan Layar (UI)
async function initApp() {
    const loadingScreen = document.getElementById("loading-screen");
    const mainContent = document.getElementById("main-content");

    // Ambil semua data dari Firebase secara paralel
    const dataKas = await fetchData("kas");
    const dataSosial = await fetchData("sosial");
    const dataSabilun = await fetchData("sabilun");
    const dataJumat = await fetchData("jumat");
    const dataAgenda = await fetchData("agenda");

    // Suntikkan data ke elemen HTML
    document.getElementById("display-total-kas").innerText = `Rp ${Number(dataKas.total || 0).toLocaleString('id-ID')}`;
    document.getElementById("display-total-sosial").innerText = `Rp ${Number(dataSosial.total || 0).toLocaleString('id-ID')}`;
    document.getElementById("display-total-sabilun").innerText = `Rp ${Number(dataSabilun.total || 0).toLocaleString('id-ID')}`;
    document.getElementById("display-total-jumat").innerText = `Rp ${Number(dataJumat.total || 0).toLocaleString('id-ID')}`;

    // Tampilkan data agenda jika ada
    const listAgenda = document.getElementById("list-agenda");
    if (Array.isArray(dataAgenda) && dataAgenda.length > 0) {
        listAgenda.innerHTML = "";
        dataAgenda.forEach(item => {
            const li = document.createElement("li");
            li.innerText = item;
            listAgenda.appendChild(li);
        });
    }

    // Sembunyikan layar loading, tampilkan konten utama aplikasi
    loadingScreen.style.display = "none";
    mainContent.classList.remove("content-hidden");
}

// Fungsi simulasi klik Login Nomor HP
function handleLoginWindow() {
    const nomorHp = prompt("Masukkan nomor HP Anda yang terdaftar:");
    if (!nomorHp) return;

    // Cek hak akses ke cabang /users di Firebase Anda
    fetch(`${FIREBASE_URL}users/${nomorHp}.json`)
        .then(res => res.json())
        .then(role => {
            const badge = document.getElementById("user-role");
            if (role) {
                badge.innerText = role;
                badge.className = `badge badge-${role.toLowerCase()}`;
                alert(`Selamat datang, Anda login sebagai ${role}!`);
            } else {
                badge.innerText = "User";
                badge.className = "badge badge-user";
                alert("Nomor Anda belum terdaftar sebagai Admin. Masuk sebagai User biasa.");
            }
        })
        .catch(err => alert("Gagal memeriksa data login. Periksa koneksi internet."));
}

// Jalankan inisialisasi aplikasi saat halaman selesai dimuat
document.addEventListener("DOMContentLoaded", initApp);
