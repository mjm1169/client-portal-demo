// dashboard.js
import { getUser, logout } from "./auth.js";

console.log("dashboard loaded");

let currentUser = null;


// ---------------- INIT ----------------
document.addEventListener("DOMContentLoaded", initDashboard);


async function initDashboard() {

  if (window.location.hash) {
    history.replaceState(null, "", window.location.pathname);
  }

  const user = await getUser();
  if (!user) return;

  currentUser = user;

  console.log("👤 User:", user.email);

  const el = document.getElementById("user-email");
  if (el) {
    el.innerText = user.email;
  }

  renderProducts(user.pages);
}


// ---------------- ROUTER ----------------
function navigate(page) {

  switch (page) {

    case "hierarchy":
      openHierarchy();
      break;

    case "reports":
      openReports();
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

  window.location.href =
    `/hierarchy.html#ds=${defaultDs}`;
}


// ---------------- OPEN REPORTS ----------------
function openReports() {

  if (!currentUser?.reports?.length) {
    alert("No reports assigned.");
    return;
  }

  // If only one → open directly
  if (currentUser.reports.length === 1) {

    const client = currentUser.reports[0];

    window.location.href =
      `/reports.html#client=${client}`;

    return;
  }

  // Future: report selector
  console.log("Multiple reports:", currentUser.reports);
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
