const FIREBASE_URL = "https://harum-app-default-rtdb.firebaseio.com/";

const defaultData = {
    kas: { total: 0 },
    sosial: { total: 0 },
    sabilun: { total: 0 },
    jumat: { total: 0 },
    agenda: [],
    blog: []
};

// Fungsi Mengambil Data dari Firebase
async function fetchData(path) {
    try {
        const response = await fetch(`${FIREBASE_URL}${path}.json`);
        if (!response.ok) throw new Error("Gagal mengambil data");
        const data = await response.json();
        if (data === null) return defaultData[path] || 0;
        return data;
    } catch (error) {
        console.error(`Gagal memuat ${path}:`, error);
        return defaultData[path] || 0;
    }
}

// Inisialisasi Tampilan Data Utama saat Aplikasi Dibuka
async function initApp() {
    const dataKas = await fetchData("kas");
    const dataSosial = await fetchData("sosial");
    const dataSabilun = await fetchData("sabilun");
    const dataJumat = await fetchData("jumat");
    const dataAgenda = await fetchData("agenda");
    const dataBlog = await fetchData("blog");

    // Tampilkan Uang Kas
    if(document.getElementById("display-total-kas")) document.getElementById("display-total-kas").innerText = `Rp ${Number(dataKas.total || 0).toLocaleString('id-ID')}`;
    if(document.getElementById("display-total-sosial")) document.getElementById("display-total-sosial").innerText = `Rp ${Number(dataSosial.total || 0).toLocaleString('id-ID')}`;
    if(document.getElementById("display-total-sabilun")) document.getElementById("display-total-sabilun").innerText = `Rp ${Number(dataSabilun.total || 0).toLocaleString('id-ID')}`;
    if(document.getElementById("display-total-jumat")) document.getElementById("display-total-jumat").innerText = `Rp ${Number(dataJumat.total || 0).toLocaleString('id-ID')}`;

    // Tampilkan Agenda / Kalender
    const listAgenda = document.getElementById("list-agenda");
    if (listAgenda && Array.isArray(dataAgenda) && dataAgenda.length > 0) {
        listAgenda.innerHTML = "";
        dataAgenda.forEach(item => {
            const li = document.createElement("li");
            li.innerText = item;
            listAgenda.appendChild(li);
        });
    }

    // Tampilkan Artikel Blog Sabilunnajah
    const listBlog = document.getElementById("list-blog");
    if (listBlog && Array.isArray(dataBlog) && dataBlog.length > 0) {
        listBlog.innerHTML = "";
        dataBlog.reverse().forEach(artikel => { // reverse agar berita terbaru paling atas
            if(artikel) {
                const div = document.createElement("div");
                div.style.cssText = "padding: 12px 0; border-bottom: 1px solid #eee; margin-bottom: 5px;";
                div.innerHTML = `<h3 style="font-size:1rem; color:#0b5e32; margin-bottom:4px;">${artikel.judul}</h3><p style="font-size:0.85rem; color:#444; line-height:1.4;">${artikel.isi}</p>`;
                listBlog.appendChild(div);
            }
        });
    }
}

// Logika Proses Sistem Login Nomor HP
function handleLoginWindow() {
    const nomorHp = prompt("Masukkan nomor HP Anda:");
    if (!nomorHp) return;

    alert("Memeriksa otorisasi nomor...");

    fetch(`${FIREBASE_URL}users/${nomorHp}.json`)
        .then(res => res.json())
        .then(role => {
            const btn = document.getElementById("btn-login");
            if (role) {
                btn.innerText = `👤 ${role}`;
                alert(`Selamat datang! Anda login sebagai ${role}.`);
                if (role === "Admin") {
                    document.getElementById("admin-panel").style.display = "block";
                    window.scrollTo(0, document.body.scrollHeight); // Otomatis scroll ke bawah menuju panel admin
                }
            } else {
                btn.innerText = "👤 User";
                alert("Nomor Anda terdaftar sebagai pengunjung biasa.");
            }
        })
        .catch(err => alert("Gagal login: " + err));
}

// Alur Navigasi Menu Dropdown Admin (SUDAH DIPERBAIKI)
function toggleAdminForm() {
    const action = document.getElementById("admin-action").value;
    
    // Memastikan setiap form muncul tepat sesuai pilihan dropdown
    document.getElementById("form-kas").style.display = action === "kas" ? "block" : "none";
    document.getElementById("form-member").style.display = action === "member" ? "block" : "none";
    document.getElementById("form-agenda").style.display = action === "agenda" ? "block" : "none";
    document.getElementById("form-blog").style.display = action === "blog" ? "block" : "none";
}


// 1. PROSES ADMIN UPDATE UANG KAS
function saveKasAdmin() {
    const kategori = document.getElementById("input-kas-kategori").value;
    const nominal = document.getElementById("input-kas-nominal").value;
    if (!nominal) return alert("Nominal angka harus diisi!");

    fetch(`${FIREBASE_URL}${kategori}.json`, {
        method: "PUT",
        body: JSON.stringify({ total: parseInt(nominal) })
    })
    .then(() => { alert("Uang kas berhasil di-update!"); location.reload(); })
    .catch(err => alert("Gagal mengubah kas: " + err));
}

// 2. PROSES ADMIN MENDAFTARKAN MEMBER BARU
function saveMemberAdmin() {
    const noHp = document.getElementById("input-member-hp").value;
    const role = document.getElementById("input-member-role").value;
    if (!noHp) return alert("Isi nomor HP terlebih dahulu!");

    fetch(`${FIREBASE_URL}users/${noHp}.json`, {
        method: "PUT",
        body: JSON.stringify(role)
    })
    .then(() => { alert(`Nomor ${noHp} sukses didaftarkan sebagai ${role}!`); document.getElementById("input-member-hp").value = ""; })
    .catch(err => alert("Gagal mendaftarkan member: " + err));
}

// 3. PROSES ADMIN MENAMBAHKAN AGENDA KALENDER
async function saveAgendaAdmin() {
    const teksAgenda = document.getElementById("input-agenda-teks").value;
    if (!teksAgenda) return alert("Tuliskan isi agenda!");

    try {
        const res = await fetch(`${FIREBASE_URL}agenda.json`);
        let agenda = await res.json();
        if (!Array.isArray(agenda)) agenda = [];
        agenda.push(teksAgenda);

        await fetch(`${FIREBASE_URL}agenda.json`, { method: "PUT", body: JSON.stringify(agenda) });
        alert("Agenda berhasil disimpan!"); location.reload();
    } catch (e) { alert("Gagal menyimpan agenda: " + e); }
}

// 4. PROSES ADMIN MENERBITKAN BLOG SABILUNNAJAH
async function saveBlogAdmin() {
    const judul = document.getElementById("input-blog-judul").value;
    const isi = document.getElementById("input-blog-isi").value;
    if (!judul || !isi) return alert("Judul dan isi artikel tidak boleh kosong!");

    try {
        const res = await fetch(`${FIREBASE_URL}blog.json`);
        let blogList = await res.json();
        if (!Array.isArray(blogList)) blogList = [];
        blogList.push({ judul: judul, isi: isi });

        await fetch(`${FIREBASE_URL}blog.json`, { method: "PUT", body: JSON.stringify(blogList) });
        alert("Artikel blog berhasil diterbitkan!"); location.reload();
    } catch (e) { alert("Gagal menerbitkan blog: " + e); }
}

document.addEventListener("DOMContentLoaded", initApp);
