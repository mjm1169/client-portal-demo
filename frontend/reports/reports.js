// reports/reports.js

import { animatedBar } from "./blocks/animatedBar.js";
import { tooltipScatter } from "./blocks/tooltipScatter.js";
import { filterableLine } from "./blocks/filterableLine.js";
import { kpiTiles } from "./blocks/kpiTiles.js";
import { progressGauge } from "./blocks/progressGauge.js";


// ---------------- BLOCK REGISTRY ----------------
// Maps config "type" → JS module

const BLOCKS = {
  bar: animatedBar,
  scatter: tooltipScatter,
  line: filterableLine,
  kpi: kpiTiles,
  gauge: progressGauge
};


// ---------------- AUTH ----------------
async function getUser() {

  const res = await fetch("/api/me");

  if (!res.ok) {
    window.location.href = "/.auth/login/aad";
    return null;
  }

  return await res.json();
}


// ---------------- LOAD REPORT CONFIG ----------------
async function loadReportConfig(reportId) {

  const res = await fetch(`/reports/config/${reportId}.json`);

  if (!res.ok) {
    throw new Error("Report config not found");
  }

  return await res.json();
}


// ---------------- LOAD DATA ----------------
async function loadData(source) {

  const res = await fetch(source);

  if (!res.ok) {
    throw new Error("Data source failed");
  }

  return await res.json();
}


// ---------------- RENDER BLOCK ----------------
async function renderBlock(block, container) {

  const blockFn = BLOCKS[block.type];

  if (!blockFn) {
    console.error("Unknown block:", block.type);
    return;
  }

  let data = [];

  if (block.data) {
    data = await loadData(block.data);
  }

  blockFn(container, data, block.options || {});
}


// ---------------- RENDER PAGE ----------------
async function renderPage(page) {

  const container = document.getElementById("report-content");
  container.innerHTML = "";

  for (const block of page.blocks) {

    const div = document.createElement("div");

    div.className = "report-block";
    div.style.marginBottom = "40px";

    container.appendChild(div);

    await renderBlock(block, div);
  }
}


// ---------------- NAV ----------------
function buildNav(pages) {

  const nav = document.getElementById("report-nav");

  pages.forEach((page, index) => {

    const btn = document.createElement("button");

    btn.innerText = page.title;
    btn.className = "nav-btn";

    btn.onclick = () => renderPage(page);

    if (index === 0) {
      btn.classList.add("active");
    }

    nav.appendChild(btn);
  });
}


// ---------------- ACCESS CONTROL ----------------
function checkAccess(user, reportId) {

  if (!user.pages.includes(`report-${reportId}`)) {
    window.location.href = "/no-access.html";
    return false;
  }

  return true;
}


// ---------------- INIT ----------------
async function init() {

  try {

    const params = new URLSearchParams(window.location.search);

    const reportId = params.get("id");

    if (!reportId) {
      throw new Error("Missing report id");
    }

    const user = await getUser();
    if (!user) return;

    if (!checkAccess(user, reportId)) return;

    const config = await loadReportConfig(reportId);

    document.getElementById("report-title").innerText =
      config.title;

    buildNav(config.pages);

    renderPage(config.pages[0]);

  } catch (err) {

    console.error(err);

    document.getElementById("report-content")
      .innerText = "Failed to load report.";
  }
}


document.addEventListener("DOMContentLoaded", init);
