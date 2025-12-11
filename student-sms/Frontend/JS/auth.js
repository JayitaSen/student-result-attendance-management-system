async function login(email, password) {
  const res = await fetch('http://localhost:3000/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Login failed');
  localStorage.setItem('token', data.token);
  localStorage.setItem('userName', data.name);
  localStorage.setItem('userRole', data.role);
  window.location.href = 'index.html';
}

function requireAuth() {
  const t = localStorage.getItem('token');
  if (!t) window.location.href = 'login.html';
}
function logout() {
  localStorage.clear();
  window.location.href = 'login.html';
}

export { login, requireAuth, logout };