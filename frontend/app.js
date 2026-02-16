console.log("app.js loaded");
console.log("👤 User:", user.email);
console.log("🔐 Datasets:", user.datasets)

// ---------------- LOGOUT ----------------
function logout() {
  window.location.href = "/.auth/logout";
}


// ---------------- INIT ----------------
async function initApp() {

  // Restore dataset after login redirect
  const saved = sessionStorage.getItem("pendingDataset");

  if (saved && !window.location.hash) {
    sessionStorage.removeItem("pendingDataset");
    window.location.hash = saved;
    return; // reload with hash
  }

  // Save dataset before auth redirect
  if (window.location.hash) {
    sessionStorage.setItem("pendingDataset", window.location.hash);
  }

  const res = await fetch('/api/me');

  if (!res.ok) {
    window.location.href = "/.auth/login/aad";
    return;
  }

  const user = await res.json();

  console.log("User access:", user);

  // Show email
  const el = document.getElementById("user-email");
  if (el) {
    el.innerText = user.email;
  }

  renderDatasets(user.datasets);
  renderProducts(user.pages);
}

// ---------------- RENDER ----------------
function renderDatasets(datasets) {

  const container = document.getElementById("dataset-list");

  if (!container) return;

  container.innerHTML = "";

  if (!datasets.length) {
    container.innerText = "No datasets assigned.";
    return;
  }

  datasets.forEach(ds => {

    const btn = document.createElement("button");
    btn.innerText = ds;

    btn.onclick = () => openDataset(ds);

    container.appendChild(btn);
  });
}


// ---------------- OPEN DATASET ----------------
function openDataset(name) {

  // Save before redirect
  sessionStorage.setItem("pendingDataset", `#ds=${name}`);

  window.location.href = `/hierarchy.html#ds=${name}`;
}

document.addEventListener("DOMContentLoaded", initApp);
