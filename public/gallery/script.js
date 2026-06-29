/* ============================================================
   LIVING CHRIST — GALLERY PAGE SCRIPT
   Features:
     · Masonry grid with lazy loading
     · 3D tilt featured card (mouse tracking)
     · Filter pills with smooth show/hide
     · Lightbox with keyboard navigation + touch swipe
     · Image upload with drag-and-drop preview
     · API-first with static-data fallback
   ============================================================ */

const API = "/api";

/* ============================================================
   STATIC GALLERY DATA
   Replace image URLs with real photos from your server.
   Use your actual uploaded filenames in /uploads/.
   ============================================================ */
const STATIC_GALLERY = [
  {
    id: "s1",
    title: "Graduation Ceremony",
    caption: "InChrist School of the Holy Spirit — students receiving ministry certificates in Uganda",
    category: "graduation",
    location: "Kampala, Uganda",
    image_url: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80",
    height: "tall",
  },
  {
    id: "s2",
    title: "Community Food Distribution",
    caption: "Volunteers handing out food packages to families in need across the village",
    category: "outreach",
    location: "Uganda, East Africa",
    image_url: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&q=80",
    height: "medium",
  },
  {
    id: "s3",
    title: "Medical Outreach Camp",
    caption: "Free health screening and medicine distribution for rural communities",
    category: "medical",
    location: "Uganda, East Africa",
    image_url: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&q=80",
    height: "short",
  },
  {
    id: "s4",
    title: "Women's Vocational Training",
    caption: "Ladies learning tailoring and fashion design skills for economic empowerment",
    category: "women",
    location: "Kampala, Uganda",
    image_url: "https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=800&q=80",
    height: "medium",
  },
  {
    id: "s5",
    title: "Church Planting — Village Crusade",
    caption: "Evangelistic outreach reaching hundreds in remote villages across East Africa",
    category: "outreach",
    location: "Uganda, East Africa",
    image_url: "https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?w=800&q=80",
    height: "tall",
  },
  {
    id: "s6",
    title: "Leadership Training Seminar",
    caption: "Pastors and community leaders gathered for the Global Pastors Training Programme",
    category: "education",
    location: "Kampala, Uganda",
    image_url: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=800&q=80",
    height: "medium",
  },
  {
    id: "s7",
    title: "Graduation Day — Class of 2025",
    caption: "Joyful graduates celebrating the completion of their ministry leadership diploma",
    category: "graduation",
    location: "Uganda, East Africa",
    image_url: "https://images.unsplash.com/photo-1627556592933-ffe99c1cd9eb?w=800&q=80",
    height: "short",
  },
  {
    id: "s8",
    title: "Children's Feeding Programme",
    caption: "Nourishing the next generation — meals provided to orphaned and vulnerable children",
    category: "community",
    location: "Uganda, East Africa",
    image_url: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&q=80",
    height: "medium",
  },
  {
    id: "s9",
    title: "Maternal Healthcare Camp",
    caption: "Expectant mothers receiving prenatal care and health education free of charge",
    category: "medical",
    location: "Rural Uganda",
    image_url: "https://images.unsplash.com/photo-1584515933487-779824d29309?w=800&q=80",
    height: "tall",
  },
  {
    id: "s10",
    title: "Youth Leadership Workshop",
    caption: "Young people discovering their purpose through Christian mentorship and career guidance",
    category: "women",
    location: "Kampala, Uganda",
    image_url: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80",
    height: "medium",
  },
  {
    id: "s11",
    title: "Bible School Graduation",
    caption: "Newly commissioned ministers ready to spread the Gospel across Africa",
    category: "graduation",
    location: "Uganda, East Africa",
    image_url: "https://images.unsplash.com/photo-1544531585-9847b68c8c86?w=800&q=80",
    height: "short",
  },
  {
    id: "s12",
    title: "Community Rebuilding Initiative",
    caption: "Families receiving housing support and infrastructure assistance after displacement",
    category: "community",
    location: "Uganda, East Africa",
    image_url: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=800&q=80",
    height: "medium",
  },
  {
    id: "s13",
    title: "Evangelistic Crusade Night",
    caption: "Thousands gathered under the open sky to hear the Gospel of Jesus Christ",
    category: "outreach",
    location: "Uganda, East Africa",
    image_url: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=800&q=80",
    height: "tall",
  },
  {
    id: "s14",
    title: "Teachers Training Programme",
    caption: "Educators being equipped with modern pedagogical skills and Christian values",
    category: "education",
    location: "Kampala, Uganda",
    image_url: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&q=80",
    height: "medium",
  },
  {
    id: "s15",
    title: "Water Access Project",
    caption: "Clean water borehole commissioned for a village that relied on unsafe sources",
    category: "community",
    location: "Rural Uganda",
    image_url: "https://images.unsplash.com/photo-1535378620166-273708d44e4c?w=800&q=80",
    height: "short",
  },
];

/* Height class → aspect-ratio mapping for masonry visual variety */
const HEIGHT_MAP = {
  tall:   "aspect-ratio: 3/4;",
  medium: "aspect-ratio: 4/3;",
  short:  "aspect-ratio: 16/9;",
};

/* ── Category display labels ── */
const CATEGORY_LABELS = {
  outreach:   "Outreach",
  graduation: "Graduation",
  medical:    "Medical",
  education:  "Education",
  women:      "Women & Youth",
  community:  "Community",
};

/* ============================================================
   STATE
   ============================================================ */
let allItems     = [];        // full gallery data
let filtered     = [];        // currently shown items
let lbIndex      = 0;         // lightbox active index
let pageSize     = 12;        // items per page
let currentPage  = 1;

/* ============================================================
   INIT
   ============================================================ */
document.addEventListener("DOMContentLoaded", () => {
  initGallery();
  initFeaturedTilt();
  initFilters();
  initLightbox();
  initUpload();
  initParticlesGallery();
  initNavbar();
  initHamburger();
  initLoader();
});

/* ============================================================
   LOAD DATA
   ============================================================ */
async function initGallery() {
  try {
    const res = await fetch(`${API}/gallery`);
    if (!res.ok) throw new Error("non-2xx");
    const json = await res.json();
    const rows = Array.isArray(json) ? json : (json.data || []);
    allItems = rows.length ? rows : STATIC_GALLERY;
  } catch {
    allItems = STATIC_GALLERY;
  }

  filtered = [...allItems];
  updateCount();
  renderPage(1);
  updateFeatured(allItems[0]);
}

/* ============================================================
   RENDER MASONRY ITEMS
   ============================================================ */
function renderPage(page) {
  const grid = document.getElementById("masonryGrid");
  const start = 0;
  const end   = page * pageSize;
  const slice = filtered.slice(start, end);

  grid.innerHTML = "";
  slice.forEach((item, i) => {
    const el = buildItem(item, i);
    grid.appendChild(el);
  });

  // Reveal animation
  setTimeout(() => {
    grid.querySelectorAll(".masonry-item").forEach((el, i) => {
      setTimeout(() => el.classList.add("visible"), i * 55);
    });
  }, 60);

  // Load more button
  const wrap = document.getElementById("loadMoreWrap");
  wrap.style.display = filtered.length > end ? "flex" : "none";

  currentPage = page;
}

function buildItem(item, index) {
  const tag     = CATEGORY_LABELS[item.category] || item.category || "";
  const height  = HEIGHT_MAP[item.height] || HEIGHT_MAP.medium;
  const imgSrc  = item.image_url || item.image || "";
  const title   = item.title || "";
  const caption = item.caption || item.description || item.short_description || "";
  const loc     = item.location || "Uganda, East Africa";

  const el = document.createElement("div");
  el.className          = "masonry-item reveal";
  el.dataset.category   = item.category || "all";
  el.dataset.index      = index;
  el.setAttribute("role", "button");
  el.setAttribute("tabindex", "0");
  el.setAttribute("aria-label", `View ${title}`);

  el.innerHTML = `
    <img src="${imgSrc}" alt="${title}" style="${height}" loading="lazy" decoding="async" />
    <div class="masonry-info">
      <div class="masonry-info-tag">${tag}</div>
      <div class="masonry-info-title">${title}</div>
      <div class="masonry-info-caption">${caption}</div>
    </div>
    <div class="masonry-expand">&#x26F6;</div>
  `;

  el.addEventListener("click", () => openLightbox(index));
  el.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") openLightbox(index); });

  return el;
}

/* Load more */
document.getElementById("loadMoreBtn")?.addEventListener("click", () => {
  renderPage(currentPage + 1);
});

/* ============================================================
   FILTER PILLS
   ============================================================ */
function initFilters() {
  const pills = document.querySelectorAll(".pill");
  pills.forEach(pill => {
    pill.addEventListener("click", () => {
      pills.forEach(p => p.classList.remove("active"));
      pill.classList.add("active");

      const f = pill.dataset.filter;
      filtered = f === "all" ? [...allItems] : allItems.filter(it => it.category === f);
      updateCount();
      renderPage(1);
      if (filtered.length) updateFeatured(filtered[0]);
    });
  });
}

function updateCount() {
  const el = document.getElementById("countNum");
  if (el) el.textContent = filtered.length;
}

/* ============================================================
   FEATURED 3D TILT CARD
   ============================================================ */
function updateFeatured(item) {
  if (!item) return;
  const img     = document.getElementById("featuredImg");
  const title   = document.getElementById("featuredTitle");
  const caption = document.getElementById("featuredCaption");
  const tag     = document.getElementById("featuredTag");

  if (img)     img.src        = item.image_url || item.image || "";
  if (img)     img.alt        = item.title || "";
  if (title)   title.textContent   = item.title || "";
  if (caption) caption.textContent = item.caption || item.short_description || "";
  if (tag)     tag.textContent     = CATEGORY_LABELS[item.category] || item.category || "";
}

function initFeaturedTilt() {
  const card  = document.getElementById("featuredCard");
  const glow  = card?.querySelector(".featured-glow");
  if (!card) return;

  card.addEventListener("mousemove", e => {
    const rect   = card.getBoundingClientRect();
    const cx     = rect.left + rect.width  / 2;
    const cy     = rect.top  + rect.height / 2;
    const dx     = (e.clientX - cx) / (rect.width  / 2); // -1 to 1
    const dy     = (e.clientY - cy) / (rect.height / 2);

    const rotX   = dy * -10; // max 10deg
    const rotY   = dx *  12;

    card.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(10px)`;

    // Glow follows cursor
    const mx = ((e.clientX - rect.left) / rect.width  * 100).toFixed(1);
    const my = ((e.clientY - rect.top)  / rect.height * 100).toFixed(1);
    if (glow) glow.style.setProperty("--mx", `${mx}%`);
    if (glow) glow.style.setProperty("--my", `${my}%`);
  });

  card.addEventListener("mouseleave", () => {
    card.style.transform = "";
    card.style.transition = "transform 0.6s ease";
  });

  card.addEventListener("mouseenter", () => {
    card.style.transition = "transform 0.15s ease-out";
  });

  card.addEventListener("click", () => {
    const activePill = document.querySelector(".pill.active");
    const f = activePill?.dataset.filter || "all";
    const idx = filtered.findIndex(it => it.title === document.getElementById("featuredTitle")?.textContent);
    openLightbox(idx >= 0 ? idx : 0);
  });
}

/* ============================================================
   LIGHTBOX
   ============================================================ */
function initLightbox() {
  document.getElementById("lbClose")?.addEventListener("click", closeLightbox);
  document.getElementById("lbBackdrop")?.addEventListener("click", closeLightbox);
  document.getElementById("lbPrev")?.addEventListener("click", () => navigateLb(-1));
  document.getElementById("lbNext")?.addEventListener("click", () => navigateLb(+1));

  document.addEventListener("keydown", e => {
    const lb = document.getElementById("lightbox");
    if (!lb?.classList.contains("open")) return;
    if (e.key === "Escape")      closeLightbox();
    if (e.key === "ArrowLeft")   navigateLb(-1);
    if (e.key === "ArrowRight")  navigateLb(+1);
  });

  // Touch swipe on lightbox
  let touchStartX = 0;
  const lbScene = document.getElementById("lightbox");
  lbScene?.addEventListener("touchstart", e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  lbScene?.addEventListener("touchend",   e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) navigateLb(diff > 0 ? 1 : -1);
  });
}

function openLightbox(index) {
  lbIndex = index;
  const lb = document.getElementById("lightbox");
  lb?.classList.add("open");
  document.body.style.overflow = "hidden";
  populateLb(index);
}

function closeLightbox() {
  const lb = document.getElementById("lightbox");
  lb?.classList.remove("open");
  document.body.style.overflow = "";
}

function navigateLb(dir) {
  lbIndex = (lbIndex + dir + filtered.length) % filtered.length;
  populateLb(lbIndex);
}

function populateLb(index) {
  const item    = filtered[index];
  if (!item) return;

  const img     = document.getElementById("lbImg");
  const loader  = document.getElementById("lbLoader");
  const title   = document.getElementById("lbTitle");
  const caption = document.getElementById("lbCaption");
  const tag     = document.getElementById("lbTag");
  const counter = document.getElementById("lbCounter");
  const loc     = document.getElementById("lbLocation");

  if (title)   title.textContent   = item.title || "";
  if (caption) caption.textContent = item.caption || item.short_description || "";
  if (tag)     tag.textContent     = CATEGORY_LABELS[item.category] || "";
  if (counter) counter.textContent = `${index + 1} / ${filtered.length}`;
  if (loc)     loc.textContent     = `📍 ${item.location || "Uganda, East Africa"}`;

  if (img && loader) {
    img.classList.add("loading");
    loader.classList.remove("hidden");

    const tmp = new Image();
    tmp.onload = () => {
      img.src = tmp.src;
      img.classList.remove("loading");
      loader.classList.add("hidden");
    };
    tmp.src = item.image_url || item.image || "";
  }
}

/* ============================================================
   IMAGE UPLOAD
   ============================================================ */
function initUpload() {
  const dropZone     = document.getElementById("dropZone");
  const fileInput    = document.getElementById("fileInput");
  const uploadPreview = document.getElementById("uploadPreview");
  const previewGrid  = document.getElementById("previewGrid");
  const cancelBtn    = document.getElementById("uploadCancelBtn");
  const submitBtn    = document.getElementById("uploadSubmitBtn");

  let selectedFiles = [];

  // Drag events
  dropZone?.addEventListener("dragover", e => { e.preventDefault(); dropZone.classList.add("drag-over"); });
  dropZone?.addEventListener("dragleave", () => dropZone.classList.remove("drag-over"));
  dropZone?.addEventListener("drop", e => {
    e.preventDefault();
    dropZone.classList.remove("drag-over");
    handleFiles([...e.dataTransfer.files]);
  });

  dropZone?.addEventListener("click", () => fileInput?.click());

  fileInput?.addEventListener("change", () => {
    handleFiles([...fileInput.files]);
    fileInput.value = "";
  });

  cancelBtn?.addEventListener("click", () => {
    selectedFiles = [];
    if (previewGrid) previewGrid.innerHTML = "";
    if (uploadPreview) uploadPreview.style.display = "none";
    if (dropZone)     dropZone.style.display     = "block";
  });

  submitBtn?.addEventListener("click", () => submitUpload(selectedFiles));

  function handleFiles(files) {
    const imgs = files.filter(f => f.type.startsWith("image/"));
    if (!imgs.length) { showToast("Please select image files only"); return; }
    selectedFiles = [...selectedFiles, ...imgs].slice(0, 10); // max 10
    renderPreviews();
  }

  function renderPreviews() {
    if (!previewGrid) return;
    previewGrid.innerHTML = "";
    selectedFiles.forEach((file, i) => {
      const url  = URL.createObjectURL(file);
      const thumb = document.createElement("div");
      thumb.className = "preview-thumb";
      thumb.innerHTML = `
        <img src="${url}" alt="" />
        <button class="preview-remove" data-idx="${i}" aria-label="Remove">&#x2715;</button>
      `;
      thumb.querySelector(".preview-remove")?.addEventListener("click", () => {
        selectedFiles.splice(i, 1);
        renderPreviews();
        if (!selectedFiles.length) cancelBtn?.click();
      });
      previewGrid.appendChild(thumb);
    });

    if (dropZone)      dropZone.style.display     = "none";
    if (uploadPreview) uploadPreview.style.display = "block";
  }

  async function submitUpload(files) {
    if (!files.length) { showToast("No images selected"); return; }
    const caption  = document.getElementById("uploadCaption")?.value.trim() || "";
    const category = document.getElementById("uploadCategory")?.value || "community";

    submitBtn.disabled = true;
    submitBtn.querySelector("span").textContent = "Uploading…";

    let successCount = 0;
    for (const file of files) {
      try {
        const formData = new FormData();
        formData.append("image", file);
        formData.append("title",    caption || "Ministry Moment");
        formData.append("caption",  caption);
        formData.append("category", category);

        const res = await fetch(`${API}/gallery`, { method: "POST", body: formData });
        if (res.ok) successCount++;
      } catch {
        // continue
      }
    }

    submitBtn.disabled = false;
    submitBtn.querySelector("span").textContent = "Upload to Gallery";

    if (successCount > 0) {
      showToast(`✝ ${successCount} image${successCount > 1 ? "s" : ""} uploaded — God bless you!`);
      cancelBtn?.click();
      // Refresh gallery
      await initGallery();
    } else {
      showToast("Upload failed. Please try again.");
    }
  }
}

/* ============================================================
   UTILITY — TOAST
   ============================================================ */
function showToast(msg) {
  const t = document.getElementById("toast");
  if (!t) return;
  t.textContent = msg;
  t.classList.add("show");
  setTimeout(() => t.classList.remove("show"), 4500);
}

/* ============================================================
   RE-USE: PARTICLES + NAVBAR + HAMBURGER (from main script)
   These are self-contained so the gallery page works even if
   the main script.js is not loaded (standalone mode).
   ============================================================ */
function initParticlesGallery() {
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
      this.y -= this.speed; this.x += this.drift; this.alpha -= 0.001;
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
}

function initNavbar() {
  const navbar = document.getElementById("navbar");
  if (!navbar) return;
  window.addEventListener("scroll", () => navbar.classList.toggle("scrolled", scrollY > 60));
}

function initHamburger() {
  const hamburger = document.getElementById("hamburger");
  const mainNav   = document.getElementById("mainNav");
  if (!hamburger || !mainNav) return;
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

function initLoader() {
  window.addEventListener("load", () => {
    const loader = document.getElementById("pageLoader");
    if (!loader) return;
    setTimeout(() => {
      loader.classList.add("fade-out");
      setTimeout(() => loader.remove(), 800);
    }, 1200);
  });
}