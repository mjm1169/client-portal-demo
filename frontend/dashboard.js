// dashboard.js
import { getUser, logout } from './auth.js';

console.log("dashboard loaded");


// Make function available to HTML onclick
window.openHierarchy = openHierarchy;


// ---------------- INIT ----------------
document.addEventListener("DOMContentLoaded", async () => {

  const user = await getUser();
  if (!user) return;

  console.log("👤 User:", user.email);

  const el = document.getElementById("user-email");
  if (el) {
    el.innerText = user.email;
  }

  renderDatasets(user.datasets);
});


// ---------------- OPEN HIERARCHY ----------------
function openHierarchy() {

  // Optional: choose default dataset if needed
  const defaultDs = "data1";

  sessionStorage.setItem("pendingDataset", `#ds=${defaultDs}`);

  window.location.href = `/hierarchy.html#ds=${defaultDs}`;
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

  sessionStorage.setItem("pendingDataset", `#ds=${name}`);

  window.location.href = `/hierarchy.html#ds=${name}`;
}
