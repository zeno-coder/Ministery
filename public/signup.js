document.getElementById("signupBtn").addEventListener("click", async () => {
  const email = document.getElementById("email").value;
  const phone = document.getElementById("phone").value;
  const password = document.getElementById("password").value;

  if (!email || !phone || !password)
    return alert("Fill all fields");

  try {
    const res = await post("/auth/signup", {
      email,
      phone,
      password
    });

    if (res.message === "OTP sent to email") {
      localStorage.setItem("email", email);
      window.location.href = "otp.html";
    } else {
      alert(res.message || "Signup failed");
    }
  } catch (err) {
    alert("Server error");
  }
});