// utils/auth.js - Authentication & RBAC

const STORAGE_KEY = 'harum_users';
const SESSION_KEY = 'harum_session';

// Default users
const DEFAULT_USERS = [
    {
        id: 'admin1',
        phone: '081234567890',
        password: 'admin123',
        name: 'Admin Utama',
        role: 'admin',
    },
    {
        id: 'user1',
        phone: '089876543210',
        password: 'user123',
        name: 'User Biasa',
        role: 'user',
    },
];

// ===== INIT =====
export function initAuth(phone, password) {
    const users = getUsers();
    const user = users.find(u => u.phone === phone && u.password === password);
    if (user) {
        // Store session
        const session = { userId: user.id, role: user.role, name: user.name, phone: user.phone };
        localStorage.setItem(SESSION_KEY, JSON.stringify(session));
        return session;
    }
    return null;
}

// ===== GET USERS =====
export function getUsers() {
    let users = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!users || users.length === 0) {
        users = DEFAULT_USERS;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
    }
    return users;
}

// ===== SAVE USERS =====
export function saveUsers(users) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
}

// ===== GET CURRENT USER =====
export function getCurrentUser() {
    const session = JSON.parse(localStorage.getItem(SESSION_KEY));
    if (!session) return null;
    const users = getUsers();
    const user = users.find(u => u.id === session.userId);
    if (!user) {
        localStorage.removeItem(SESSION_KEY);
        return null;
    }
    return { ...session };
}

// ===== IS ADMIN =====
export function isAdmin() {
    const user = getCurrentUser();
    return user && user.role === 'admin';
}

// ===== LOGOUT =====
export function logout() {
    localStorage.removeItem(SESSION_KEY);
}

// ===== ADD USER (admin only) =====
export function addUser(userData) {
    const users = getUsers();
    const newUser = {
        id: 'user_' + Date.now(),
        ...userData,
        role: userData.role || 'user',
    };
    users.push(newUser);
    saveUsers(users);
    return newUser;
}

// ===== DELETE USER (admin only) =====
export function deleteUser(userId) {
    let users = getUsers();
    users = users.filter(u => u.id !== userId);
    saveUsers(users);
}

// ===== UPDATE USER (admin only) =====
export function updateUser(userId, updates) {
    const users = getUsers();
    const index = users.findIndex(u => u.id === userId);
    if (index !== -1) {
        users[index] = { ...users[index], ...updates };
        saveUsers(users);
        return users[index];
    }
    return null;
}