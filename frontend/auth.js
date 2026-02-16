// auth.js

let cachedUser = null;

// Get logged-in user
export async function getUser() {

  if (cachedUser) return cachedUser;

  // Restore dataset after login
  const saved = sessionStorage.getItem("pendingDataset");

  if (saved && !window.location.hash) {
    sessionStorage.removeItem("pendingDataset");
    window.location.hash = saved;
    return null;
  }

  if (window.location.hash) {
    sessionStorage.setItem("pendingDataset", window.location.hash);
  }

  const res = await fetch('/api/me');

  if (!res.ok) {
    window.location.href = "/.auth/login/aad";
    return null;
  }

  cachedUser = await res.json();
  return cachedUser;
}


// Logout
export function logout() {
  window.location.href = "/.auth/logout";
}
