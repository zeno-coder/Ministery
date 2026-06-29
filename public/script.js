const API = "/api";
document.addEventListener("DOMContentLoaded", () => {
  const loginBtn = document.getElementById("loginBtn");
  const signupBtn = document.getElementById("signupBtn");
  if (loginBtn) loginBtn.addEventListener("click", () => { window.location.href = "/login.html"; });
  if (signupBtn) signupBtn.addEventListener("click", () => { window.location.href = "/signup.html"; });
});

function getToken() { return localStorage.getItem("token"); }
function isLoggedIn() { return !!getToken(); }
function requireLogin() {
  if (!isLoggedIn()) { window.location.href = "/login.html?redirect=donate"; return false; }
  return true;
}

/* ── PAGE LOADER ── */
window.addEventListener("load", () => {
  const loader = document.getElementById("pageLoader");
  if (!loader) return;
  setTimeout(() => {
    loader.classList.add("fade-out");
    setTimeout(() => loader.remove(), 800);
  }, 1200);
});

/* ── PARTICLES ── */
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
      this.y -= this.speed;
      this.x += this.drift;
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

/* ── NAVBAR ── */
const navbar = document.getElementById("navbar");
if (navbar) {
  window.addEventListener("scroll", () => navbar.classList.toggle("scrolled", scrollY > 60));
}

/* ── HAMBURGER ── */
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
      hamburger.querySelectorAll("span").forEach(s => { s.style.transform = ""; s.style.opacity = ""; });
    })
  );
}

function scrollToSection(id) { document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }); }

window.addEventListener("DOMContentLoaded", () => {
  const exploreBtn = document.getElementById("heroExploreBtn");
  const supportBtn = document.getElementById("heroSupportBtn");
  if (exploreBtn) exploreBtn.addEventListener("click", () => scrollToSection("ministries"));
  if (supportBtn) supportBtn.addEventListener("click", () => scrollToSection("donate"));
});

/* ── COUNTERS ── */
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

/* ── REVEAL ── */
const revealObs = new IntersectionObserver(entries =>
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add("visible"); revealObs.unobserve(e.target); }
  }), { threshold: 0.1 }
);

function addReveal(els) {
  els.forEach((el, i) => {
    el.classList.add("reveal");
    el.style.transitionDelay = (+(el.dataset.delay || i) * 0.08) + "s";
    revealObs.observe(el);
  });
}

/* ========================================================
   STATIC FALLBACK DATA
   Used when the DB returns nothing or the API is unreachable
   ======================================================== */

const STATIC_MINISTRIES = [
  {
    num: "01",
    title: "Spiritual & Evangelical",
    short_description: "Preaching the Gospel, making disciples, planting churches, and raising Christian leaders for Kingdom impact.",
    subgroups: [
      { label: "InChrist School of the Holy Spirit", items: ["3 Months Certificate Program","6 Months Ministry Training","1 Year Diploma Program","2 Year Advanced Ministry Leadership"] },
      { label: "Specialized Training", items: ["Global Pastors & Leaders Training","Teachers Training Programme","Youth Leadership Training","Women's Ministry Training","Evangelism & Discipleship Training","Prayer and Revival Conferences"] },
      { label: "Church Planting & Mission Outreach", items: ["Plant churches across Africa","Conduct evangelistic crusades","Establish prayer groups","Mentor local leaders"] },
    ],
    cta: ["Apply Now","Register"],
  },
  {
    num: "02",
    title: "Education & Training",
    short_description: "Providing biblical, academic, vocational, and leadership training to empower individuals and communities.",
    subgroups: [
      { label: "Leadership Development", items: ["Christian Leadership Courses","Biblical Studies","Community Leadership Training","Teacher Development Programs"] },
      { label: "Educational Support", items: ["Scholarships for needy children","School supplies and materials","Bible schools & discipleship centres","Youth mentoring programmes"] },
      { label: "Vocational Training", items: ["Computer Skills","Entrepreneurship Training","Financial Literacy","Small Business Management","Agricultural Skills Development"] },
    ],
    cta: ["Apply Now","Register"],
  },
  {
    num: "03",
    title: "Social Development",
    short_description: "Building stronger communities through humanitarian service, social support, and community transformation.",
    subgroups: [
      { label: "Community Development", items: ["Housing support for vulnerable families","Community infrastructure development","Elderly care programmes","Child protection initiatives"] },
      { label: "Humanitarian Relief", items: ["Food distribution","Emergency assistance","Disaster response","Rehabilitation programmes"] },
      { label: "Family Support", items: ["Marriage counselling","Parenting programmes","Community support groups","Poverty alleviation initiatives"] },
    ],
    cta: ["Contact Us"],
  },
  {
    num: "04",
    title: "Healthcare & Welfare",
    short_description: "Providing healthcare support, wellness education, and compassionate care to vulnerable communities.",
    subgroups: [
      { label: "Medical Outreach Programmes", items: ["Community medical camps","Health screenings","Maternal and child healthcare","Health awareness campaigns"] },
      { label: "Welfare Services", items: ["Support for vulnerable families","Care for elderly individuals","Assistance for persons with disabilities","Palliative care support"] },
      { label: "Health Education", items: ["Nutrition awareness","Disease prevention","Hygiene and sanitation education","Mental health awareness"] },
    ],
    cta: ["Contact Us"],
  },
  {
    num: "05",
    title: "Women & Youth",
    short_description: "Empowering women and young people through leadership development, life skills, and economic empowerment.",
    subgroups: [
      { label: "Women Empowerment", items: ["Tailoring & Fashion Design","Embroidery & Handicrafts","Cake Making & Baking","Beauty & Cosmetology","Snack Production"] },
      { label: "Youth Development", items: ["Leadership Training","Career Guidance","Entrepreneurship Development","Life Skills Training","Christian Mentorship"] },
      { label: "Awareness Programmes", items: ["Drug Abuse Prevention","Sexual Abuse Awareness","Mental Health Awareness","Responsible Social Media Usage"] },
    ],
    cta: ["Contact Us"],
  },
  {
    num: "06",
    title: "Humanitarian Relief",
    short_description: "Disaster relief, rehabilitation, and emergency support for affected communities across Africa.",
    subgroups: [
      { label: "Emergency Response", items: ["Disaster relief operations","Emergency food & shelter","Rehabilitation programmes","Crisis counselling support"] },
      { label: "Community Aid", items: ["Food distribution drives","Clean water access projects","Sanitation improvement","Basic needs support"] },
      { label: "Long-term Recovery", items: ["Community rebuilding","Economic recovery support","Trauma healing programmes","Infrastructure restoration"] },
    ],
    cta: ["Contact Us"],
  },
];

const STATIC_PROJECTS = [
  { num:"01", title:"InChrist School of the Holy Spirit — Campus Building",     short_description:"3-storey building with 5 classrooms (30 seats each), mini auditorium, chapel, dormitory for 150 students, faculty accommodation, library, offices, mess, kitchen, toilets & bathrooms.", category:"SPIRITUAL / EDUCATION" },
  { num:"02", title:"100-Bed Old Age & Palliative Home",                          short_description:"Fully equipped care facility with 100 beds, kitchen, dining hall, prayer room, bathrooms & toilets, mess, and dedicated palliative care support for the elderly and terminally ill.", category:"HEALTHCARE / COMPASSION" },
  { num:"03", title:"Church Building — 1,000-Seat Sanctuary",                    short_description:"A dedicated house of worship accommodating 1,000 people, with modern facilities, bathrooms, and space designed for vibrant congregational life and outreach.", category:"SPIRITUAL" },
  { num:"04", title:"InChrist International School — Secular Campus",            short_description:"3-storey school building with classrooms, offices, teachers' rooms, playground, mess, kitchen, toilets & bathrooms — a quality secular education institution serving the community.", category:"EDUCATION" },
  { num:"05", title:"Orphanage",                                                  short_description:"A safe, nurturing home for orphaned children with residential accommodation, educational support, nutrition, spiritual care, and life-skills development programs.", category:"CHILD WELFARE" },
  { num:"06", title:"10-Acre Land Acquisition & Ministry Vehicle",               short_description:"Securing 10 acres of land to consolidate all ministry campuses in one God-given location, along with a ministry vehicle for outreach, pastoral visits, and project operations.", category:"INFRASTRUCTURE" },
  { num:"07", title:"Bethany Health Care — Hospital & Medical Centre",           short_description:"A faith-based hospital and medical centre providing accessible, compassionate healthcare. Envisions wards, OPD, pharmacy, maternity unit, laboratory, theatre, emergency services, and prayer/counselling.", category:"HEALTHCARE / MEDICAL CENTRE" },
];

const STATIC_SERVICES = [
  { num:"01", title:"Pastoral & Counseling Services",                 short_description:"Spiritual, emotional, family, and youth counseling available to all who seek peace and direction.", cta:"Contact Us" },
  { num:"02", title:"Leadership Development Seminars",                short_description:"Conferences and training programs for church leaders, pastors, and community builders.", cta:"Know More" },
  { num:"03", title:"Economic Empowerment & Entrepreneurship",        short_description:"Financial literacy, small business training, and skills for sustainable livelihoods.", cta:"Know More" },
  { num:"04", title:"Drug Abuse & Social Awareness",                  short_description:"Community programs addressing moral values, family welfare, and substance addiction.", cta:"Contact Us" },
  { num:"05", title:"Medical Outreach & Community Health Camps",      short_description:"Free health screenings, medicine distribution, maternal care, and health awareness campaigns.", cta:"Contact Us" },
  { num:"06", title:"Child & Orphan Care",                            short_description:"Residential care, educational support, nutrition, and Christian mentorship for orphaned children.", cta:"Contact Us" },
  { num:"07", title:"Women's Vocational Skills Training",             short_description:"Tailoring, baking, beauty, handicrafts, and entrepreneurship training empowering women toward self-reliance.", cta:"Know More" },
  { num:"08", title:"Church Planting & Evangelistic Missions",        short_description:"Sending trained missionaries to plant churches and conduct crusades across Africa.", cta:"Know More" },
  { num:"09", title:"Elderly & Palliative Care",                      short_description:"Compassionate residential and outreach care for the aged, terminally ill, and vulnerable.", cta:"Contact Us" },
  { num:"10", title:"Humanitarian Relief & Disaster Response",        short_description:"Emergency food, shelter, rehabilitation, and crisis support for disaster-affected communities.", cta:"Contact Us" },
];

/* ========================================================
   RENDER HELPERS
   ======================================================== */

function buildMinistryCard(item, index) {
  const num   = item.num || String(index + 1).padStart(2, "0");
  const title = item.title || item.name || "Ministry";
  const desc  = item.short_description || "";

  // Support both DB rows (flat) and static data (with subgroups array)
  let subgroupsHTML = "";
  if (Array.isArray(item.subgroups) && item.subgroups.length) {
    subgroupsHTML = item.subgroups.map(sg => `
      <div class="min-subgroup">
        <div class="min-sub-label">${sg.label}</div>
        <ul class="min-list">
          ${sg.items.map(li => `<li>${li}</li>`).join("")}
        </ul>
      </div>`).join("");
  } else if (item.description) {
    // DB row with free-text description — render as a paragraph instead
    subgroupsHTML = `<p style="font-size:14px;color:var(--text-muted);line-height:1.7;margin-top:12px;">${item.description}</p>`;
  }

  // CTA buttons
  const ctas = Array.isArray(item.cta) ? item.cta : ["Contact Us"];
  let btnHTML = "";
  if (ctas.length === 1) {
    btnHTML = `<button class="min-btn min-btn-full" onclick="window.location.href='/contact/'">${ctas[0]}</button>`;
  } else {
    btnHTML = ctas.map((label, i) =>
      `<button class="min-btn ${i === 0 ? "min-btn-primary" : "min-btn-outline"}" onclick="window.location.href='${i === 0 ? "/contact/" : "/contact/"}'">  ${label}</button>`
    ).join("");
  }

  const card = document.createElement("div");
  card.className  = "min-card";
  card.dataset.delay = index;
  card.innerHTML  = `
    <div class="min-card-num">${num}</div>
    <h3 class="min-card-title">${title}</h3>
    <p class="min-card-desc">${desc}</p>
    ${subgroupsHTML ? `<div class="min-divider"></div>${subgroupsHTML}` : ""}
    <div class="min-card-actions">${btnHTML}</div>`;
  return card;
}

function buildProjectCard(item, index) {
  const num   = item.num || String(index + 1).padStart(2, "0");
  const title = item.title || "";
  const desc  = item.short_description || item.description || "";
  const tag   = item.category || "Ministry";

  const isLast   = index === 6; // 7th card centres on desktop
  const card     = document.createElement("div");
  card.className = "proj-card" + (isLast ? " proj-card-center" : "");
  card.dataset.delay = index;
  card.innerHTML = `
    <div class="proj-num">${num}</div>
    <h3 class="proj-title">${title}</h3>
    <p class="proj-desc">${desc}</p>
    <div class="proj-tag">${tag}</div>`;
  return card;
}

function buildServiceRow(item, index) {
  const num   = item.num || String(index + 1).padStart(2, "0");
  const title = item.title || "";
  const desc  = item.short_description || item.description || "";
  const cta   = item.cta || "Contact Us";
  const row     = document.createElement("div");
  row.className = "svc-row";
  row.dataset.delay = index;
  row.innerHTML = `
    <div class="svc-num">${num}</div>
    <div class="svc-content">
      <h3 class="svc-title">${title}</h3>
      <p class="svc-desc">${desc}</p>
    </div>
    <button class="svc-btn" onclick="window.location.href='/contact/'">${cta}</button>
`;
  return row;
}


async function loadSection(endpoint, containerId, buildFn, staticData) {
  const container = document.getElementById(containerId);
  if (!container) return;

  try {
    const r = await fetch(`${API}/${endpoint}`);
    if (!r.ok) throw new Error("non-2xx");
    const j    = await r.json();
    const rows = Array.isArray(j) ? j : (j.data || []);

    if (rows.length) {
      container.innerHTML = "";
      rows.forEach((item, i) => container.appendChild(buildFn(item, i)));
      addReveal(container.querySelectorAll("[data-delay]"));
      return;
    }
    throw new Error("empty");
  } catch {
    // Fallback: render static data (HTML is already in the page from the static markup,
    // but if we're here it means the JS is trying to re-render — just trigger reveal)
    const existing = container.querySelectorAll("[data-delay]");
    if (existing.length) {
      addReveal(existing);
      return;
    }
    // If the container was emptied by a previous failed attempt, rebuild from static
    container.innerHTML = "";
    staticData.forEach((item, i) => container.appendChild(buildFn(item, i)));
    addReveal(container.querySelectorAll("[data-delay]"));
  }
}

loadSection("ministries", "ministriesGrid", buildMinistryCard, STATIC_MINISTRIES);
loadSection("projects",   "projectsGrid",   buildProjectCard,  STATIC_PROJECTS);
loadSection("services",   "servicesGrid",   buildServiceRow,   STATIC_SERVICES);

/* Reveal other animated elements */
setTimeout(() =>
  addReveal(document.querySelectorAll(
    ".min-card,.proj-card,.svc-row,.pillar,.quote-card,.founder-card,.mission-box"
  )), 400
);

/* ── DONATION PRESETS ── */
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
    presets.forEach(b => b.classList.toggle("active", b.dataset.amount === amtIn.value))
  );
}

/* ── TOAST ── */
function showToast(msg) {
  const t = document.getElementById("toast");
  if (!t) return;
  t.textContent = msg;
  t.classList.add("show");
  setTimeout(() => t.classList.remove("show"), 4500);
}

/* ── PAYPAL ── */
const paypalContainer = document.getElementById("paypal-button-container");
if (paypalContainer && typeof paypal !== "undefined") {
  paypal.Buttons({
    createOrder: async () => {
      if (!requireLogin()) return;
      const amount = document.getElementById("amountInput")?.value || "10";
      const res = await fetch(`${API}/donations/order`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": "Bearer " + getToken() },
        body: JSON.stringify({ amount }),
      });
      const data = await res.json();
      if (!data.id) throw new Error("Order creation failed");
      return data.id;
    },
    onApprove: async (data) => {
      try {
        await fetch(`${API}/donations/verify`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderID: data.orderID }),
        });
        showToast("✝ Donation Successful! God bless you 🙏");
      } catch (err) {
        showToast("Payment verification failed");
      }
    },
    onError: () => showToast("Payment failed"),
  }).render("#paypal-button-container");
}

/* ── PRAYER FORM ── */
window.addEventListener("DOMContentLoaded", () => {
  const prayerForm = document.getElementById("prayerForm");
  if (!prayerForm) return;
  prayerForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const submitBtn = prayerForm.querySelector("button[type='submit']");
    const name      = document.getElementById("prayerName")?.value.trim();
    const message   = document.getElementById("prayerMessage")?.value.trim();
    if (!name || !message) { showToast("Please fill all fields"); return; }
    try {
      submitBtn.disabled = true;
      submitBtn.querySelector("span").textContent = "Sending...";
      const res  = await fetch("/api/prayer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, message }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed");
      showToast("🙏 Prayer request submitted successfully");
      prayerForm.reset();
    } catch (err) {
      showToast("Failed to send prayer request");
    } finally {
      submitBtn.disabled = false;
      submitBtn.querySelector("span").textContent = "Send Prayer Request";
    }
  });
});

(function initGalleryTeaser() {
  const teaserObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      if (el.classList.contains("gt-text") || el.classList.contains("gt-mosaic")) {
        el.classList.add("gt-visible");
      }

      teaserObs.unobserve(el);
    });
  }, { threshold: 0.18 });

  document.querySelectorAll(".gt-text, .gt-mosaic").forEach(el => teaserObs.observe(el));
  const workObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;

      const items = e.target.querySelectorAll(".gt-work-item");
      items.forEach((item, i) => {
        setTimeout(() => item.classList.add("gt-visible"), i * 100);
      });

      workObs.unobserve(e.target);
    });
  }, { threshold: 0.2 });

  const worksList = document.querySelector(".gt-works-list");
  if (worksList) workObs.observe(worksList);
  document.querySelectorAll(".gt-tile").forEach(tile => {
    tile.style.cursor = "pointer";
    tile.addEventListener("click", () => {
      window.location.href = "gallery/index.html";
    });
    tile.setAttribute("tabindex", "0");
    tile.setAttribute("role", "button");
    tile.setAttribute("aria-label", `View ${tile.dataset.category || ""} gallery`);
    tile.addEventListener("keydown", e => {
      if (e.key === "Enter" || e.key === " ") window.location.href = "gallery/index.html";
    });
  });

})();