function getUser() {
  return JSON.parse(localStorage.getItem("user"));
}

function getToken() {
  return localStorage.getItem("token");
}

function getRole() {
  return localStorage.getItem("role");
}

function logout() {
  localStorage.clear();
  window.location.href = "login.html";
}

function requireLogin() {
  if (!getToken()) {
    window.location.href = "login.html";
  }
}

function requireAdmin() {
  requireLogin();
  if (getRole() !== "admin") {
    window.location.href = "index.html";
  }
}