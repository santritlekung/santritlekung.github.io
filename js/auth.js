// Authentication
let currentUser = null;
let currentUserData = null;
let isAdmin = false;

auth.onAuthStateChanged(async (user) => {
    if (user) {
        currentUser = user;
        await loadUserData(user.phoneNumber);
        showMainApp();
    } else {
        showLoginPage();
    }
});

function loadUserData(phoneNumber) {
    return new Promise((resolve) => {
        DB.anggota.child(phoneNumber).on('value', (snapshot) => {
            const data = snapshot.val();
            if (data) {
                currentUserData = data;
                isAdmin = data.role === 'admin';
                updateUIForUser();
            }
            resolve();
        });
    });
}

function showLoginPage() {
    document.getElementById('main-content').style.display = 'none';
    document.getElementById('loading-screen').style.display = 'none';
    
    let loginContainer = document.querySelector('.login-container');
    if (!loginContainer) {
        loginContainer = document.createElement('div');
        loginContainer.className = 'login-container';
        loginContainer.id = 'login-container';
        document.body.appendChild(loginContainer);
    }
    
    loginContainer.innerHTML = `
        <div class="login-card">
            <div class="login-logo">
                <img src="assets/logo.jpg" alt="HARUM">
                <h1>HARUM</h1>
                <p>Himpunan Alumni Roudlotul Ulum</p>
            </div>
            <form class="login-form" id="login-form">
                <div id="step-1">
                    <div class="form-group">
                        <label>Nomor HP</label>
                        <div class="input-group">
                            <span class="prefix">+62</span>
                            <input type="tel" id="phone-input" placeholder="81234567890" required>
                        </div>
                    </div>
                    <button type="submit" class="btn btn-primary" id="send-otp-btn">
                        Kirim OTP
                    </button>
                </div>
                <div id="step-2" style="display:none;">
                    <div class="form-group">
                        <label>Kode OTP</label>
                        <input type="text" id="otp-input" placeholder="123456" maxlength="6" required>
                        <p class="otp-hint">Kode verifikasi telah dikirim ke +62 <span id="otp-phone"></span></p>
                    </div>
                    <button type="submit" class="btn btn-primary" id="verify-otp-btn">
                        Verifikasi
                    </button>
                    <button type="button" class="back-link" onclick="goBackToPhone()">
                        ← Kembali
                    </button>
                </div>
            </form>
        </div>
    `;
    
    document.getElementById('login-form').addEventListener('submit', handleLoginSubmit);
}

function showMainApp() {
    const loginContainer = document.getElementById('login-container');
    if (loginContainer) loginContainer.remove();
    
    document.getElementById('main-content').style.display = 'flex';
    document.getElementById('loading-screen').style.display = 'none';
    document.body.style.overflow = 'hidden';
    
    navigateTo('home');
    startClock();
}

function handleLoginSubmit(e) {
    e.preventDefault();
    const step1 = document.getElementById('step-1');
    const step2 = document.getElementById('step-2');
    const phoneInput = document.getElementById('phone-input');
    const otpInput = document.getElementById('otp-input');
    const sendBtn = document.getElementById('send-otp-btn');
    const verifyBtn = document.getElementById('verify-otp-btn');
    
    if (step1.style.display !== 'none') {
        const phone = phoneInput.value.trim();
        if (!phone || phone.length < 10) {
            showToast('Masukkan nomor HP yang valid', 'error');
            return;
        }
        
        const fullNumber = `+62${phone}`;
        sendBtn.disabled = true;
        sendBtn.textContent = 'Mengirim...';
        
        const appVerifier = new firebase.auth.RecaptchaVerifier('send-otp-btn', {
            size: 'invisible'
        });
        
        auth.signInWithPhoneNumber(fullNumber, appVerifier)
            .then((confirmationResult) => {
                window.confirmationResult = confirmationResult;
                step1.style.display = 'none';
                step2.style.display = 'block';
                document.getElementById('otp-phone').textContent = phone;
                showToast('Kode OTP telah dikirim', 'success');
                sendBtn.disabled = false;
                sendBtn.textContent = 'Kirim OTP';
                otpInput.focus();
            })
            .catch((error) => {
                showToast(error.message, 'error');
                sendBtn.disabled = false;
                sendBtn.textContent = 'Kirim OTP';
            });
    } else {
        const code = otpInput.value.trim();
        if (!code || code.length < 6) {
            showToast('Masukkan kode OTP yang valid', 'error');
            return;
        }
        
        verifyBtn.disabled = true;
        verifyBtn.textContent = 'Memverifikasi...';
        
        window.confirmationResult.confirm(code)
            .then(() => {
                showToast('Login berhasil!', 'success');
                verifyBtn.disabled = false;
                verifyBtn.textContent = 'Verifikasi';
            })
            .catch((error) => {
                showToast('Kode OTP tidak valid', 'error');
                verifyBtn.disabled = false;
                verifyBtn.textContent = 'Verifikasi';
            });
    }
}

function goBackToPhone() {
    document.getElementById('step-1').style.display = 'block';
    document.getElementById('step-2').style.display = 'none';
    document.getElementById('phone-input').focus();
}

function logoutUser() {
    if (confirm('Apakah Anda yakin ingin logout?')) {
        auth.signOut().then(() => {
            showToast('Logout berhasil', 'success');
            closeSidebar();
        });
    }
}

function updateUIForUser() {
    const userInfo = document.getElementById('user-info-sidebar');
    if (userInfo && currentUserData) {
        userInfo.innerHTML = `
            <div style="font-weight:600;font-size:15px;">${currentUserData.nama || 'Anggota'}</div>
            <div style="font-size:12px;opacity:0.7;">${currentUserData.role === 'admin' ? '👑 Admin' : '👤 Anggota'}</div>
        `;
    }
    
    const adminMenu = document.getElementById('admin-menu');
    if (adminMenu) {
        adminMenu.style.display = isAdmin ? 'block' : 'none';
    }
}