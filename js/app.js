/* ==========================================================================
   APP CORE LOGIC - ROUTER, AUTHENTICATION (RBAC), & CRUD INTERACTIONS
   ========================================================================== */

const HARUM_App = {
    
    // 1. INISIALISASI AWAL APLIKASI
    init() {
        this.bindEvents();
        this.renderAuthStatus();
        this.routeChange(); // Jalankan router untuk halaman pertama kali dimuat
        this.updateTopbarQuote();
    },

    // 2. EVENT BINDING (MANAJEMEN EVENT TOMBOL & WINDOW)
    bindEvents() {
        // Router listener
        window.addEventListener('hashchange', () => this.routeChange());
        
        // Listener jika data di database berubah, re-render halaman aktif saat itu juga
        window.addEventListener('dbUpdated', () => this.routeChange());

        // Sidebar responsive toggle
        document.getElementById('toggle-sidebar').addEventListener('click', () => {
            document.getElementById('sidebar').classList.add('active');
        });
        document.getElementById('close-sidebar').addEventListener('click', () => {
            document.getElementById('sidebar').classList.remove('active');
        });

        // Modal Auth toggles
        document.getElementById('auth-btn').addEventListener('click', () => this.handleAuthClick());
        document.getElementById('close-login').addEventListener('click', () => {
            document.getElementById('login-modal').classList.remove('active');
        });

        // Form Login submit
        document.getElementById('login-form').addEventListener('submit', (e) => this.handleLoginSubmit(e));
    },

    // 3. HANDLER SYSTEM: ROUTING SINGLE PAGE APPLICATION (SPA)
    routeChange() {
        const hash = window.location.hash || '#dashboard';
        const contentArea = document.getElementById('app-content');
        const pageTitle = document.getElementById('page-title');
        
        // Tutup sidebar otomatis di mobile setelah klik menu
        document.getElementById('sidebar').classList.remove('active');

        // Manajemen Status Navigasi Active
        document.querySelectorAll('.nav-item').forEach(item => {
            if (item.getAttribute('href') === hash) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });

        // Map Route ke Komponen HTML Dinamis
        switch (hash) {
            case '#dashboard':
                pageTitle.innerText = "Dashboard Utama";
                contentArea.innerHTML = HARUM_Components.dashboard();
                break;
            case '#sabilun-najah':
                pageTitle.innerText = "Sabilun Najah (Amalan)";
                contentArea.innerHTML = HARUM_Components.sabilunNajah();
                break;
            case '#kalender':
                pageTitle.innerText = "Kalender Hijriyah & Pasaran";
                contentArea.innerHTML = HARUM_Components.kalender();
                break;
            case '#iuran-jumat':
                pageTitle.innerText = "Iuran Jumat Pahing";
                contentArea.innerHTML = HARUM_Components.iuranJumat();
                break;
            case '#uang-kas':
                pageTitle.innerText = "Buku Jurnal Kas";
                contentArea.innerHTML = HARUM_Components.uangKas();
                break;
            case '#pengumuman':
                pageTitle.innerText = "Papan Pengumuman";
                contentArea.innerHTML = HARUM_Components.pengumuman();
                break;
            case '#agenda-putri':
                pageTitle.innerText = "Agenda: Kedatangan Putri Syaikhuna";
                contentArea.innerHTML = HARUM_Components.agendaPutri();
                break;
            case '#agenda-haul':
                pageTitle.innerText = "Agenda: Haul Akbar Syaikhuna";
                contentArea.innerHTML = HARUM_Components.agendaHaul();
                break;
            case '#iuran-malang':
                pageTitle.innerText = "Rombongan Haul Malang";
                contentArea.innerHTML = HARUM_Components.iuranMalang();
                break;
            default:
                contentArea.innerHTML = `<h2>Halaman Tidak Ditemukan</h2>`;
        }
    },

    // 4. AUTHENTICATION SYSTEM (RBAC - ROLE BASED ACCESS CONTROL)
    handleAuthClick() {
        const currentRole = localStorage.getItem('harum_role');
        if (currentRole) {
            // Jika sudah masuk, tombol berfungsi sebagai LOGOUT
            localStorage.removeItem('harum_role');
            localStorage.removeItem('harum_phone');
            alert("Anda telah keluar dari sistem.");
            this.renderAuthStatus();
            this.routeChange();
        } else {
            // Jika belum masuk, buka MODAL LOGIN
            document.getElementById('login-modal').classList.add('active');
        }
    },

    handleLoginSubmit(e) {
        e.preventDefault();
        const phoneInput = document.getElementById('phone-number').value.trim();
        
        if (!phoneInput) return;

        // KETENTUAN RBAC: Jika diawali 0811 dianggap ADMIN, sisanya USER BIASA
        if (phoneInput.startsWith('0811')) {
            localStorage.setItem('harum_role', 'admin');
            localStorage.setItem('harum_phone', phoneInput);
            alert("Login Berhasil! Selamat Datang Admin HARUM.");
        } else {
            localStorage.setItem('harum_role', 'user');
            localStorage.setItem('harum_phone', phoneInput);
            alert("Login Berhasil! Anda masuk sebagai Anggota (Read-Only).");
        }

        // Reset form & tutup modal
        document.getElementById('login-form').reset();
        document.getElementById('login-modal').classList.remove('active');
        
        this.renderAuthStatus();
        this.routeChange(); // Perbarui halaman agar tombol CRUD muncul/hilang
    },

    renderAuthStatus() {
    const role = localStorage.getItem('harum_role');
    const phone = localStorage.getItem('harum_phone');
    const statusBox = document.getElementById('user-status-box');
    const authBtn = document.getElementById('auth-btn');

    if (role) {
        const badgeClass = role === 'admin' ? 'role-admin' : 'role-user';
        const roleName = role === 'admin' ? 'Administrator' : 'Anggota';
        
        statusBox.innerHTML = `
            <div><i class="fas fa-user-circle"></i> HP: <strong>${phone}</strong></div>
            <span class="role-badge ${badgeClass}">${roleName}</span>
        `;
        authBtn.innerHTML = `<i class="fas fa-sign-out-alt"></i> Keluar`;
    } else {
        statusBox.innerHTML = `
            <p style="color: rgba(255,255,255,0.6); font-style: italic;">Anda belum masuk. Masuk untuk akses pencatatan.</p>
        `;
        authBtn.innerHTML = `<i class="fas fa-sign-in-alt"></i> Login`;
    }
}


    // ==========================================================================
    // LOGIKA OPERASI DATA (CRUD UTILITIES KHUSUS ADMIN)
    // ==========================================================================
    
    // Fungsi untuk memicu input form interaktif (Menggunakan Prompt bawaan agar simpel, clean & handal)
    showActionModal(type) {
        if (!HARUM_Components.isAdmin()) return;

        const db = HARUM_DB.getAll();
        const id = Date.now().toString(); // Generate ID unik berbasis timestamp

        if (type === 'amalan') {
            const judul = prompt("Masukkan Judul Amalan Baru:");
            const deskripsi = prompt("Masukkan Deskripsi/Keterangan Amalan:");
            const teks = prompt("Masukkan Teks Bacaan Amalan (Teks Arab/Latin):");
            if (judul && teks) {
                db.amalan.push({ id, judul, deskripsi, teks });
                HARUM_DB.save(db);
            }
        } 
        else if (type === 'iuranJumat') {
            const nama = prompt("Masukkan Nama Anggota Baru:");
            if (nama) {
                db.iuranJumat.push({ id, nama, status: "Belum", nominal: 0, tanggal: "-" });
                HARUM_DB.save(db);
            }
        } 
        else if (type === 'uangKas') {
            const keterangan = prompt("Keterangan Transaksi:");
            const tipe = prompt("Ketik 'masuk' atau 'keluar':").toLowerCase();
            const nominal = parseInt(prompt("Masukkan Nominal Rupiah (Angka saja):"), 10);
            const tanggal = new Date().toISOString().split('T')[0];
            
            if (keterangan && (tipe === 'masuk' || tipe === 'keluar') && nominal) {
                db.uangKas.push({ id, keterangan, tipe, nominal, tanggal });
                HARUM_DB.save(db);
            } else {
                alert("Input tidak valid!");
            }
        } 
        else if (type === 'pengumuman') {
            const judul = prompt("Judul Pengumuman:");
            const isi = prompt("Isi lengkap pengumuman informasi:");
            const tanggal = new Date().toISOString().split('T')[0];
            if (judul && isi) {
                db.pengumuman.unshift({ id, judul, isi, tanggal }); // Masuk di urutan teratas
                HARUM_DB.save(db);
            }
        } 
        else if (type === 'agendaPutri') {
            const kegiatan = prompt("Nama Kebutuhan Logistik/Acara:");
            const penanggungJawab = prompt("Nama Penanggung Jawab / Divisi:");
            if (kegiatan && penanggungJawab) {
                db.agendaPutri.push({ id, kegiatan, penanggungJawab, status: "Belum" });
                HARUM_DB.save(db);
            }
        } 
        else if (type === 'iuranMalang') {
            const nama = prompt("Nama Jamaah Pendaftar:");
            const jumlahKursi = parseInt(prompt("Jumlah Kursi Pesanan (Angka):"), 10);
            const totalBayar = parseInt(prompt("Jumlah Nominal Pembayaran Awal/DP (Angka):"), 10);
            const status = prompt("Ketik Status Keuangan: 'Lunas' atau 'DP':");
            
            if (nama && jumlahKursi && totalBayar) {
                db.iuranMalang.push({ id, nama, jumlahKursi, totalBayar, status });
                HARUM_DB.save(db);
            }
        }
    },

    // Fungsi Global Hapus Data (Delete)
    deleteItem(key, id) {
        if (!HARUM_Components.isAdmin()) return;
        if (confirm("Apakah Anda yakin ingin menghapus data ini?")) {
            const db = HARUM_DB.getAll();
            db[key] = db[key].filter(item => item.id !== id);
            HARUM_DB.save(db);
        }
    },

    // Fungsi Khusus: Mengubah status iuran jumat pahing menjadi Lunas
    lunasiIuranJumat(id) {
        if (!HARUM_Components.isAdmin()) return;
        const db = HARUM_DB.getAll();
        const item = db.iuranJumat.find(i => i.id === id);
        if (item) {
            item.status = "Lunas";
            item.nominal = 20000; // Contoh tarif iuran standard
            item.tanggal = new Date().toISOString().split('T')[0];
            HARUM_DB.save(db);
        }
    },

    // Fungsi Khusus: Mengubah checklist Logistik Putri menjadi Selesai
    updateStatusPutri(id) {
        if (!HARUM_Components.isAdmin()) return;
        const db = HARUM_DB.getAll();
        const item = db.agendaPutri.find(i => i.id === id);
        if (item) {
            item.status = item.status === 'Belum' ? 'Proses' : 'Selesai';
            HARUM_DB.save(db);
        }
    },

    // Fungsi Khusus: Melunasi Biaya Kursi Bus Malang
    lunasiMalang(id) {
        if (!HARUM_Components.isAdmin()) return;
        const db = HARUM_DB.getAll();
        const item = db.iuranMalang.find(m => m.id === id);
        if (item) {
            item.status = "Lunas";
            HARUM_DB.save(db);
        }
    }
};

// Jalankan sistem saat file ini dieksekusi oleh browser
document.addEventListener('DOMContentLoaded', () => HARUM_App.init());
