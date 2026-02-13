const API_URL = "http://127.0.0.1:8000";
console.log("app.js loaded");
function getToken() {
  return localStorage.getItem("token");
}

// -------------------- LOGIN --------------------
async function login() {

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
  
    const msg = document.getElementById("login-msg");
  
    try {
  
      const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email,
          password
        })
      });
  
      const data = await res.json();
  
      if (!res.ok) {
        msg.innerText = data.detail || "Login failed";
        return;
      }
  
      // Save JWT
      localStorage.setItem("token", data.access_token);
  
      // Go to dashboard
      window.location.href = "dashboard.html";
  
    } catch (err) {
      console.error(err);
      msg.innerText = "Server error";
    }
  }
  
// ---------------- AUTH HEADERS ----------------
function authHeaders() {
  return {
    Authorization: "Bearer " + localStorage.getItem("token")
  };
}

// ---------------- LOGOUT ----------------
function logout() {
  localStorage.removeItem("token");
  window.location.href = "index.html";
}

// ---------------- OPEN CHART ----------------
function openHierarchy() {
  window.location.href = "chart.html";
}

// -------------------- UI --------------------
function showApp() {

  document.getElementById("login-box").style.display = "none";
  document.getElementById("app-box").style.display = "block";
}

// -------------------- NEW AZURE AUTH --------------------
async function getUser() {
  const res = await fetch('/.auth/me');
  const data = await res.json();
  return data;
}

getUser().then(user => {
  console.log(user);
});