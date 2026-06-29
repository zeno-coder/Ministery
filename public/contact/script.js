/* ============================================================
   LIVING CHRIST — CONTACT PAGE SCRIPT
   WhatsApp redirect · 3D tilt · Particles · Floating crosses
   ============================================================ */

/* ── PAGE LOADER ── */
window.addEventListener("load", () => {
  const loader = document.getElementById("pageLoader");
  if (!loader) return;
  setTimeout(() => {
    loader.classList.add("fade-out");
    setTimeout(() => loader.remove(), 800);
  }, 1200);
});

/* ── PARTICLE CANVAS ── */
(function initParticles() {
  const canvas = document.getElementById("particleCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  let W, H;

  function resize() {
    W = canvas.width  = innerWidth;
    H = canvas.height = innerHeight;
  }
  resize();
  window.addEventListener("resize", resize);

  class Particle {
    reset() {
      this.x     = Math.random() * W;
      this.y     = Math.random() * H;
      this.r     = Math.random() * 1.8 + 0.3;
      this.speed = Math.random() * 0.35 + 0.08;
      this.alpha = Math.random() * 0.45 + 0.08;
      this.drift = (Math.random() - 0.5) * 0.25;
    }
    constructor() { this.reset(); }
    update() {
      this.y     -= this.speed;
      this.x     += this.drift;
      this.alpha -= 0.0008;
      if (this.y < -10 || this.alpha <= 0) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(201,168,76,${this.alpha})`;
      ctx.fill();
    }
  }

  const particles = Array.from({ length: 90 }, () => new Particle());

  function animate() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animate);
  }
  animate();
})();

/* ── FLOATING 3D CROSSES ── */
(function initCrosses() {
  const container = document.getElementById("crosses3d");
  if (!container) return;

  const count = 14;
  for (let i = 0; i < count; i++) {
    const el = document.createElement("div");
    el.className = "cross-3d";
    el.textContent = "✝";

    const size    = Math.random() * 18 + 10;
    const left    = Math.random() * 100;
    const dur     = Math.random() * 14 + 10;
    const delay   = Math.random() * 12;
    const drift   = (Math.random() - 0.5) * 120;
    const peak    = (Math.random() * 0.12 + 0.04).toFixed(2);

    el.style.cssText = `
      left: ${left}%;
      font-size: ${size}px;
      --dur: ${dur}s;
      --delay: ${delay}s;
      --drift: ${drift}px;
      --peak: ${peak};
    `;
    container.appendChild(el);
  }
})();

/* ── NAVBAR ── */
const navbar    = document.getElementById("navbar");
const hamburger = document.getElementById("hamburger");
const mainNav   = document.getElementById("mainNav");

window.addEventListener("scroll", () => {
  navbar?.classList.toggle("scrolled", scrollY > 60);
});

if (hamburger && mainNav) {
  hamburger.addEventListener("click", () => {
    mainNav.classList.toggle("open");
    const spans = hamburger.querySelectorAll("span");
    if (mainNav.classList.contains("open")) {
      spans[0].style.transform = "rotate(45deg) translate(5px,5px)";
      spans[1].style.opacity   = "0";
      spans[2].style.transform = "rotate(-45deg) translate(5px,-5px)";
    } else {
      spans.forEach(s => { s.style.transform = ""; s.style.opacity = ""; });
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

/* ── SCROLL REVEAL ── */
const revealObs = new IntersectionObserver(entries =>
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add("visible");
      revealObs.unobserve(e.target);
    }
  }), { threshold: 0.1 }
);
document.querySelectorAll(".reveal").forEach(el => revealObs.observe(el));

/* ── 3D TILT (contact cards + map card) ── */
function initTilt(selector, intensity = 12) {
  document.querySelectorAll(selector).forEach(el => {
    el.addEventListener("mousemove", e => {
      const rect   = el.getBoundingClientRect();
      const cx     = rect.left + rect.width  / 2;
      const cy     = rect.top  + rect.height / 2;
      const dx     = (e.clientX - cx) / (rect.width  / 2);
      const dy     = (e.clientY - cy) / (rect.height / 2);
      const rotX   = -dy * intensity;
      const rotY   =  dx * intensity;
      el.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(8px)`;
    });
    el.addEventListener("mouseleave", () => {
      el.style.transform = "";
      el.style.transition = "transform 0.5s var(--ease)";
      setTimeout(() => el.style.transition = "", 500);
    });
    el.addEventListener("mouseenter", () => {
      el.style.transition = "transform 0.15s ease";
    });
  });
}

initTilt("[data-tilt]", 10);
initTilt("#mapCard3d", 8);

/* ── HERO 3D TILT ── */
const heroContent = document.getElementById("heroContent");
if (heroContent) {
  document.addEventListener("mousemove", e => {
    const cx = innerWidth  / 2;
    const cy = innerHeight / 2;
    const dx = (e.clientX - cx) / cx;
    const dy = (e.clientY - cy) / cy;
    heroContent.style.transform = `perspective(1200px) rotateX(${-dy * 4}deg) rotateY(${dx * 4}deg)`;
  });
}

/* ── CHARACTER COUNTER ── */
const textarea  = document.getElementById("cf-message");
const charCount = document.getElementById("charCount");
if (textarea && charCount) {
  textarea.addEventListener("input", () => {
    const len = textarea.value.length;
    charCount.textContent = len;
    charCount.style.color = len > 450
      ? "#ff6b6b"
      : len > 350
        ? "var(--gold)"
        : "var(--text-muted)";
    if (len > 500) textarea.value = textarea.value.slice(0, 500);
  });
}

/* ── FORM VALIDATION ── */
function validateField(id, errId, check) {
  const el  = document.getElementById(id);
  const err = document.getElementById(errId);
  if (!el) return true;
  const fg = el.closest(".field-group");
  if (!check(el.value)) {
    fg?.classList.add("error");
    return false;
  }
  fg?.classList.remove("error");
  return true;
}

function clearError(id) {
  const el = document.getElementById(id);
  el?.closest(".field-group")?.classList.remove("error");
}

["cf-name","cf-phone","cf-subject","cf-message"].forEach(id => {
  document.getElementById(id)?.addEventListener("input", () => clearError(id));
});

/* ── WHATSAPP FORM SUBMIT ── */
const contactForm = document.getElementById("contactForm");
if (contactForm) {
  contactForm.addEventListener("submit", e => {
    e.preventDefault();

    const name    = document.getElementById("cf-name")?.value.trim();
    const phone   = document.getElementById("cf-phone")?.value.trim();
    const email   = document.getElementById("cf-email")?.value.trim();
    const subject = document.getElementById("cf-subject")?.value;
    const message = document.getElementById("cf-message")?.value.trim();
    const source  = contactForm.querySelector("input[name='source']:checked")?.value || "";

    let valid = true;

    if (!name) {
      document.getElementById("cf-name")?.closest(".field-group")?.classList.add("error");
      valid = false;
    }
    if (!phone) {
      document.getElementById("cf-phone")?.closest(".field-group")?.classList.add("error");
      valid = false;
    }
    if (!subject) {
      document.getElementById("cf-subject")?.closest(".field-group")?.classList.add("error");
      valid = false;
    }
    if (!message) {
      document.getElementById("cf-message")?.closest(".field-group")?.classList.add("error");
      valid = false;
    }

    if (!valid) {
      showToast("Please fill all required fields ✝", "error");
      return;
    }

    const btn     = document.getElementById("submitBtn");
    const btnText = btn?.querySelector(".btn-content span");

    if (btn) {
      btn.disabled = true;
      if (btnText) btnText.textContent = "Opening WhatsApp...";
    }

    const waNumber = "256756935855";

    const waMessage =
      `✝ *Living Christ Ministry — Contact Form*\n\n` +
      `*Name:* ${name}\n` +
      `*Phone:* ${phone}\n` +
      (email ? `*Email:* ${email}\n` : "") +
      `*Subject:* ${subject}\n` +
      (source ? `*Heard from:* ${source}\n` : "") +
      `\n*Message:*\n${message}`;

    const encoded = encodeURIComponent(waMessage);
    const waUrl   = `https://wa.me/${waNumber}?text=${encoded}`;

    setTimeout(() => {
      window.open(waUrl, "_blank", "noopener,noreferrer");
      showToast("✝ WhatsApp opened — God bless you!");
      contactForm.reset();
      if (charCount) charCount.textContent = "0";
      if (btn) {
        btn.disabled = false;
        if (btnText) btnText.textContent = "Open in WhatsApp";
      }
    }, 600);
  });
}

/* ── WHATSAPP CARD CLICK ── */
document.querySelector(".ccard-wa")?.addEventListener("click", () => {
  window.open("https://wa.me/256756935855", "_blank", "noopener,noreferrer");
});

/* ── TOAST ── */
function showToast(msg, type = "") {
  const t = document.getElementById("toast");
  if (!t) return;
  t.textContent = msg;
  t.className   = "toast show" + (type === "error" ? " toast-error" : "");
  clearTimeout(t._timer);
  t._timer = setTimeout(() => { t.className = "toast"; }, 4500);
}

/* ── SOCIAL LINKS hover ripple ── */
document.querySelectorAll(".social-link").forEach(link => {
  link.addEventListener("mouseenter", function() {
    this.style.transform = "translateY(-3px) scale(1.08)";
  });
  link.addEventListener("mouseleave", function() {
    this.style.transform = "";
  });
});

/* ── MAP CARD 3D on mouse move (section level) ── */
const mapSection = document.querySelector(".map-section");
const mapCardInner = document.getElementById("mapCard3d");
if (mapSection && mapCardInner) {
  mapSection.addEventListener("mousemove", e => {
    const rect = mapCardInner.getBoundingClientRect();
    const cx   = rect.left + rect.width  / 2;
    const cy   = rect.top  + rect.height / 2;
    const dx   = (e.clientX - cx) / 220;
    const dy   = (e.clientY - cy) / 220;
    mapCardInner.style.transform = `perspective(900px) rotateX(${-dy * 7}deg) rotateY(${dx * 7}deg)`;
  });
  mapSection.addEventListener("mouseleave", () => {
    mapCardInner.style.transform = "";
  });
}

/* ── CONNECT CARDS micro-animation ── */
document.querySelectorAll(".conn-card").forEach(card => {
  card.addEventListener("mouseenter", function() {
    this.querySelector(".conn-icon")?.style.setProperty("transform", "scale(1.1) translateY(-2px)");
  });
  card.addEventListener("mouseleave", function() {
    this.querySelector(".conn-icon")?.style.setProperty("transform", "");
  });
});

/* ── INPUT focus glow ── */
document.querySelectorAll(".field-wrap input, .field-wrap select, .textarea-wrap textarea").forEach(input => {
  input.addEventListener("focus", function() {
    this.closest(".field-group")?.classList.add("focused");
  });
  input.addEventListener("blur", function() {
    this.closest(".field-group")?.classList.remove("focused");
  });
});

/* ── SMOOTH anchor scroll for hero links ── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener("click", e => {
    const target = document.querySelector(a.getAttribute("href"));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});