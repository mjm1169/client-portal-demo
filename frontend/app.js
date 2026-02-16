console.log("app.js loaded");


// ---------------- LOGOUT ----------------
function logout() {
  window.location.href = "/.auth/logout";
}


// ---------------- INIT ----------------
async function initApp() {

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
  window.location.href = `hierarchy.html?ds=${name}`;
}


document.addEventListener("DOMContentLoaded", initApp);
