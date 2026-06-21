// components/kalender.js - Kalender Hijriyah + Pasaran Jawa

import { getData, saveData, DATA_KEYS } from '../utils/storage.js';

// Data pasaran Jawa
const PASARAN = ['Legi', 'Pahing', 'Pon', 'Wage', 'Kliwon'];
const BULAN_HIJRIYAH = [
    'Muharram', 'Safar', 'Rabiul Awal', 'Rabiul Akhir',
    'Jumadil Awal', 'Jumadil Akhir', 'Rajab', 'Sya\'ban',
    'Ramadhan', 'Syawal', 'Dzulqa\'dah', 'Dzulhijjah'
];

// Konversi Gregorian ke Hijriyah (simplifikasi)
function gregorianToHijri(date) {
    // Ini adalah perhitungan sederhana, untuk produksi lebih baik pakai library
    const g = new Date(date);
    const year = g.getFullYear();
    const month = g.getMonth() + 1;
    const day = g.getDate();
    
    // Rumus sederhana (approksimasi)
    const hijriYear = Math.floor((year - 622) * 1.03069) + 1;
    const daysInYear = 354.367;
    const dayOfYear = Math.floor((Date.UTC(year, month-1, day) - Date.UTC(year, 0, 0)) / 86400000);
    const hijriDay = Math.floor((dayOfYear * 0.97023) % 29.5) + 1;
    const hijriMonth = Math.floor((dayOfYear * 0.97023) / 29.5) % 12;
    
    return {
        day: hijriDay,
        month: BULAN_HIJRIYAH[hijriMonth] || 'Muharram',
        year: hijriYear,
    };
}

export function renderKalender({ user, isAdmin }) {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    
    return `
        <div class="page-container">
            <div class="card">
                <div class="card-title">
                    <i class="fas fa-calendar-alt"></i> Kalender Hijriyah & Pasaran Jawa
                    <span style="font-size: 14px; font-weight: 400; color: var(--text-light); margin-left: 8px;">
                        ${today.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                    </span>
                </div>
                
                <!-- Info Hari Ini -->
                <div style="background: var(--bg); padding: 16px; border-radius: 8px; margin-bottom: 20px;">
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 12px; text-align: center;">
                        <div>
                            <small style="color: var(--text-light);">Tanggal Masehi</small>
                            <p style="font-size: 18px; font-weight: 600; margin: 4px 0;">${today.getDate()}</p>
                            <small>${today.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}</small>
                        </div>
                        <div>
                            <small style="color: var(--text-light);">Tanggal Hijriyah</small>
                            <p style="font-size: 18px; font-weight: 600; margin: 4px 0;">${getHijriToday()}</p>
                            <small>${getHijriMonthYear()}</small>
                        </div>
                        <div>
                            <small style="color: var(--text-light);">Pasaran Jawa</small>
                            <p style="font-size: 18px; font-weight: 600; margin: 4px 0; color: var(--secondary);">${getPasaran(today)}</p>
                            <small>Hari ${today.toLocaleDateString('id-ID', { weekday: 'long' })}</small>
                        </div>
                    </div>
                </div>
                
                <!-- Kalender Bulan Ini -->
                <div style="margin-top: 16px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                        <button onclick="changeMonth(-1)" class="btn btn-outline btn-sm">
                            <i class="fas fa-chevron-left"></i>
                        </button>
                        <h3 style="margin: 0;">${getMonthName(currentMonth)} ${currentYear}</h3>
                        <button onclick="changeMonth(1)" class="btn btn-outline btn-sm">
                            <i class="fas fa-chevron-right"></i>
                        </button>
                    </div>
                    
                    <div style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 4px; text-align: center; font-size: 13px;">
                        ${['Min','Sen','Sel','Rab','Kam','Jum','Sab'].map(day => `
                            <div style="font-weight: 600; color: var(--text-light); padding: 8px 0; background: var(--bg); border-radius: 4px;">
                                ${day}
                            </div>
                        `).join('')}
                        
                        ${generateCalendar(currentMonth, currentYear)}
                    </div>
                </div>
                
                <!-- Legenda -->
                <div style="margin-top: 20px; padding-top: 16px; border-top: 1px solid var(--border); display: flex; flex-wrap: wrap; gap: 16px; font-size: 13px;">
                    <div><span style="display: inline-block; width: 12px; height: 12px; background: var(--secondary-light); border-radius: 2px;"></span> Hari Jumat Pahing</div>
                    <div><span style="display: inline-block; width: 12px; height: 12px; background: #d4edda; border-radius: 2px;"></span> Hari Ini</div>
                    <div><span style="display: inline-block; width: 12px; height: 12px; background: #fff3cd; border-radius: 2px;"></span> Acara Khusus</div>
                </div>
            </div>
            
            <!-- Info Acara -->
            <div class="card">
                <div class="card-title">
                    <i class="fas fa-info-circle"></i> Info Acara Mendatang
                </div>
                <div id="acara-mendatang">
                    <p style="color: var(--text-light);">Memuat acara...</p>
                </div>
            </div>
        </div>
    `;
}

// ===== HELPER FUNCTIONS =====
function getPasaran(date) {
    // Perhitungan sederhana pasaran Jawa
    // Konstanta: 1 Januari 2020 = Rabu Wage
    const base = new Date(2020, 0, 1);
    const diff = Math.floor((date - base) / 86400000);
    const index = (diff + 3) % 5; // 3 = indeks Wage
    return PASARAN[index];
}

function getHijriToday() {
    const hijri = gregorianToHijri(new Date());
    return `${hijri.day}`;
}

function getHijriMonthYear() {
    const hijri = gregorianToHijri(new Date());
    return `${hijri.month} ${hijri.year} H`;
}

function getMonthName(month) {
    return ['Januari','Februari','Maret','April','Mei','Juni',
            'Juli','Agustus','September','Oktober','November','Desember'][month];
}

function generateCalendar(month, year) {
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = new Date();
    const isCurrentMonth = month === today.getMonth() && year === today.getFullYear();
    const todayDate = today.getDate();
    
    let html = '';
    
    // Empty cells for days before first day
    for (let i = 0; i < firstDay; i++) {
        html += '<div style="padding: 8px 0;"></div>';
    }
    
    // Generate days
    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day);
        const pasaran = getPasaran(date);
        const isToday = isCurrentMonth && day === todayDate;
        const isJumatPahing = date.getDay() === 5 && pasaran === 'Pahing'; // Jumat = 5
        const isSpecialEvent = checkSpecialEvent(date);
        
        let bgColor = 'var(--card-bg)';
        if (isToday) bgColor = '#d4edda';
        else if (isJumatPahing) bgColor = 'var(--secondary-light)';
        else if (isSpecialEvent) bgColor = '#fff3cd';
        
        html += `
            <div style="
                background: ${bgColor};
                padding: 8px 4px;
                border-radius: 4px;
                border: ${isToday ? '2px solid var(--primary)' : '1px solid var(--border)'};
                cursor: pointer;
                transition: all 0.2s;
                ${isJumatPahing ? 'font-weight: 600;' : ''}
            " onclick="showDayInfo(${year}, ${month}, ${day})">
                <div>${day}</div>
                <small style="font-size: 10px; color: var(--text-light); display: block;">${pasaran}</small>
                ${isJumatPahing ? '<div style="font-size: 8px; color: var(--secondary);">Jumat Pahing</div>' : ''}
            </div>
        `;
    }
    
    return html;
}

function checkSpecialEvent(date) {
    // Cek apakah ada acara khusus pada tanggal ini
    const agenda = getData(DATA_KEYS.AGENDA_PUTRI) || {};
    const haul = getData(DATA_KEYS.HAUL) || {};
    
    // Cek tanggal kedatangan putri
    if (agenda.tanggal_kedatangan) {
        const tgl = new Date(agenda.tanggal_kedatangan);
        if (tgl.getDate() === date.getDate() && 
            tgl.getMonth() === date.getMonth() && 
            tgl.getFullYear() === date.getFullYear()) {
            return true;
        }
    }
    
    // Cek tanggal haul (sederhana)
    // Implementasi lebih lanjut...
    return false;
}

// ===== GLOBAL FUNCTIONS =====
let currentViewMonth = new Date().getMonth();
let currentViewYear = new Date().getFullYear();

window.changeMonth = function(delta) {
    currentViewMonth += delta;
    if (currentViewMonth > 11) {
        currentViewMonth = 0;
        currentViewYear++;
    } else if (currentViewMonth < 0) {
        currentViewMonth = 11;
        currentViewYear--;
    }
    renderKalenderRefresh();
};

window.showDayInfo = function(year, month, day) {
    const date = new Date(year, month, day);
    const pasaran = getPasaran(date);
    const hijri = gregorianToHijri(date);
    const dayName = date.toLocaleDateString('id-ID', { weekday: 'long' });
    
    alert(`
📅 ${dayName}, ${day} ${getMonthName(month)} ${year}
📆 ${hijri.day} ${hijri.month} ${hijri.year} H
☯️ Pasaran: ${pasaran}
${date.getDay() === 5 && pasaran === 'Pahing' ? '⭐ Jumat Pahing - Hari Iuran' : ''}
    `);
};

function renderKalenderRefresh() {
    const user = JSON.parse(localStorage.getItem('harum_session') || '{}');
    const isAdminUser = user.role === 'admin';
    const container = document.querySelector('#content-area');
    if (container) {
        container.innerHTML = renderKalender({ user, isAdmin: isAdminUser });
    }
}

// Load acara mendatang
setTimeout(() => {
    const container = document.getElementById('acara-mendatang');
    if (container) {
        const agenda = getData(DATA_KEYS.AGENDA_PUTRI) || {};
        const haul = getData(DATA_KEYS.HAUL) || {};
        const pengumuman = getData(DATA_KEYS.PENGUMUMAN) || [];
        
        let events = [];
        
        if (agenda.tanggal_kedatangan) {
            events.push({
                title: 'Kedatangan Putri Syaikhuna',
                date: agenda.tanggal_kedatangan,
                desc: 'Persiapan penyambutan',
            });
        }
        
        if (haul.tanggal) {
            events.push({
                title: 'Haul Akbar Syaikhuna',
                date: haul.tanggal,
                desc: haul.tema || '',
            });
        }
        
        if (events.length === 0) {
            container.innerHTML = '<p style="color: var(--text-light);">Belum ada acara mendatang.</p>';
        } else {
            container.innerHTML = events.map(e => `
                <div style="padding: 10px 0; border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <strong>${e.title}</strong>
                        <p style="margin: 4px 0 0; font-size: 13px; color: var(--text-light);">${e.desc}</p>
                    </div>
                    <span style="background: var(--secondary-light); padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600;">
                        ${e.date}
                    </span>
                </div>
            `).join('');
        }
    }
}, 100);