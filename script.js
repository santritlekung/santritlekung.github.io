// ============================================================
//  DATA / STATE
// ============================================================
const STORAGE_KEY = 'harum_data_v5';

const defaultData = {
    members: [
        { id: 1, name: 'Ahmad Fauzi', paid: 0 },
        { id: 2, name: 'M. Rofiq', paid: 0 },
        { id: 3, name: 'Laily Maulida', paid: 0 },
        { id: 4, name: 'Khoirul Anam', paid: 0 },
        { id: 5, name: 'Siti Fatimah', paid: 0 },
    ],
    kas: [
        { id: 1, desc: 'Iuran Jumat Pahing (Ahmad)', amount: 20000, type: 'income', date: Date.now() - 86400000 * 10 },
        { id: 2, desc: 'Sumbangan', amount: 50000, type: 'income', date: Date.now() - 86400000 * 5 },
        { id: 3, desc: 'Pembelian ATK', amount: 35000, type: 'expense', date: Date.now() - 86400000 * 3 },
    ],
    bookContent: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ\n\nCatatan Sabilun Najah:\n- Bab 1: Ikhlas\n- Bab 2: Taqwa\n- Bab 3: Tawakal',
    jpDates: [],
    registeredUsers: [
        { name: 'Ahmad Fauzi', phone: '08123456789' },
        { name: 'M. Rofiq', phone: '08198765432' },
    ],
    users: [
        { username: 'admin', password: 'harum123' },
        { username: 'anggota', password: '123456' },
    ]
};

let data = loadData();
let currentUser = null;
let currentUserRole = 'anggota';
let currentCalMonth = new Date().getMonth();
let currentCalYear = new Date().getFullYear();

// ============================================================
//  HELPERS
// ============================================================
function loadData() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
            const parsed = JSON.parse(raw);
            for (const key in defaultData) {
                if (!(key in parsed)) parsed[key] = defaultData[key];
            }
            parsed.members.forEach(m => {
                if (m.paid === undefined) m.paid = 0;
                if (typeof m.paid === 'boolean') m.paid = m.paid ? 20000 : 0;
            });
            return parsed;
        }
    } catch (_) { /* ignore */ }
    return JSON.parse(JSON.stringify(defaultData));
}

function saveData() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function generateId(arr) {
    return arr.length ? Math.max(...arr.map(i => i.id || 0)) + 1 : 1;
}

function formatRupiah(n) {
    return 'Rp ' + Number(n).toLocaleString('id-ID');
}

function formatDate(d) {
    const dt = new Date(d);
    return dt.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}

function formatDateShort(d) {
    const dt = new Date(d);
    return dt.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
}

function toHijri(date) {
    const g = new Date(date);
    const ref = new Date(2000, 0, 1);
    const diffDays = Math.floor((g - ref) / 86400000);
    let hijriDay = (25 + diffDays) % 30;
    if (hijriDay < 1) hijriDay = 30;
    const hijriMonth = (8 + Math.floor((diffDays + 25) / 30)) % 12;
    const hijriYear = 1420 + Math.floor((diffDays + 25) / 360);
    const monthNames = [
        'Muharram', 'Safar', 'Rabiul Awal', 'Rabiul Akhir',
        'Jumadil Awal', 'Jumadil Akhir', 'Rajab', 'Sya\'ban',
        'Ramadhan', 'Syawal', 'Dzulqa\'dah', 'Dzulhijjah'
    ];
    return `${hijriDay} ${monthNames[hijriMonth]} ${hijriYear} H`;
}

function getPasaran(date) {
    const ref = new Date(2000, 0, 1);
    const diff = Math.floor((date - ref) / 86400000);
    const names = ['Legi', 'Pahing', 'Pon', 'Wage', 'Kliwon'];
    return names[((diff % 5) + 5) % 5];
}

function isJumatPahing(date) {
    const d = new Date(date);
    return d.getDay() === 5 && getPasaran(d) === 'Pahing';
}

function getJumatPahingDates(startYear, count = 20) {
    const result = [];
    const d = new Date(startYear, 0, 1);
    while (d.getDay() !== 5) d.setDate(d.getDate() + 1);
    let found = 0, attempts = 0;
    while (found < count && attempts < 1000) {
        if (isJumatPahing(d)) {
            result.push(new Date(d));
            found++;
            d.setDate(d.getDate() + 35);
        } else {
            d.setDate(d.getDate() + 7);
        }
        attempts++;
    }
    return result;
}

function getNextJumatPahing(fromDate) {
    const d = new Date(fromDate);
    d.setHours(0, 0, 0, 0);
    for (let i = 0; i < 100; i++) {
        if (isJumatPahing(d)) return new Date(d);
        d.setDate(d.getDate() + 1);
    }
    return null;
}

function getPaidLabel(paid) {
    if (paid >= 20000) return { label: 'Lunas', cls: 'lunas' };
    if (paid >= 10000) return { label: 'Setengah', cls: 'setengah' };
    return { label: 'Belum', cls: 'belum' };
}

// ============================================================
//  TOAST
// ============================================================
let toastTimer;

function showToast(msg) {
    const el = document.getElementById('toast');
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('show'), 3000);
}

// ============================================================
//  LOGIN
// ============================================================
const loginForm = document.getElementById('loginForm');
const loginError = document.getElementById('loginError');
const loginPage = document.getElementById('loginPage');
const mainApp = document.getElementById('mainApp');

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('loginUser').value.trim();
    const password = document.getElementById('loginPass').value.trim();
    const found = data.users.find(u => u.username === username && u.password === password);
    if (found) {
        currentUser = username;
        currentUserRole = (username === 'admin') ? 'admin' : 'anggota';
        document.getElementById('userNameDisplay').textContent = username;
        document.getElementById('dashUserName').textContent = username;
        loginPage.style.display = 'none';
        mainApp.style.display = 'flex';
        applyRole();
        renderAll();
        showToast('Selamat datang, ' + username + '!');
    } else {
        loginError.textContent = '❌ Nama atau sandi salah.';
    }
});

document.getElementById('logoutBtn').addEventListener('click', () => {
    currentUser = null;
    currentUserRole = 'anggota';
    mainApp.style.display = 'none';
    loginPage.style.display = 'flex';
    document.getElementById('loginUser').value = '';
    document.getElementById('loginPass').value = '';
    loginError.textContent = '';
    showToast('Berhasil keluar.');
});

document.getElementById('goToRegisterLink').addEventListener('click', (e) => {
    e.preventDefault();
    if (currentUser) {
        switchPage('register');
    } else {
        showToast('Silakan login terlebih dahulu, atau daftar via WhatsApp.');
    }
});

// ============================================================
//  ROLE-BASED VISIBILITY
// ============================================================
function applyRole() {
    const isAdmin = (currentUserRole === 'admin');
    const adminElements = [
        document.getElementById('adminControls'),
        document.getElementById('kasForm'),
        document.getElementById('bookEdit'),
        document.getElementById('jpGenerateBtn'),
    ];
    adminElements.forEach(el => {
        if (el) el.style.display = isAdmin ? 'flex' : 'none';
    });
}

// ============================================================
//  NAVIGATION
// ============================================================
const navTabs = document.querySelectorAll('.nav-tab');
const pages = {
    dashboard: document.getElementById('page-dashboard'),
    calendar: document.getElementById('page-calendar'),
    jumatpahing: document.getElementById('page-jumatpahing'),
    iuran: document.getElementById('page-iuran'),
    kas: document.getElementById('page-kas'),
    buku: document.getElementById('page-buku'),
    register: document.getElementById('page-register'),
};

function switchPage(pageId) {
    navTabs.forEach(tab => tab.classList.toggle('active', tab.dataset.page === pageId));
    Object.keys(pages).forEach(key => {
        pages[key].classList.toggle('active', key === pageId);
    });
    if (pageId === 'dashboard') renderDashboard();
    if (pageId === 'jumatpahing') renderJumatPahing();
    if (pageId === 'iuran') renderIuran();
    if (pageId === 'kas') renderKas();
    if (pageId === 'buku') renderBuku();
    if (pageId === 'register') renderRegister();
    if (pageId === 'calendar') renderCalendar();
}

navTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        switchPage(tab.dataset.page);
    });
});

// ============================================================
//  CLOCK
// ============================================================
function updateClock() {
    const now = new Date();
    const h = String(now.getHours()).padStart(2, '0');
    const m = String(now.getMinutes()).padStart(2, '0');
    const s = String(now.getSeconds()).padStart(2, '0');
    document.getElementById('digitalClock').textContent = `${h}:${m}:${s}`;
    const greg = now.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    document.getElementById('gregDate').textContent = greg;
    document.getElementById('hijriDateSmall').textContent = '🕌 ' + toHijri(now);
    document.getElementById('javanesePasaranDisplay').textContent = 'Pasaran hari ini: ' + getPasaran(now);
}
setInterval(updateClock, 1000);
updateClock();

// ============================================================
//  RENDER: DASHBOARD
// ============================================================
function renderDashboard() {
    const totalMembers = data.members.length;
    const totalKas = data.kas.reduce((sum, k) => sum + (k.type === 'income' ? k.amount : -k.amount), 0);
    const jpCount = data.jpDates.length || 0;
    const paidCount = data.members.filter(m => m.paid >= 20000).length;
    document.getElementById('dashTotalMembers').textContent = totalMembers;
    document.getElementById('dashTotalKas').textContent = formatRupiah(totalKas);
    document.getElementById('dashJpCount').textContent = jpCount;
    document.getElementById('dashPaidCount').textContent = paidCount;

    const now = new Date();
    const nextJp = getNextJumatPahing(now);
    const el = document.getElementById('dashNextJp');
    if (nextJp) {
        const diff = Math.ceil((nextJp - now) / 86400000);
        el.innerHTML = `
            <span style="font-size:1.4rem;display:block;margin-bottom:0.2rem;">⭐</span>
            <strong>${formatDate(nextJp)}</strong>
            <br>
            <span class="upcoming-badge">${diff} hari lagi</span>
        `;
    } else {
        el.textContent = 'Tidak ditemukan jadwal.';
    }
}

// ============================================================
//  RENDER: CALENDAR
// ============================================================
function renderCalendar() {
    const year = currentCalYear, month = currentCalMonth;
    const grid = document.getElementById('calendarGrid');
    document.getElementById('calMonthLabel').textContent =
        new Date(year, month).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = new Date();
    const todayDate = today.getDate(), todayMonth = today.getMonth(), todayYear = today.getFullYear();

    let html = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab']
        .map(d => `<div class="day-header">${d}</div>`).join('');
    for (let i = 0; i < firstDay; i++) html += `<div class="day-cell other-month"></div>`;

    for (let d = 1; d <= daysInMonth; d++) {
        const dateObj = new Date(year, month, d);
        const isToday = (d === todayDate && month === todayMonth && year === todayYear);
        const isJp = isJumatPahing(dateObj);
        let cls = 'day-cell';
        if (isToday) cls += ' today';
        if (isJp) cls += ' jumat-pahing';
        html += `<div class="${cls}" title="${getPasaran(dateObj)}">${d}${isJp ? ' ⭐' : ''}</div>`;
    }
    grid.innerHTML = html;

    document.getElementById('hijriDateDisplay').textContent = 'Hijriyah: ' + toHijri(new Date(year, month, 1));
    document.getElementById('javanesePasaranDisplay').textContent = 'Pasaran hari ini: ' + getPasaran(today);
}

document.getElementById('calPrev').addEventListener('click', () => {
    if (currentCalMonth === 0) { currentCalMonth = 11; currentCalYear--; } else { currentCalMonth--; }
    renderCalendar();
});
document.getElementById('calNext').addEventListener('click', () => {
    if (currentCalMonth === 11) { currentCalMonth = 0; currentCalYear++; } else { currentCalMonth++; }
    renderCalendar();
});

// ============================================================
//  RENDER: JUMAT PAHING
// ============================================================
function renderJumatPahing() {
    const list = document.getElementById('jpList');
    const now = new Date();
    let dates = data.jpDates.map(d => new Date(d));
    if (dates.length === 0) {
        dates = getJumatPahingDates(now.getFullYear() - 1, 12);
        data.jpDates = dates.map(d => d.toISOString());
        saveData();
    }
    dates.sort((a, b) => a - b);
    const upcoming = dates.filter(d => d >= now);
    const past = dates.filter(d => d < now).slice(-5);

    let html = '';
    const showUpcoming = upcoming.slice(0, 8);
    if (showUpcoming.length) {
        showUpcoming.forEach(d => {
            const diff = Math.ceil((d - now) / 86400000);
            html += `
                <li>
                    <span class="jp-date">${formatDate(d)}</span>
                    <span class="jp-badge upcoming">${diff <= 0 ? 'Hari ini!' : diff + ' hari lagi'}</span>
                </li>
            `;
        });
    } else {
        html += `<li style="justify-content:center;color:var(--text-light);">Tidak ada jadwal mendatang.</li>`;
    }
    if (past.length) {
        html += `<li style="justify-content:center;color:var(--text-light);font-size:0.7rem;padding:0.4rem 0;border-bottom:1px solid #eee;border-top:1px solid #eee;margin-top:0.3rem;">
            <i class="fas fa-history"></i> Jadwal sebelumnya
        </li>`;
        past.forEach(d => {
            html += `
                <li>
                    <span class="jp-date" style="opacity:0.7;">${formatDate(d)}</span>
                    <span class="jp-badge" style="background:#eee;color:#888;">selesai</span>
                </li>
            `;
        });
    }
    list.innerHTML = html;
}

document.getElementById('jpGenerateBtn').addEventListener('click', () => {
    const now = new Date();
    const dates = getJumatPahingDates(now.getFullYear() - 1, 24);
    data.jpDates = dates.map(d => d.toISOString());
    saveData();
    renderJumatPahing();
    showToast('Jadwal Jumat Pahing diperbarui!');
});

// ============================================================
//  RENDER: IURAN
// ============================================================
function renderIuran() {
    const tbody = document.getElementById('iuranTableBody');
    if (data.members.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;padding:1.5rem;color:var(--text-light);">Belum ada anggota. Tambahkan di bawah.</td></tr>`;
        return;
    }
    const isAdmin = (currentUserRole === 'admin');
    let html = '';
    data.members.forEach((m, idx) => {
        const status = getPaidLabel(m.paid);
        html += `
            <tr>
                <td style="text-align:center;font-weight:600;color:var(--text-light);">${idx+1}</td>
                <td><strong>${m.name}</strong></td>
                <td>${formatRupiah(m.paid)}</td>
                <td><span class="status-badge ${status.cls}">${status.label}</span></td>
                <td>
                    ${isAdmin ? `
                    <div class="pay-form">
                        <input type="number" id="payAmount_${m.id}" value="5000" min="1000" step="1000" style="width:60px;" />
                        <button onclick="addPayment(${m.id})">Bayar</button>
                        <button class="btn-reset" onclick="resetPayment(${m.id})" title="Reset ke 0"><i class="fas fa-undo"></i></button>
                        <button class="btn-hapus" onclick="deleteMember(${m.id})" title="Hapus"><i class="fas fa-trash"></i></button>
                    </div>
                    ` : `<span class="text-muted" style="font-size:0.7rem;">(hanya admin)</span>`}
                </td>
            </tr>
        `;
    });
    tbody.innerHTML = html;
}

window.addPayment = function(id) {
    if (currentUserRole !== 'admin') { showToast('Hanya admin yang bisa mengubah.'); return; }
    const input = document.getElementById('payAmount_' + id);
    let amount = parseInt(input.value);
    if (isNaN(amount) || amount <= 0) { showToast('Masukkan nominal positif.'); return; }
    const m = data.members.find(x => x.id === id);
    if (m) {
        m.paid = (m.paid || 0) + amount;
        saveData();
        renderIuran();
        renderDashboard();
        showToast(`${m.name} + ${formatRupiah(amount)} (total ${formatRupiah(m.paid)})`);
    }
};

window.resetPayment = function(id) {
    if (currentUserRole !== 'admin') { showToast('Hanya admin yang bisa mengubah.'); return; }
    if (!confirm('Reset pembayaran anggota ini menjadi 0?')) return;
    const m = data.members.find(x => x.id === id);
    if (m) {
        m.paid = 0;
        saveData();
        renderIuran();
        renderDashboard();
        showToast(`${m.name} direset.`);
    }
};

window.deleteMember = function(id) {
    if (currentUserRole !== 'admin') { showToast('Hanya admin yang bisa menghapus.'); return; }
    if (confirm('Hapus anggota ini?')) {
        data.members = data.members.filter(x => x.id !== id);
        saveData();
        renderIuran();
        renderDashboard();
        showToast('Anggota dihapus.');
    }
};

document.getElementById('iuranAddBtn').addEventListener('click', () => {
    if (currentUserRole !== 'admin') { showToast('Hanya admin yang bisa menambah.'); return; }
    const input = document.getElementById('iuranNewName');
    const name = input.value.trim();
    if (!name) { showToast('Masukkan nama anggota.'); return; }
    if (data.members.some(m => m.name.toLowerCase() === name.toLowerCase())) {
        showToast('Nama sudah ada.');
        return;
    }
    data.members.push({ id: generateId(data.members), name, paid: 0 });
    input.value = '';
    saveData();
    renderIuran();
    renderDashboard();
    showToast(`Anggota ${name} ditambahkan.`);
});

document.getElementById('iuranResetBtn').addEventListener('click', () => {
    if (currentUserRole !== 'admin') { showToast('Hanya admin yang bisa mereset.'); return; }
    if (confirm('Reset semua status iuran menjadi 0?')) {
        data.members.forEach(m => m.paid = 0);
        saveData();
        renderIuran();
        renderDashboard();
        showToast('Semua iuran direset.');
    }
});

// ============================================================
//  RENDER: KAS
// ============================================================
function renderKas() {
    const total = data.kas.reduce((sum, k) => sum + (k.type === 'income' ? k.amount : -k.amount), 0);
    document.getElementById('kasTotal').innerHTML = formatRupiah(total) + ' <small>saldo</small>';

    const container = document.getElementById('kasEntries');
    if (data.kas.length === 0) {
        container.innerHTML = `<div class="empty-state"><i class="fas fa-receipt"></i> Belum ada transaksi.</div>`;
        return;
    }
    const isAdmin = (currentUserRole === 'admin');
    const sorted = [...data.kas].sort((a, b) => b.date - a.date);
    let html = '';
    sorted.slice(0, 30).forEach(k => {
        const isIncome = k.type === 'income';
        const icon = isIncome ? 'fa-arrow-down' : 'fa-arrow-up';
        const cls = isIncome ? 'income' : 'expense';
        const sign = isIncome ? '+' : '-';
        html += `
            <div class="kas-entry">
                <span class="entry-desc">
                    <i class="fas ${icon}"></i>
                    <span>${k.desc || '—'}</span>
                    <span style="font-size:0.65rem;color:var(--text-light);flex-shrink:0;">${formatDateShort(k.date)}</span>
                </span>
                <span class="entry-amount ${cls}">${sign} ${formatRupiah(k.amount)}</span>
                ${isAdmin ? `<button class="btn-hapus-kas" onclick="deleteKasEntry(${k.id})" title="Hapus transaksi"><i class="fas fa-times"></i></button>` : ''}
            </div>
        `;
    });
    container.innerHTML = html;
}

window.deleteKasEntry = function(id) {
    if (currentUserRole !== 'admin') { showToast('Hanya admin yang bisa menghapus.'); return; }
    if (confirm('Hapus transaksi kas ini?')) {
        data.kas = data.kas.filter(k => k.id !== id);
        saveData();
        renderKas();
        renderDashboard();
        showToast('Transaksi dihapus.');
    }
};

document.getElementById('kasAddBtn').addEventListener('click', () => {
    if (currentUserRole !== 'admin') { showToast('Hanya admin yang bisa menambah.'); return; }
    const desc = document.getElementById('kasDesc').value.trim() || 'Transaksi';
    const amount = parseInt(document.getElementById('kasAmount').value);
    const type = document.getElementById('kasType').value;
    if (!amount || amount <= 0) { showToast('Masukkan jumlah yang valid.'); return; }
    data.kas.push({ id: generateId(data.kas), desc, amount, type, date: Date.now() });
    document.getElementById('kasDesc').value = '';
    document.getElementById('kasAmount').value = '';
    saveData();
    renderKas();
    renderDashboard();
    showToast(`Transaksi ${type === 'income' ? 'pemasukan' : 'pengeluaran'} dicatat.`);
});

// ============================================================
//  RENDER: BUKU (dengan font Amiri)
// ============================================================
function renderBuku() {
    document.getElementById('bookContent').textContent = data.bookContent || 'Belum ada catatan.';
    document.getElementById('bookEditor').value = data.bookContent || '';
    const isAdmin = (currentUserRole === 'admin');
    document.getElementById('bookEdit').style.display = isAdmin ? 'block' : 'none';
}

document.getElementById('bookSaveBtn').addEventListener('click', () => {
    if (currentUserRole !== 'admin') { showToast('Hanya admin yang bisa mengedit.'); return; }
    data.bookContent = document.getElementById('bookEditor').value;
    saveData();
    renderBuku();
    showToast('Buku berhasil disimpan!');
});

// ============================================================
//  RENDER: REGISTER
// ============================================================
function renderRegister() {
    const container = document.getElementById('registeredUsersList');
    if (data.registeredUsers.length === 0) {
        container.innerHTML = `<div style="color:var(--text-light);font-size:0.85rem;">Belum ada pendaftar.</div>`;
        return;
    }
    let html = '';
    data.registeredUsers.forEach(u => {
        html += `<span class="user-chip">👤 ${u.name} <span style="opacity:0.5;">📱${u.phone || '—'}</span></span>`;
    });
    container.innerHTML = html;
}

document.getElementById('waRegisterBtn').addEventListener('click', (e) => {
    e.preventDefault();
    const phone = '6281234567890';
    const msg = encodeURIComponent(
        'Halo, saya ingin mendaftar sebagai anggota HARUM.\n\n' +
        'Nama: [nama Anda]\nAlamat: [alamat]\nNo HP: [no HP]\n\nTerima kasih.'
    );
    window.open(`https://wa.me/${phone}?text=${msg}`, '_blank');
    showToast('Buka WhatsApp untuk mendaftar.');
});

// ============================================================
//  RENDER ALL & INIT
// ============================================================
function renderAll() {
    renderDashboard();
    renderCalendar();
    renderJumatPahing();
    renderIuran();
    renderKas();
    renderBuku();
    renderRegister();
    updateClock();
}

// Init JP dates if empty
if (data.jpDates.length === 0) {
    const now = new Date();
    const dates = getJumatPahingDates(now.getFullYear() - 1, 16);
    data.jpDates = dates.map(d => d.toISOString());
    saveData();
}

// Ensure members have paid as number
data.members.forEach(m => {
    if (m.paid === undefined) m.paid = 0;
    if (typeof m.paid === 'boolean') m.paid = m.paid ? 20000 : 0;
});

loginPage.style.display = 'flex';
mainApp.style.display = 'none';

console.log('🕌 HARUM v5 (dengan font Amiri untuk Buku)');
console.log('📦 Data:', data);
console.log('🔑 Akun: admin/harum123 | anggota/123456');

// Periodic refresh dashboard every 30s
setInterval(() => {
    if (currentUser) {
        const active = document.querySelector('.page.active');
        if (active && active.id === 'page-dashboard') renderDashboard();
    }
}, 30000);

// Keyboard: Esc logout
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && currentUser) {
        if (confirm('Keluar dari aplikasi?')) document.getElementById('logoutBtn').click();
    }
});