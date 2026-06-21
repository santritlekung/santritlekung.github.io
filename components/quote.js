// components/quote.js - Widget Quote Ayat Al-Qur'an

import { getData, DATA_KEYS } from '../utils/storage.js';

let quoteInterval = null;
let currentQuoteIndex = 0;

export function renderQuote({ user, isAdmin }) {
    const quotes = getData(DATA_KEYS.QUOTES) || [];
    
    if (quotes.length === 0) {
        return `
            <div class="page-container">
                <div class="card">
                    <div class="card-title">
                        <i class="fas fa-quote-right"></i> Quote Ayat Al-Qur'an
                    </div>
                    <div class="quote-widget">
                        <p style="color: var(--text-light);">Belum ada quote yang tersedia.</p>
                    </div>
                </div>
            </div>
        `;
    }
    
    // Get random quote
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quote = quotes[randomIndex];
    currentQuoteIndex = randomIndex;
    
    return `
        <div class="page-container">
            <div class="card">
                <div class="card-title">
                    <i class="fas fa-quote-right"></i> Quote Ayat Al-Qur'an
                    <span style="font-size: 14px; font-weight: 400; color: var(--text-light); margin-left: 8px;">
                        <i class="fas fa-sync-alt" onclick="changeQuote()" style="cursor: pointer;"></i>
                    </span>
                </div>
                
                <div id="quote-display" class="quote-widget">
                    <div class="arabic">${quote.arabic || ''}</div>
                    <div class="translation">"${quote.translation || ''}"</div>
                    <div class="source">— ${quote.source || 'Al-Qur\'an'}</div>
                    
                    <div style="margin-top: 16px; display: flex; gap: 8px; justify-content: center; flex-wrap: wrap;">
                        <button onclick="changeQuote(-1)" class="btn btn-outline btn-sm">
                            <i class="fas fa-chevron-left"></i>
                        </button>
                        <span style="font-size: 13px; color: var(--text-light); align-self: center;">
                            ${currentQuoteIndex + 1} / ${quotes.length}
                        </span>
                        <button onclick="changeQuote(1)" class="btn btn-outline btn-sm">
                            <i class="fas fa-chevron-right"></i>
                        </button>
                        <button onclick="toggleAutoQuote()" class="btn btn-sm ${quoteInterval ? 'btn-danger' : 'btn-primary'}" id="auto-toggle-btn">
                            ${quoteInterval ? '⏹ Stop' : '▶ Auto'}
                        </button>
                    </div>
                </div>
            </div>
            
            <!-- Daftar Semua Quote -->
            <div class="card">
                <div class="card-title">
                    <i class="fas fa-list"></i> Semua Quote
                </div>
                <div style="max-height: 300px; overflow-y: auto;">
                    ${quotes.map((q, index) => `
                        <div onclick="goToQuote(${index})" style="
                            padding: 10px 14px;
                            border-bottom: 1px solid var(--border);
                            cursor: pointer;
                            transition: background 0.2s;
                            ${index === currentQuoteIndex ? 'background: var(--secondary-light);' : ''}
                        " onmouseover="this.style.background='var(--secondary-light)'" onmouseout="this.style.background='${index === currentQuoteIndex ? 'var(--secondary-light)' : 'transparent'}'">
                            <div style="font-family: var(--font-arabic); font-size: 14px;">${q.arabic || ''}</div>
                            <div style="font-size: 13px; color: var(--text-light);">${q.translation || ''}</div>
                            <small style="color: var(--secondary);">${q.source || ''}</small>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
}

// ===== GLOBAL FUNCTIONS =====
window.changeQuote = function(direction = 0) {
    const quotes = getData(DATA_KEYS.QUOTES) || [];
    if (quotes.length === 0) return;
    
    if (direction === 0) {
        // Random
        currentQuoteIndex = Math.floor(Math.random() * quotes.length);
    } else {
        currentQuoteIndex = (currentQuoteIndex + direction + quotes.length) % quotes.length;
    }
    
    updateQuoteDisplay(quotes[currentQuoteIndex], quotes.length);
};

window.goToQuote = function(index) {
    const quotes = getData(DATA_KEYS.QUOTES) || [];
    if (index >= 0 && index < quotes.length) {
        currentQuoteIndex = index;
        updateQuoteDisplay(quotes[index], quotes.length);
    }
};

window.toggleAutoQuote = function() {
    if (quoteInterval) {
        clearInterval(quoteInterval);
        quoteInterval = null;
        const btn = document.getElementById('auto-toggle-btn');
        if (btn) {
            btn.innerHTML = '▶ Auto';
            btn.className = 'btn btn-sm btn-primary';
        }
    } else {
        quoteInterval = setInterval(() => {
            window.changeQuote(1);
        }, 5000); // Change every 5 seconds
        const btn = document.getElementById('auto-toggle-btn');
        if (btn) {
            btn.innerHTML = '⏹ Stop';
            btn.className = 'btn btn-sm btn-danger';
        }
    }
};

function updateQuoteDisplay(quote, total) {
    const display = document.getElementById('quote-display');
    if (display) {
        display.innerHTML = `
            <div class="arabic">${quote.arabic || ''}</div>
            <div class="translation">"${quote.translation || ''}"</div>
            <div class="source">— ${quote.source || 'Al-Qur\'an'}</div>
            
            <div style="margin-top: 16px; display: flex; gap: 8px; justify-content: center; flex-wrap: wrap;">
                <button onclick="changeQuote(-1)" class="btn btn-outline btn-sm">
                    <i class="fas fa-chevron-left"></i>
                </button>
                <span style="font-size: 13px; color: var(--text-light); align-self: center;">
                    ${currentQuoteIndex + 1} / ${total}
                </span>
                <button onclick="changeQuote(1)" class="btn btn-outline btn-sm">
                    <i class="fas fa-chevron-right"></i>
                </button>
                <button onclick="toggleAutoQuote()" class="btn btn-sm ${quoteInterval ? 'btn-danger' : 'btn-primary'}" id="auto-toggle-btn">
                    ${quoteInterval ? '⏹ Stop' : '▶ Auto'}
                </button>
            </div>
        `;
    }
}

// Cleanup interval when page changes
window.addEventListener('pagechange', () => {
    if (quoteInterval) {
        clearInterval(quoteInterval);
        quoteInterval = null;
    }
});