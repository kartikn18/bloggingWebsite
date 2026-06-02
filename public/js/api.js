const TOKEN_KEY = 'accesstoken';
const USER_KEY = 'user';

function getToken() {
  const token = localStorage.getItem(TOKEN_KEY);
  if (!token || token === 'null' || token === 'undefined') {
    return null;
  }
  return token;
}

function setSession(accesstoken, user) {
  if (!accesstoken) {
    return false;
  }
  localStorage.setItem(TOKEN_KEY, accesstoken);
  if (user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }
  return true;
}

function getUser() {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

function requireAuth() {
  if (!getToken()) {
    window.location.href = '/login-page';
    return false;
  }
  return true;
}

function bearerHeader() {
  const token = getToken();
  if (!token) return null;
  return { Authorization: `Bearer ${token}` };
}

function authHeaders(json = true) {
  const bearer = bearerHeader();
  if (!bearer) return null;
  const headers = { ...bearer };
  if (json) {
    headers['Content-Type'] = 'application/json';
  }
  return headers;
}

async function apiJson(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    credentials: 'same-origin',
  });
  const data = await response.json().catch(() => ({}));
  return { response, data };
}

function logout() {
  clearSession();
  window.location.href = '/login-page';
}

function formatDate(value) {
  if (!value) return 'Just now';
  return new Date(value).toLocaleString();
}
