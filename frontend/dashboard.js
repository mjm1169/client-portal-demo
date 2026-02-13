// dashboard.js (Azure Auth version)

console.log("dashboard.js loaded (Azure auth)");

async function checkAuth() {
  try {
    const res = await fetch('/.auth/me');
    const data = await res.json();

    console.log("Auth data:", data);

    // Not logged in → go to Microsoft login
    if (!data.clientPrincipal) {
      window.location.href = "/.auth/login/aad";
      return;
    }

    // Logged in → show user info
    const email = data.clientPrincipal.userDetails;

    const el = document.getElementById("user-email");
    if (el) {
      el.innerText = "Logged in as: " + email;
    }

  } catch (err) {
    console.error("Auth check failed:", err);
    window.location.href = "/.auth/login/aad";
  }
}

function openHierarchy() {
  window.location.href = "hierarchy.html";
}

document.addEventListener("DOMContentLoaded", checkAuth);
