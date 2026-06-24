// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyAnVJfyb7qv2ekQGrxvWF6Jj4rMdmXb-UY",
  authDomain: "harum-app.firebaseapp.com",
  databaseURL: "https://harum-app-default-rtdb.firebaseio.com",
  projectId: "harum-app",
  storageBucket: "harum-app.firebasestorage.app",
  messagingSenderId: "962611577620",
  appId: "1:962611577620:web:ead2e21e23541af01ab801",
  measurementId: "G-3920D4E9HJ"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const database = firebase.database();

// Database References
const DB = {
    pengumuman: database.ref('pengumuman'),
    artikel: database.ref('artikel'),
    anggota: database.ref('anggota'),
    iuran: database.ref('iuran_jumat_pahing'),
    transaksi: database.ref('kas/transaksi'),
    haulInfo: database.ref('haul/info_acara'),
    donasi: database.ref('haul/donasi'),
    rombongan: database.ref('rombongan_malang'),
    kedatanganNyai: database.ref('kedatangan_nyai')
};

function formatDate(timestamp) {
    if (!timestamp) return '-';
    const date = new Date(timestamp);
    return date.toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    });
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(amount);
}

function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    const colors = {
        success: '#4caf50',
        error: '#f44336',
        info: '#2196f3'
    };
    toast.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: ${colors[type] || colors.info};
        color: white;
        padding: 12px 24px;
        border-radius: 8px;
        font-size: 14px;
        z-index: 999;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        max-width: 90%;
        text-align: center;
        animation: slideUp 0.3s ease;
    `;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.3s';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
  }
