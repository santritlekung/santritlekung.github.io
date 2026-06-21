// Daftar user (hardcoded untuk demo)
const USERS = [
    { phone: '08123456789', name: 'Admin Utama', role: 'admin' },
    { phone: '08123456788', name: 'User Biasa', role: 'user' }
];

let currentUser = null;

function login(phone) {
    const user = USERS.find(u => u.phone === phone);
    if (user) {
        currentUser = user;
        localStorage.setItem('harum_currentUser', JSON.stringify(user));
        return true;
    }
    return false;
}

function logout() {
    currentUser = null;
    localStorage.removeItem('harum_currentUser');
}

function getCurrentUser() {
    if (!currentUser) {
        const stored = localStorage.getItem('harum_currentUser');
        if (stored) {
            currentUser = JSON.parse(stored);
        }
    }
    return currentUser;
}

function isAdmin() {
    const u = getCurrentUser();
    return u && u.role === 'admin';
}

function isUser() {
    const u = getCurrentUser();
    return u && u.role === 'user';
}