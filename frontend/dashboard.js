// dashboard.js
import { getUser, logout } from "./auth.js";

console.log("dashboard loaded");

let currentUser = null;


// ---------------- INIT ----------------
document.addEventListener("DOMContentLoaded", initDashboard);


async function initDashboard() {

  if (window.location.hash) {
    history.replaceState(
      null,
      "",
      window.location.pathname
    );
  }

  const user = await getUser();
  if (!user) return;

  currentUser = user;

  console.log("👤 User:", user.email);

  const el = document.getElementById("user-email");
  if (el) {
    el.innerText = user.email;
  }

  renderDatasets(user.datasets);
  renderProducts(user.pages);
}


// ---------------- ROUTER ----------------
function navigate(page) {

  switch (page) {

    case "hierarchy":
      openHierarchy();
      break;

    case "reports":
      window.location.href = "/reports.html#client=client2";
      break;

    case "training":
      window.location.href = "/training.html";
      break;

    default:
      console.warn("Unknown page:", page);
  }
}


// ---------------- OPEN HIERARCHY ----------------
function openHierarchy() {

  const defaultDs = "data1";

  sessionStorage.setItem(
    "pendingDataset",
    `#ds=${defaultDs}`
  );

  window.location.assign(
    `/hierarchy.html#ds=${defaultDs}`
  );
}


// ---------------- RENDER DATASETS ----------------
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

  sessionStorage.setItem(
    "pendingDataset",
    `#ds=${name}`
  );

  window.location.href =
    `/hierarchy.html#ds=${name}`;
}


// ---------------- RENDER PRODUCTS ----------------
function renderProducts(pages) {

  const cards = document.querySelectorAll(".card");

  cards.forEach(card => {

    const target = card.dataset.page;

    if (!target) return;

    if (!pages.includes(target)) {

      card.classList.add("disabled");

      card.onclick = () => openNoAccess(target);

    } else {

      card.onclick = () => navigate(target);
    }
  });
}


// ---------------- NO ACCESS ----------------
function openNoAccess(page) {

  window.location.href =
    `/no-access.html?page=${page}`;
}
