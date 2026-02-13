// dashboard.js
console.log("dashboard.js loaded");

//const token = localStorage.getItem("token");

// If not logged in → back to login
if (!localStorage.getItem("token")) {
  window.location.href = "index.html";
}

function openHierarchy() {
  window.location.href = "hierarchy.html";
}

async function loadUser() {
  console.log("loadUser() started");
  if (!localStorage.getItem("token")) {
    window.location.href = "index.html";
    return;
  }
  console.log("Token:", localStorage.getItem("token"));
  

  const res = await fetch("http://127.0.0.1:8000/me", {
    headers: authHeaders()
  });
  
  console.log("ME response:", res.status);

  if (!res.ok) {
    localStorage.clear();
    window.location.href = "index.html";
    return;
  }

  const user = await res.json();

  const el = document.getElementById("user-email");

  if (el) {
    el.innerText = "Logged in as: " + user.email;
  }  
}

document.addEventListener("DOMContentLoaded", () => {
  loadUser();
});
