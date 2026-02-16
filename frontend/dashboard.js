// dashboard.js (Azure Auth version)

console.log("dashboard.js loaded (Azure auth)");

async function loadUserData() {

  const res = await fetch('/api/me');

  if (!res.ok) {
    window.location.href = '/.auth/login/aad';
    return;
  }

  const user = await res.json();

  document.getElementById("user-email").innerText =
    "Signed in as: " + user.email;

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

  // Default dataset (for now)
  const ds = "data1";

  sessionStorage.setItem("pendingDataset", `#ds=${ds}`);

  window.location.href = `hierarchy.html#ds=${ds}`;
}

document.addEventListener("DOMContentLoaded", checkAuth);
