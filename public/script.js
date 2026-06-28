const API = "/api";
document.addEventListener("DOMContentLoaded", () => {const loginBtn = document.getElementById("loginBtn");const signupBtn = document.getElementById("signupBtn");if (loginBtn) {loginBtn.addEventListener("click", () => {window.location.href = "/login.html";});}if (signupBtn) {signupBtn.addEventListener("click", () => {window.location.href = "/signup.html";});}});
function getToken() {
  return localStorage.getItem("token"); 
}

function isLoggedIn() {
  return !!getToken();
}

function requireLogin() {
  if (!isLoggedIn()) {
    window.location.href = "/login.html?redirect=donate";
    return false;
  }
  return true;
}
window.addEventListener("load", () => {
  const loader = document.getElementById("pageLoader");
  if (!loader) return;
  setTimeout(() => {
    loader.classList.add("fade-out");
    setTimeout(() => loader.remove(), 800);
  }, 1200);
});

(function initParticles() {
  const canvas = document.getElementById("particleCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  let W, H;
  function resize() { W = canvas.width = innerWidth; H = canvas.height = innerHeight; }
  resize();
  window.addEventListener("resize", resize);
  class P {
    reset() {
      this.x     = Math.random() * W;
      this.y     = Math.random() * H;
      this.r     = Math.random() * 1.5 + 0.3;
      this.speed = Math.random() * 0.3 + 0.1;
      this.alpha = Math.random() * 0.4 + 0.1;
      this.drift = (Math.random() - 0.5) * 0.2;
    }
    constructor() { this.reset(); }
    update() {
      this.y     -= this.speed;
      this.x     += this.drift;
      this.alpha -= 0.001;
      if (this.y < -10 || this.alpha <= 0) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(201,168,76,${this.alpha})`;
      ctx.fill();
    }
  }

  const particles = Array.from({ length: 80 }, () => new P());
  function animate() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animate);
  }
  animate();
})();
const navbar = document.getElementById("navbar");
if (navbar) {
  window.addEventListener("scroll", () =>
    navbar.classList.toggle("scrolled", scrollY > 60)
  );
}
const hamburger = document.getElementById("hamburger");
const mainNav   = document.getElementById("mainNav");
if (hamburger && mainNav) {
  hamburger.addEventListener("click", () => {
    mainNav.classList.toggle("open");
    const s = hamburger.querySelectorAll("span");
    if (mainNav.classList.contains("open")) {
      s[0].style.transform = "rotate(45deg) translate(5px,5px)";
      s[1].style.opacity   = "0";
      s[2].style.transform = "rotate(-45deg) translate(5px,-5px)";
    } else {
      s.forEach(x => { x.style.transform = ""; x.style.opacity = ""; });
    }
  });

  mainNav.querySelectorAll("a").forEach(a =>
    a.addEventListener("click", () => {
      mainNav.classList.remove("open");
      hamburger.querySelectorAll("span").forEach(s => {
        s.style.transform = "";
        s.style.opacity   = "";
      });
    })
  );
}

function scrollToSection(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}
window.addEventListener("DOMContentLoaded", () => {
  const exploreBtn = document.getElementById("heroExploreBtn");
  const supportBtn = document.getElementById("heroSupportBtn");
  if (exploreBtn) exploreBtn.addEventListener("click", () => scrollToSection("ministries"));
  if (supportBtn) supportBtn.addEventListener("click", () => scrollToSection("donate"));
});

function animateCounter(el) {
  const target = parseInt(el.dataset.target);
  let cur = 0;
  const step = target / 125;
  const t = setInterval(() => {
    cur += step;
    if (cur >= target) { el.textContent = target; clearInterval(t); }
    else { el.textContent = Math.floor(cur); }
  }, 16);
}

document.querySelectorAll("[data-target]").forEach(el =>
  new IntersectionObserver(entries =>
    entries.forEach(e => { if (e.isIntersecting) animateCounter(e.target); }),
    { threshold: 0.5 }
  ).observe(el)
);

const revealObs = new IntersectionObserver(entries =>
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add("visible");
      revealObs.unobserve(e.target);
    }
  }), { threshold: 0.12 }
);

function addReveal(els) {
  els.forEach((el, i) => {
    el.classList.add("reveal");
    el.style.transitionDelay = (+(el.dataset.delay || i) * 0.08) + "s";
    revealObs.observe(el);
  });
}

async function loadData(endpoint, id, fn) {
  try {
    const r = await fetch(`${API}/${endpoint}`);
    if (!r.ok) throw new Error();
const j = await r.json();
const data = Array.isArray(j) ? j : j.data || [];
const c = document.getElementById(id);
if (!c) return;
if (!data.length) {
  c.innerHTML = `
    <div style="text-align:center; padding:40px; opacity:0.7;">
      <h3>No data yet 🙏</h3>
      <p>Stay tuned for updates</p>
    </div>
  `;
  return;
}

c.innerHTML = "";
data.forEach((item, i) => c.appendChild(fn(item, i)));
    addReveal(c.querySelectorAll("[data-delay]"));
  } catch (e) {
    console.log("Fallback for", endpoint);
  }
}
const mIcons = ["🙏","📚","🏘","🏥","👩‍💼","🌍","🤝","💡","🕊","✝"];
const sIcons = ["🕊","📖","💡","🤝","🌐","🏥","👨‍👩‍👧","📿"];
const MN     = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];
function mkCard(cls, html) {
  const d = document.createElement("div");
  d.className  = cls;
  d.innerHTML  = html;
  return d;
}
loadData("ministries", "ministriesGrid", (item, i) => {
  const d = mkCard("ministry-card",
    `<div class="mc-icon">${mIcons[i % 10]}</div>
     <h3>${item.title || item.name || "Ministry"}</h3>
     <p>${item.short_description || ""}</p>`
  );
  d.dataset.delay = i;
  return d;
});

loadData("projects", "projectsGrid", (item, i) => {
  const d = mkCard("project-card",
    `<div class="pc-num">${String(i + 1).padStart(2, "0")}</div>
     <h3>${item.title || ""}</h3>
     <p>${item.short_description || ""}</p>
     <div class="pc-tag">${item.category || "Ministry"}</div>`
  );
  d.dataset.delay = i;
  return d;
});

loadData("services", "servicesGrid", (item, i) => {
  const d = mkCard("service-row",
    `<div class="sr-num">${String(i + 1).padStart(2, "0")}</div>
     <div class="sr-content">
       <h3>${item.title || ""}</h3>
       <p>${item.short_description || ""}</p>
     </div>
     <div class="sr-icon">${sIcons[i % 8]}</div>`
  );
  d.dataset.delay = i;
  return d;
});


setTimeout(() =>
  addReveal(document.querySelectorAll(
    ".ministry-card,.project-card,.service-row,.event-card,.pillar,.quote-card"
  )), 300
);

const presets = document.querySelectorAll(".preset-btn");
const amtIn   = document.getElementById("amountInput");
presets.forEach(btn => {
  btn.addEventListener("click", () => {
    presets.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    if (amtIn) amtIn.value = btn.dataset.amount;
  });
});

if (amtIn) {
  amtIn.addEventListener("input", () =>
    presets.forEach(b =>
      b.classList.toggle("active", b.dataset.amount === amtIn.value)
    )
  );
}

function showToast(msg) {
  const t = document.getElementById("toast");
  if (!t) return;
  t.textContent = msg;
  t.classList.add("show");
  setTimeout(() => t.classList.remove("show"), 4500);
}

const paypalContainer = document.getElementById("paypal-button-container");

if (
  paypalContainer &&
  typeof paypal !== "undefined"
) {

  paypal.Buttons({

    createOrder: async () => {

      if (!requireLogin()) return;

      const amount =
        document.getElementById("amountInput")?.value || "10";

      const res = await fetch(`${API}/donations/order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + getToken(),
        },
        body: JSON.stringify({ amount }),
      });

      const data = await res.json();

      if (!data.id) {
        throw new Error("Order creation failed");
      }

      return data.id;
    },

    onApprove: async (data) => {

      try {

        await fetch(`${API}/donations/verify`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            orderID: data.orderID,
          }),
        });

        showToast("✝ Donation Successful! God bless you 🙏");

      } catch (err) {

        console.error(err);
        showToast("Payment verification failed");

      }

    },

    onError: (err) => {

      console.error(err);
      showToast("Payment failed");

    }

  }).render("#paypal-button-container");

}

  window.addEventListener("DOMContentLoaded", () => {
  const prayerForm = document.getElementById("prayerForm");
  if (!prayerForm) {
    console.log("Prayer form not found");
    return;
  }
  prayerForm.addEventListener("submit", async (e) => {
    e.preventDefault();
      alert("Prayer handler working");
    console.log("Prayer form submitted");
    const submitBtn = prayerForm.querySelector("button[type='submit']");
    const name = document.getElementById("prayerName")?.value.trim();
    const message = document.getElementById("prayerMessage")?.value.trim();
    if (!name || !message) {
      showToast("Please fill all fields");
      return;
    }

    try {

      submitBtn.disabled = true;
      submitBtn.querySelector("span").textContent = "Sending...";

      const res = await fetch("/api/prayer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name,
          message
        })
      });

      const data = await res.json();

      console.log(data);

      if (!res.ok) {
        throw new Error(data.message || "Failed");
      }

      showToast("🙏 Prayer request submitted successfully");

      prayerForm.reset();

    } catch (err) {
      console.error("Prayer submit error:", err);
      showToast("Failed to send prayer request");
    } finally {
      submitBtn.disabled = false;
      submitBtn.querySelector("span").textContent = "Send Prayer Request";
    }
  });

});