// reports.js
import { getUser } from "./auth.js";


document.addEventListener("DOMContentLoaded", initReports);


// ================================
// MAIN ENTRY
// ================================
async function initReports() {

  console.log("📊 reports.js loaded");

  // 0. Get client from URL
  const client = getClientFromHash();

  if (!client) {
    showError("No report client specified.");
    return;
  }

  console.log("➡️ Loading report for:", client);


  // 1. Get logged-in user
  const user = await getUser();

  if (!user) return;

  console.log("👤 User:", user.email);


  // 2. Check page access
  if (!user.pages || !user.pages.includes("reports")) {
    showError("You do not have access to Reports.");
    return;
  }


  // 3. (Optional) Check client-level access
  if (user.reports && !user.reports.includes(client)) {
    showError("You are not authorised for this client report.");
    return;
  }


  // 4. Load report config
  const report = await loadReportConfig(client);

  if (!report) return;


  // 5. Render report
  renderReport(report);
}



// ================================
// URL HANDLING
// ================================
function getClientFromHash() {

  const hash = window.location.hash.substring(1);

  if (!hash) return null;

  const params = new URLSearchParams(hash);

  return params.get("client");
}



// ================================
// LOAD REPORT CONFIG
// ================================
async function loadReportConfig(client) {

  try {

    const res = await fetch(`/reports/${client}.json`);

    if (!res.ok) {
      showError("Report configuration not found.");
      return null;
    }

    const data = await res.json();

    console.log("📄 Report config:", data);

    return data;

  } catch (err) {

    console.error(err);

    showError("Failed to load report configuration.");

    return null;
  }
}



// ================================
// RENDER REPORT
// ================================
async function renderReport(report) {

  const root = document.getElementById("report-root");

  if (!root) {
    console.error("Missing #report-root container");
    return;
  }

  // Clear previous
  root.innerHTML = "";


  // Title
  if (report.title) {

    const h1 = document.createElement("h1");
    h1.innerText = report.title;

    root.appendChild(h1);
  }


  // Description
  if (report.description) {

    const p = document.createElement("p");
    p.innerText = report.description;
    p.className = "report-description";

    root.appendChild(p);
  }


  // Blocks container
  const container = document.createElement("div");
  container.className = "report-blocks";

  root.appendChild(container);


  // Load each block
  for (const block of report.blocks) {

    await renderBlock(container, block);
  }

}



// ================================
// RENDER INDIVIDUAL BLOCK
// ================================
async function renderBlock(container, block) {

  const blockEl = document.createElement("div");

  blockEl.className = "report-block";

  container.appendChild(blockEl);


  try {

    console.log("📦 Loading block:", block.type);

    const module = await import(`/blocks/${block.type}.js`);


    if (!module.render) {
      throw new Error("Block missing render() function");
    }


    await module.render(blockEl, block);


  } catch (err) {

    console.error("Block load error:", err);

    blockEl.innerHTML = `
      <div class="block-error">
        Failed to load block: ${block.type}
      </div>
    `;
  }
}



// ================================
// ERROR HANDLING
// ================================
function showError(msg) {

  console.error("❌", msg);

  const root = document.getElementById("report-root");

  if (!root) return;

  root.innerHTML = `
    <div class="report-error">
      ${msg}
    </div>
  `;
}
