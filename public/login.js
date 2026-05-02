document.getElementById("loginBtn").addEventListener("click", async () => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  if (!email || !password) return alert("Fill all fields");

  try {
    const res = await post("/auth/login", { email, password });

    if (!res.token) return alert(res.message || "Login failed");

    // store session properly
    localStorage.setItem("token", res.token);
    localStorage.setItem("user", JSON.stringify(res.user));
    localStorage.setItem("role", res.user.role);

    // 👉 ROLE BASED REDIRECT (BEST PRACTICE)
if (res.token) {
  localStorage.setItem("token", res.token);
  localStorage.setItem("user", JSON.stringify(res.user));

  const role = res.user.role;

  if (role === "admin") {
    window.location.href = "admin.html";
  } else {
    window.location.href = "index.html";
  }
}

  } catch (err) {
    alert("Server error");
  }
});