// ==========================================================================
// 1. KONFIGURASI ALAMAT FIREBASE REALTIME DATABASE
// ==========================================================================
const FIREBASE_URL = "https://harum-app-default-rtdb.firebaseio.com/";

// Data Cadangan Standar (Mencegah aplikasi macet/loading terus jika database kosong)
const defaultData = {
    kas: { total: 0 },
    sosial: { total: 0 },
    sabilun: { total: 0 },
    jumat: { total: 0 },
    agenda: []
};

// ==========================================================================
// 2. FUNGSI UNTUK MENGAMBIL DATA DARI FIREBASE (READ DATA)
// ==========================================================================
async function fetchData(path) {
    try {
        const response = await fetch(`${FIREBASE_URL}${path}.json`);
        if (!response.ok) throw new Error("Gagal mengambil data dari server");
        const data = await response.json();
        
        // Jika data di database null/belum ada, gunakan data cadangan
        if (data === null) {
            return defaultData[path] || 0;
        }
        return data;
    } catch (error) {
        console.error(`Gagal memuat jalur (${path}):`, error);
        return defaultData[path] || 0;
    }
}

// ==========================================================================
// 3. FUNGSI UTAMA UNTUK MENAMPILKAN DATA KE LAYAR (INITIALIZE APP)
// ==========================================================================
async function initApp() {
    const loadingScreen = document.getElementById("loading-screen");
    const mainContent = document.getElementById("main-content");

    // Ambil data secara bersamaan dari Firebase
    const dataKas = await fetchData("kas");
    const dataSosial = await fetchData("sosial");
    const dataSabilun = await fetchData("sabilun");
    const dataJumat = await fetchData("jumat");
    const dataAgenda = await fetchData("agenda");

    // Suntikkan nominal dana ke elemen HTML (Format Mata Uang Rupiah)
    if (document.getElementById("display-total-kas")) {
        document.getElementById("display-total-kas").innerText = `Rp ${Number(dataKas.total || 0).toLocaleString('id-ID')}`;
    }
    if (document.getElementById("display-total-sosial")) {
        document.getElementById("display-total-sosial").innerText = `Rp ${Number(dataSosial.total || 0).toLocaleString('id-ID')}`;
    }
    if (document.getElementById("display-total-sabilun")) {
        document.getElementById("display-total-sabilun").innerText = `Rp ${Number(dataSabilun.total || 0).toLocaleString('id-ID')}`;
    }
    if (document.getElementById("display-total-jumat")) {
        document.getElementById("display-total-jumat").innerText = `Rp ${Number(dataJumat.total || 0).toLocaleString('id-ID')}`;
    }

    // Tampilkan daftar agenda kegiatan
    const listAgenda = document.getElementById("list-agenda");
    if (listAgenda) {
        if (Array.isArray(dataAgenda) && dataAgenda.length > 0) {
            listAgenda.innerHTML = "";
            dataAgenda.forEach(item => {
                const li = document.createElement("li");
                li.innerText = item;
                listAgenda.appendChild(li);
            });
        } else {
            listAgenda.innerHTML = '<li class="empty-list">Belum ada agenda terdekat.</li>';
        }
    }

    // Sembunyikan layar loading dan tampilkan menu utama aplikasi
    if (loadingScreen) loadingScreen.style.display = "none";
    if (mainContent) mainContent.classList.remove("content-hidden");
}

// ==========================================================================
// 4. FUNGSI LOGIN NOMOR HP (SINKRONISASI DENGAN FIREBASE)
// ==========================================================================
function handleLoginWindow() {
    const nomorHp = prompt("Masukkan nomor HP Anda yang terdaftar:");
    
    // Jika user menekan tombol Batal (Cancel) atau membiarkan kosong
    if (!nomorHp) return;

    // Menampilkan notifikasi awal proses pengecekan
    alert("Sedang memeriksa nomor: " + nomorHp);

    // Ambil data role user dari cabang 'users/nomor_hp' di Firebase Anda
    fetch(`${FIREBASE_URL}users/${nomorHp}.json`)
        .then(res => {
            if (!res.ok) throw new Error("Respons jaringan bermasalah.");
            return res.json();
        })
        .then(role => {
            const badge = document.getElementById("user-role");
            
            if (role) {
                // Jika nomor HP ditemukan dan memiliki Role (misal: "Admin")
                if (badge) {
                    badge.innerText = role;
                    badge.className = `badge badge-${role.toLowerCase()}`;
                }
                alert(`Selamat datang! Anda berhasil masuk sebagai ${role}.`);
            } else {
                // Jika nomor HP tidak terdaftar di cabang 'users' Firebase
                if (badge) {
                    badge.innerText = "User";
                    badge.className = "badge badge-user";
                }
                alert("Nomor Anda tidak terdaftar sebagai Admin. Anda masuk sebagai Pengunjung (User) biasa.");
            }
        })
        .catch(err => {
            console.error("Kesalahan sistem login:", err);
            alert("Gagal terhubung ke database. Pastikan koneksi internet stabil atau periksa Rules Firebase Anda.");
        });
}

// JALANKAN APLIKASI OTOMATIS SAAT HALAMAN SELESAI DIMUAT BROWSER
document.addEventListener("DOMContentLoaded", initApp);
