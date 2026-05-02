document.getElementById("verifyBtn").addEventListener("click", async () => {
  const inputs = document.querySelectorAll(".otp-digit");
  const email = localStorage.getItem("email");

  let otp = "";

  inputs.forEach(input => {
    otp += input.value;
  });

  if (otp.length !== 6) {
    alert("Enter full 6-digit OTP");
    return;
  }

  try {
    const res = await post("/auth/verify-otp", {
      email,
      otp
    });

    if (res.message === "Verified successfully") {
      alert("Verified!");
      window.location.href = "login.html";
    } else {
      alert(res.message || "Invalid OTP");
    }

  } catch (err) {
    console.error(err);
    alert("Server error");
  }
});
const inputs = document.querySelectorAll(".otp-digit");

inputs.forEach((input, index) => {
  input.addEventListener("input", () => {
    if (input.value && index < inputs.length - 1) {
      inputs[index + 1].focus();
    }
  });
});