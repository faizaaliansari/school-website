// Static demo credentials
const USERS = {
  'admin':   { password: 'admin123',   role: 'Admin',   name: 'Administrator' },
  'teacher': { password: 'teacher123', role: 'Teacher', name: 'Teacher User' },
  'principal': { password: 'principle123', role: 'Admin', name: 'Principal Sir' }
};

document.getElementById('loginForm').addEventListener('submit', e => {
  e.preventDefault();
  const username = document.getElementById('username').value.trim().toLowerCase();
  const password = document.getElementById('password').value;

  const user = USERS[username];
  if (user && user.password === password) {
    localStorage.setItem('schoolUser', JSON.stringify({
      username, role: user.role, name: user.name
    }));
    window.location.href = 'dashboard.html';
  } else {
    alert('❌ Invalid username or password!\n\nTry:\nadmin / admin123\nteacher / teacher123');
  }
});
