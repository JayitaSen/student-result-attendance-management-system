const API_BASE = 'http://localhost:3000';

function token() { return localStorage.getItem('token') || ''; }

async function api(path, opts = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    ...opts,
    headers: {
      'Content-Type': 'application/json',
      ...(opts.headers || {}),
      Authorization: `Bearer ${token()}`
    }
  });
  if (!res.ok) throw new Error((await res.json()).message || 'Request failed');
  return res.json();
}

export { api };