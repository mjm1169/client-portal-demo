// dashboard.js (Azure Auth version)

console.log("dashboard.js loaded (Azure auth)");

/*async function checkAuth() {
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
    
    // Call secure backend
    fetch("/api/me")
    .then(r => r.json())
    .then(apiUser => {
      console.log("API user:", apiUser);
    });

    const el = document.getElementById("user-email");
    if (el) {
      el.innerText = "Logged in as: " + email;
    }

  } catch (err) {
    console.error("Auth check failed:", err);
    window.location.href = "/.auth/login/aad";
  }
}*/
async function loadUserData() {

  const res = await fetch('/api/me');

  if (!res.ok) {
    window.location.href = '/.auth/login/aad';
    return;
  }

  const user = await res.json();

  console.log("User access:", user);

  renderDatasets(user.datasets);
}

function renderDatasets(datasets) {

  const container = document.getElementById("dataset-list");
  container.innerHTML = "";

  datasets.forEach(ds => {

    const btn = document.createElement("button");
    btn.innerText = ds;

    btn.onclick = () => openDataset(ds);

    container.appendChild(btn);
  });
}

function openHierarchy() {
  window.location.href = "hierarchy.html";
}

document.addEventListener("DOMContentLoaded", checkAuth);
