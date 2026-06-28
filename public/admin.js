const token = localStorage.getItem("token");
if (!token) { window.location.href = "login.html"; }
let payload;
try { payload = JSON.parse(atob(token.split(".")[1])); }
catch { localStorage.clear(); window.location.href = "login.html"; }
if (!payload || payload.role !== "admin") { alert("Access Denied"); window.location.href = "index.html"; }

/* ── TOAST ── */
function toast(msg, type = "") {
  const el = document.getElementById("toast");
  el.textContent = msg;
  el.className = "toast show" + (type ? " " + type : "");
  setTimeout(() => { el.className = "toast"; }, 3500);
}

/* ── API HELPER ── */
async function api(url, opts = {}) {
  const headers = { "Authorization": "Bearer " + token };
  if (opts.body && !(opts.body instanceof FormData)) headers["Content-Type"] = "application/json";
  const res = await fetch(url, { ...opts, headers: { ...headers, ...(opts.headers || {}) } });
  return res.json();
}

function loading(container) {
  container.innerHTML = `<div class="loading"><div class="spinner"></div><span>Loading...</span></div>`;
}
function emptyState(container, icon, msg) {
  container.innerHTML = `<div class="empty-state"><div class="empty-icon">${icon}</div><p>${msg}</p></div>`;
}

/* ── DASHBOARD STATS ── */
async function loadStats() {
  try {
    const d = await api("/api/dashboard");
    document.getElementById("st-events").textContent     = d.events     ?? "—";
    document.getElementById("st-ministries").textContent = d.ministries ?? "—";
    document.getElementById("st-projects").textContent   = d.projects   ?? "—";
    document.getElementById("st-donations").textContent  = d.donations  ?? "—";
    document.getElementById("st-prayers").textContent    = d.prayers    ?? "—";
    document.getElementById("st-contacts").textContent   = d.contacts   ?? "—";
    const pBadge = document.getElementById("prayerBadge");
    const cBadge = document.getElementById("contactBadge");
    if (d.prayers  > 0) { pBadge.textContent = d.prayers;  pBadge.classList.remove("hidden"); }
    if (d.contacts > 0) { cBadge.textContent = d.contacts; cBadge.classList.remove("hidden"); }
  } catch(e) { console.warn("Stats load failed", e); }
}

/* ── NAV ── */
document.querySelectorAll(".nav-item[data-section]").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".nav-item").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    const sec = btn.dataset.section;
    document.getElementById("sectionTitle").textContent =
      sec.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase());
    document.getElementById("statsRow").style.display = "none";
    loadSection(sec);
    document.getElementById("sidebar").classList.remove("open");
  });
});

document.getElementById("sidebarToggle").addEventListener("click", () => {
  document.getElementById("sidebar").classList.toggle("open");
});
document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.clear();
  window.location.href = "login.html";
});

/* ── SECTION ROUTER ── */
function loadSection(section) {
  const area = document.getElementById("sectionContent");
  if (section === "events")      return renderEventsSection(area);
  if (section === "ministries")  return renderMinistriesSection(area);
  if (section === "projects")    return renderProjectsSection(area);
  if (section === "services")    return renderServicesSection(area);
  renderGenericSection(section, area);
}

/* ============================================================
   MINISTRIES SECTION
   ============================================================ */
function renderMinistriesSection(area) {
  area.innerHTML = `
    <div class="section-grid">
      <div class="panel">
        <div class="panel-header"><span class="panel-title">Add / Edit Ministry</span></div>
        <div class="panel-body">
          <div class="field"><label>Number (e.g. 01)</label><input id="mn-num" placeholder="01" maxlength="4" /></div>
          <div class="field"><label>Title *</label><input id="mn-title" placeholder="Ministry title" /></div>
          <div class="field"><label>Short Description</label><input id="mn-short" placeholder="One-line summary" /></div>
          <div class="field"><label>Full Description</label><textarea id="mn-desc" placeholder="Full details..."></textarea></div>
          <div class="field"><label>Category</label><input id="mn-cat" placeholder="e.g. Education" /></div>

          <div class="field">
            <label>Sub-groups (JSON array)</label>
            <textarea id="mn-subgroups" rows="6" placeholder='[{"label":"Group Name","items":["Item 1","Item 2"]}]'></textarea>
            <small style="color:var(--text-muted);font-size:11px;">Each object: { "label": "...", "items": ["..."] }</small>
          </div>

          <div class="field">
            <label>CTA Buttons (JSON array)</label>
            <input id="mn-cta" placeholder='["Apply Now","Register"]' />
            <small style="color:var(--text-muted);font-size:11px;">e.g. ["Apply Now","Register"] or ["Contact Us"]</small>
          </div>

          <div class="field"><label>Image</label><input type="file" id="mn-img" accept="image/*" /></div>
          <button class="panel-add-btn" id="addMinistryBtn">&#x271D; Add Ministry</button>
        </div>
      </div>

      <div class="panel">
        <div class="panel-header">
          <span class="panel-title">All Ministries</span>
          <span class="panel-count" id="ministriesCount">—</span>
        </div>
        <div class="panel-body">
          <div class="data-list" id="ministriesList"><div class="loading"><div class="spinner"></div><span>Loading...</span></div></div>
        </div>
      </div>
    </div>`;

  document.getElementById("addMinistryBtn").addEventListener("click", addMinistry);
  loadMinistriesList();
}

async function loadMinistriesList() {
  const list    = document.getElementById("ministriesList");
  const countEl = document.getElementById("ministriesCount");
  if (!list) return;
  loading(list);

  try {
    const d    = await api("/api/ministries");
    const rows = Array.isArray(d) ? d : [];
    if (countEl) countEl.textContent = rows.length + " record" + (rows.length !== 1 ? "s" : "");
    if (!rows.length) { emptyState(list, "&#x1F64F;", "No ministries yet. Add one above."); return; }

    list.innerHTML = "";
    rows.forEach(row => {
      const card = document.createElement("div");
      card.className = "data-row";

      const subgroupsStr = row.subgroups
        ? JSON.stringify(row.subgroups, null, 2)
        : '[{"label":"","items":[""]}]';
      const ctaStr = row.cta
        ? JSON.stringify(row.cta)
        : '["Contact Us"]';

      card.innerHTML = `
        <div class="data-row-header">
          <div class="data-row-title">${row.num ? `[${row.num}] ` : ""}${row.title || "Untitled"}</div>
          <div class="data-row-actions">
            <button class="btn-sm btn-edit" data-id="${row.id}">Edit</button>
            <button class="btn-sm btn-del"  data-id="${row.id}">Delete</button>
          </div>
        </div>
        <div class="data-row-body">${row.short_description || row.description || ""}</div>
        ${row.category ? `<div class="data-row-meta"><span class="meta-tag gold">${row.category}</span></div>` : ""}

        <div class="edit-fields" id="edit-${row.id}">
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
            <input id="etitle-${row.id}"  value="${row.title || ""}"              placeholder="Title" />
            <input id="enum-${row.id}"    value="${row.num   || ""}"              placeholder="Num (01)" maxlength="4" />
          </div>
          <input id="eshort-${row.id}"  value="${row.short_description || ""}"  placeholder="Short description" />
          <textarea id="edesc-${row.id}"  placeholder="Full description">${row.description || ""}</textarea>
          <input id="ecat-${row.id}"    value="${row.category || ""}"           placeholder="Category" />
          <label style="font-size:11px;color:var(--text-muted);">Sub-groups JSON</label>
          <textarea id="esubgroups-${row.id}" rows="5" placeholder='[{"label":"","items":[""]}]'>${subgroupsStr}</textarea>
          <label style="font-size:11px;color:var(--text-muted);">CTA JSON</label>
          <input id="ecto-${row.id}" value='${ctaStr}' placeholder='["Contact Us"]' />
          <div class="edit-fields-actions">
            <button class="btn-sm btn-save"   data-id="${row.id}">Save</button>
            <button class="btn-sm btn-cancel" data-id="${row.id}">Cancel</button>
          </div>
        </div>`;

      list.appendChild(card);

      card.querySelector(".btn-edit").addEventListener("click", () =>
        document.getElementById("edit-" + row.id).classList.toggle("open")
      );
      card.querySelector(".btn-cancel").addEventListener("click", () =>
        document.getElementById("edit-" + row.id).classList.remove("open")
      );

      card.querySelector(".btn-save").addEventListener("click", async () => {
        const parseJ = (str) => { try { return JSON.parse(str); } catch { return str; } };
        const body = {
          title:             document.getElementById("etitle-"     + row.id).value,
          num:               document.getElementById("enum-"       + row.id).value,
          short_description: document.getElementById("eshort-"     + row.id).value,
          description:       document.getElementById("edesc-"      + row.id).value,
          category:          document.getElementById("ecat-"       + row.id).value,
          subgroups:         parseJ(document.getElementById("esubgroups-" + row.id).value),
          cta:               parseJ(document.getElementById("ecto-"       + row.id).value),
        };
        try {
          await api("/api/ministries/" + row.id, { method: "PUT", body: JSON.stringify(body) });
          toast("✓ Ministry updated", "success");
          loadMinistriesList();
        } catch { toast("Failed to update", "error"); }
      });

      card.querySelector(".btn-del").addEventListener("click", async () => {
        if (!confirm("Delete this ministry?")) return;
        try {
          await api("/api/ministries/" + row.id, { method: "DELETE" });
          toast("Deleted", "");
          loadMinistriesList();
          loadStats();
        } catch { toast("Failed to delete", "error"); }
      });
    });
  } catch(e) {
    console.error("loadMinistriesList error:", e);
    emptyState(list, "&#x26A0;", "Failed to load ministries.");
  }
}

async function addMinistry() {
  const btn  = document.getElementById("addMinistryBtn");
  const title = document.getElementById("mn-title").value.trim();
  if (!title) { toast("Title is required", "error"); return; }

  const parseJ = (str) => { try { return JSON.parse(str); } catch { return str || null; } };

  const fd = new FormData();
  fd.append("num",               document.getElementById("mn-num").value.trim());
  fd.append("title",             title);
  fd.append("short_description", document.getElementById("mn-short").value.trim());
  fd.append("description",       document.getElementById("mn-desc").value.trim());
  fd.append("category",          document.getElementById("mn-cat").value.trim());

  const subVal = document.getElementById("mn-subgroups").value.trim();
  if (subVal) fd.append("subgroups", subVal); // server will JSON.parse

  const ctaVal = document.getElementById("mn-cta").value.trim();
  if (ctaVal) fd.append("cta", ctaVal);

  const imgFile = document.getElementById("mn-img").files[0];
  if (imgFile) fd.append("image", imgFile);

  btn.disabled = true; btn.textContent = "Adding...";
  try {
    await fetch("/api/ministries", { method: "POST", headers: { "Authorization": "Bearer " + token }, body: fd });
    toast("✝ Ministry added!", "success");
    ["mn-num","mn-title","mn-short","mn-desc","mn-cat","mn-subgroups","mn-cta"].forEach(id => {
      const el = document.getElementById(id); if (el) el.value = "";
    });
    document.getElementById("mn-img").value = "";
    loadMinistriesList(); loadStats();
  } catch { toast("Failed to add ministry", "error"); }
  finally { btn.disabled = false; btn.innerHTML = "&#x271D; Add Ministry"; }
}

/* ============================================================
   PROJECTS SECTION
   ============================================================ */
function renderProjectsSection(area) {
  area.innerHTML = `
    <div class="section-grid">
      <div class="panel">
        <div class="panel-header"><span class="panel-title">Add New Project</span></div>
        <div class="panel-body">
          <div class="field"><label>Number (e.g. 01)</label><input id="pj-num" placeholder="01" maxlength="4" /></div>
          <div class="field"><label>Title *</label><input id="pj-title" placeholder="Project title" /></div>
          <div class="field"><label>Short Description</label><input id="pj-short" placeholder="One-line summary" /></div>
          <div class="field"><label>Full Description</label><textarea id="pj-desc" placeholder="Details..."></textarea></div>
          <div class="field"><label>Category Tag</label><input id="pj-cat" placeholder="e.g. SPIRITUAL / EDUCATION" /></div>
          <div class="field"><label>Location</label><input id="pj-loc" placeholder="e.g. Uganda" /></div>
          <div class="field"><label>Target Date</label><input type="date" id="pj-date" /></div>
          <div class="field"><label>Image</label><input type="file" id="pj-img" accept="image/*" /></div>
          <button class="panel-add-btn" id="addProjectBtn">&#x271D; Add Project</button>
        </div>
      </div>

      <div class="panel">
        <div class="panel-header">
          <span class="panel-title">All Projects</span>
          <span class="panel-count" id="projectsCount">—</span>
        </div>
        <div class="panel-body">
          <div class="data-list" id="projectsList"><div class="loading"><div class="spinner"></div><span>Loading...</span></div></div>
        </div>
      </div>
    </div>`;

  document.getElementById("addProjectBtn").addEventListener("click", addProject);
  loadProjectsList();
}

async function loadProjectsList() {
  const list    = document.getElementById("projectsList");
  const countEl = document.getElementById("projectsCount");
  if (!list) return;
  loading(list);

  try {
    const d    = await api("/api/projects");
    const rows = Array.isArray(d) ? d : [];
    if (countEl) countEl.textContent = rows.length + " record" + (rows.length !== 1 ? "s" : "");
    if (!rows.length) { emptyState(list, "&#x1F3D7;", "No projects yet. Add one above."); return; }

    list.innerHTML = "";
    rows.forEach(row => {
      const card = document.createElement("div");
      card.className = "data-row";

      const dateStr = row.event_date
        ? new Date(row.event_date).toLocaleDateString("en-IN", { day:"numeric", month:"short", year:"numeric" })
        : "—";

      card.innerHTML = `
        <div class="data-row-header">
          <div class="data-row-title">${row.num ? `[${row.num}] ` : ""}${row.title || "Untitled"}</div>
          <div class="data-row-actions">
            <button class="btn-sm btn-edit" data-id="${row.id}">Edit</button>
            <button class="btn-sm btn-del"  data-id="${row.id}">Delete</button>
          </div>
        </div>
        <div class="data-row-body">${row.short_description || row.description || ""}</div>
        <div class="data-row-meta">
          ${row.category ? `<span class="meta-tag gold">${row.category}</span>` : ""}
          ${row.location ? `<span class="meta-tag">&#x1F4CD; ${row.location}</span>` : ""}
          ${row.event_date ? `<span class="meta-tag">&#x1F4C5; ${dateStr}</span>` : ""}
        </div>

        <div class="edit-fields" id="edit-${row.id}">
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
            <input id="eptitle-${row.id}" value="${row.title || ""}"              placeholder="Title" />
            <input id="epnum-${row.id}"   value="${row.num   || ""}"              placeholder="Num (01)" maxlength="4" />
          </div>
          <input id="epshort-${row.id}"   value="${row.short_description || ""}"  placeholder="Short description" />
          <textarea id="epdesc-${row.id}" placeholder="Full description">${row.description || ""}</textarea>
          <input id="epcat-${row.id}"     value="${row.category || ""}"           placeholder="Category tag" />
          <input id="eploc-${row.id}"     value="${row.location || ""}"           placeholder="Location" />
          <div class="edit-fields-actions">
            <button class="btn-sm btn-save"   data-id="${row.id}">Save</button>
            <button class="btn-sm btn-cancel" data-id="${row.id}">Cancel</button>
          </div>
        </div>`;

      list.appendChild(card);

      card.querySelector(".btn-edit").addEventListener("click", () =>
        document.getElementById("edit-" + row.id).classList.toggle("open")
      );
      card.querySelector(".btn-cancel").addEventListener("click", () =>
        document.getElementById("edit-" + row.id).classList.remove("open")
      );
      card.querySelector(".btn-save").addEventListener("click", async () => {
        const body = {
          title:             document.getElementById("eptitle-" + row.id).value,
          num:               document.getElementById("epnum-"   + row.id).value,
          short_description: document.getElementById("epshort-" + row.id).value,
          description:       document.getElementById("epdesc-"  + row.id).value,
          category:          document.getElementById("epcat-"   + row.id).value,
          location:          document.getElementById("eploc-"   + row.id).value,
        };
        try {
          await api("/api/projects/" + row.id, { method: "PUT", body: JSON.stringify(body) });
          toast("✓ Project updated", "success");
          loadProjectsList();
        } catch { toast("Failed to update", "error"); }
      });
      card.querySelector(".btn-del").addEventListener("click", async () => {
        if (!confirm("Delete this project?")) return;
        try {
          await api("/api/projects/" + row.id, { method: "DELETE" });
          toast("Deleted", "");
          loadProjectsList(); loadStats();
        } catch { toast("Failed to delete", "error"); }
      });
    });
  } catch(e) {
    console.error("loadProjectsList error:", e);
    emptyState(list, "&#x26A0;", "Failed to load projects.");
  }
}

async function addProject() {
  const btn   = document.getElementById("addProjectBtn");
  const title = document.getElementById("pj-title").value.trim();
  if (!title) { toast("Title is required", "error"); return; }

  const fd = new FormData();
  fd.append("num",               document.getElementById("pj-num").value.trim());
  fd.append("title",             title);
  fd.append("short_description", document.getElementById("pj-short").value.trim());
  fd.append("description",       document.getElementById("pj-desc").value.trim());
  fd.append("category",          document.getElementById("pj-cat").value.trim());
  fd.append("location",          document.getElementById("pj-loc").value.trim());
  fd.append("event_date",        document.getElementById("pj-date").value);
  const imgFile = document.getElementById("pj-img").files[0];
  if (imgFile) fd.append("image", imgFile);

  btn.disabled = true; btn.textContent = "Adding...";
  try {
    await fetch("/api/projects", { method: "POST", headers: { "Authorization": "Bearer " + token }, body: fd });
    toast("✝ Project added!", "success");
    ["pj-num","pj-title","pj-short","pj-desc","pj-cat","pj-loc","pj-date"].forEach(id => {
      const el = document.getElementById(id); if (el) el.value = "";
    });
    document.getElementById("pj-img").value = "";
    loadProjectsList(); loadStats();
  } catch { toast("Failed to add project", "error"); }
  finally { btn.disabled = false; btn.innerHTML = "&#x271D; Add Project"; }
}

/* ============================================================
   SERVICES SECTION
   ============================================================ */
function renderServicesSection(area) {
  area.innerHTML = `
    <div class="section-grid">
      <div class="panel">
        <div class="panel-header"><span class="panel-title">Add New Service</span></div>
        <div class="panel-body">
          <div class="field"><label>Number (e.g. 01)</label><input id="sv-num" placeholder="01" maxlength="4" /></div>
          <div class="field"><label>Title *</label><input id="sv-title" placeholder="Service title" /></div>
          <div class="field"><label>Short Description</label><input id="sv-short" placeholder="One-line summary" /></div>
          <div class="field"><label>Full Description</label><textarea id="sv-desc" placeholder="Details..."></textarea></div>
          <div class="field"><label>Category</label><input id="sv-cat" placeholder="e.g. Healthcare" /></div>
          <div class="field">
            <label>CTA Button Label</label>
            <select id="sv-cta">
              <option value="Contact Us">Contact Us</option>
              <option value="Know More">Know More</option>
              <option value="Apply Now">Apply Now</option>
              <option value="Register">Register</option>
            </select>
          </div>
          <button class="panel-add-btn" id="addServiceBtn">&#x271D; Add Service</button>
        </div>
      </div>

      <div class="panel">
        <div class="panel-header">
          <span class="panel-title">All Services</span>
          <span class="panel-count" id="servicesCount">—</span>
        </div>
        <div class="panel-body">
          <div class="data-list" id="servicesList"><div class="loading"><div class="spinner"></div><span>Loading...</span></div></div>
        </div>
      </div>
    </div>`;

  document.getElementById("addServiceBtn").addEventListener("click", addService);
  loadServicesList();
}

async function loadServicesList() {
  const list    = document.getElementById("servicesList");
  const countEl = document.getElementById("servicesCount");
  if (!list) return;
  loading(list);

  try {
    const d    = await api("/api/services");
    const rows = Array.isArray(d) ? d : [];
    if (countEl) countEl.textContent = rows.length + " record" + (rows.length !== 1 ? "s" : "");
    if (!rows.length) { emptyState(list, "&#x1F54A;", "No services yet. Add one above."); return; }

    list.innerHTML = "";
    rows.forEach(row => {
      const card = document.createElement("div");
      card.className = "data-row";

      const ctaOptions = ["Contact Us","Know More","Apply Now","Register"].map(opt =>
        `<option value="${opt}" ${row.cta === opt ? "selected" : ""}>${opt}</option>`
      ).join("");

      card.innerHTML = `
        <div class="data-row-header">
          <div class="data-row-title">${row.num ? `[${row.num}] ` : ""}${row.title || "Untitled"}</div>
          <div class="data-row-actions">
            <button class="btn-sm btn-edit" data-id="${row.id}">Edit</button>
            <button class="btn-sm btn-del"  data-id="${row.id}">Delete</button>
          </div>
        </div>
        <div class="data-row-body">${row.short_description || row.description || ""}</div>
        <div class="data-row-meta">
          ${row.category ? `<span class="meta-tag gold">${row.category}</span>` : ""}
          ${row.cta      ? `<span class="meta-tag">CTA: ${row.cta}</span>` : ""}
        </div>

        <div class="edit-fields" id="edit-${row.id}">
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
            <input id="estitle-${row.id}" value="${row.title || ""}"              placeholder="Title" />
            <input id="esnum-${row.id}"   value="${row.num   || ""}"              placeholder="Num (01)" maxlength="4" />
          </div>
          <input id="esshort-${row.id}"   value="${row.short_description || ""}"  placeholder="Short description" />
          <textarea id="esdesc-${row.id}" placeholder="Full description">${row.description || ""}</textarea>
          <input id="escat-${row.id}"     value="${row.category || ""}"           placeholder="Category" />
          <select id="escta-${row.id}">${ctaOptions}</select>
          <div class="edit-fields-actions">
            <button class="btn-sm btn-save"   data-id="${row.id}">Save</button>
            <button class="btn-sm btn-cancel" data-id="${row.id}">Cancel</button>
          </div>
        </div>`;

      list.appendChild(card);

      card.querySelector(".btn-edit").addEventListener("click", () =>
        document.getElementById("edit-" + row.id).classList.toggle("open")
      );
      card.querySelector(".btn-cancel").addEventListener("click", () =>
        document.getElementById("edit-" + row.id).classList.remove("open")
      );
      card.querySelector(".btn-save").addEventListener("click", async () => {
        const body = {
          title:             document.getElementById("estitle-" + row.id).value,
          num:               document.getElementById("esnum-"   + row.id).value,
          short_description: document.getElementById("esshort-" + row.id).value,
          description:       document.getElementById("esdesc-"  + row.id).value,
          category:          document.getElementById("escat-"   + row.id).value,
          cta:               document.getElementById("escta-"   + row.id).value,
        };
        try {
          await api("/api/services/" + row.id, { method: "PUT", body: JSON.stringify(body) });
          toast("✓ Service updated", "success");
          loadServicesList();
        } catch { toast("Failed to update", "error"); }
      });
      card.querySelector(".btn-del").addEventListener("click", async () => {
        if (!confirm("Delete this service?")) return;
        try {
          await api("/api/services/" + row.id, { method: "DELETE" });
          toast("Deleted", "");
          loadServicesList(); loadStats();
        } catch { toast("Failed to delete", "error"); }
      });
    });
  } catch(e) {
    console.error("loadServicesList error:", e);
    emptyState(list, "&#x26A0;", "Failed to load services.");
  }
}

async function addService() {
  const btn   = document.getElementById("addServiceBtn");
  const title = document.getElementById("sv-title").value.trim();
  if (!title) { toast("Title is required", "error"); return; }

  const body = {
    num:               document.getElementById("sv-num").value.trim(),
    title,
    short_description: document.getElementById("sv-short").value.trim(),
    description:       document.getElementById("sv-desc").value.trim(),
    category:          document.getElementById("sv-cat").value.trim(),
    cta:               document.getElementById("sv-cta").value,
  };

  btn.disabled = true; btn.textContent = "Adding...";
  try {
    await api("/api/services", { method: "POST", body: JSON.stringify(body) });
    toast("✝ Service added!", "success");
    ["sv-num","sv-title","sv-short","sv-desc","sv-cat"].forEach(id => {
      const el = document.getElementById(id); if (el) el.value = "";
    });
    loadServicesList(); loadStats();
  } catch { toast("Failed to add service", "error"); }
  finally { btn.disabled = false; btn.innerHTML = "&#x271D; Add Service"; }
}

/* ============================================================
   EVENTS SECTION (unchanged from original)
   ============================================================ */
function renderEventsSection(area) {
  area.innerHTML = `
    <div class="section-grid">
      <div class="panel">
        <div class="panel-header"><span class="panel-title">Add New Event</span></div>
        <div class="panel-body">
          <div class="field"><label>Title *</label><input id="ev-title" placeholder="Event title" /></div>
          <div class="field"><label>Short Description</label><input id="ev-short" placeholder="One-line summary" /></div>
          <div class="field"><label>Full Description</label><textarea id="ev-desc" placeholder="Full details..."></textarea></div>
          <div class="field"><label>Location</label><input id="ev-loc" placeholder="e.g. Thrissur, Kerala" /></div>
          <div class="field-row">
            <div class="field"><label>Date *</label><input type="date" id="ev-date" /></div>
            <div class="field"><label>Time</label><input type="time" id="ev-time" /></div>
          </div>
          <div class="field"><label>Image</label><input type="file" id="ev-img" accept="image/*" /></div>
          <button class="panel-add-btn" id="addEventBtn">&#x271D; Add Event</button>
        </div>
      </div>
      <div class="panel">
        <div class="panel-header">
          <span class="panel-title">All Events</span>
          <span class="panel-count" id="eventsCount">0 events</span>
        </div>
        <div class="panel-body">
          <div class="data-list" id="eventsList"><div class="loading"><div class="spinner"></div><span>Loading...</span></div></div>
        </div>
      </div>
    </div>`;

  document.getElementById("addEventBtn").addEventListener("click", addEvent);
  loadEvents();
}

async function loadEvents() {
  const list    = document.getElementById("eventsList");
  const countEl = document.getElementById("eventsCount");
  if (!list) return;
  loading(list);

  try {
    const d    = await api("/api/events");
    const rows = Array.isArray(d) ? d : [];
    if (countEl) countEl.textContent = rows.length + " event" + (rows.length !== 1 ? "s" : "");
    if (!rows.length) { emptyState(list, "&#x1F4C5;", "No events yet. Add one above."); return; }

    list.innerHTML = "";
    rows.forEach(ev => {
      const card = document.createElement("div");
      card.className = "data-row";
      const dateStr = ev.event_date
        ? new Date(ev.event_date).toLocaleDateString("en-IN", { day:"numeric", month:"short", year:"numeric" })
        : "—";

      card.innerHTML = `
        <div class="data-row-header">
          <div class="data-row-title">${ev.title || "Untitled"}</div>
          <div class="data-row-actions">
            <button class="btn-sm btn-edit" data-id="${ev.id}">Edit</button>
            <button class="btn-sm btn-del"  data-id="${ev.id}">Delete</button>
          </div>
        </div>
        <div class="data-row-body">${ev.short_description || ev.description || ""}</div>
        <div class="data-row-meta">
          <span class="meta-tag gold">&#x1F4CD; ${ev.location || "TBA"}</span>
          <span class="meta-tag">&#x1F4C5; ${dateStr}</span>
          ${ev.time ? `<span class="meta-tag">&#x1F550; ${ev.time}</span>` : ""}
        </div>
        <div class="edit-fields" id="edit-${ev.id}">
          <input id="etitle-${ev.id}"  value="${ev.title || ""}"              placeholder="Title" />
          <input id="eshort-${ev.id}"  value="${ev.short_description || ""}"  placeholder="Short description" />
          <textarea id="edesc-${ev.id}" placeholder="Full description">${ev.description || ""}</textarea>
          <input id="eloc-${ev.id}"   value="${ev.location || ""}"            placeholder="Location" />
          <div class="edit-fields-actions">
            <button class="btn-sm btn-save"   data-id="${ev.id}">Save</button>
            <button class="btn-sm btn-cancel" data-id="${ev.id}">Cancel</button>
          </div>
        </div>`;

      list.appendChild(card);
      card.querySelector(".btn-edit").addEventListener("click", () =>
        document.getElementById("edit-" + ev.id).classList.toggle("open")
      );
      card.querySelector(".btn-cancel").addEventListener("click", () =>
        document.getElementById("edit-" + ev.id).classList.remove("open")
      );
      card.querySelector(".btn-save").addEventListener("click", async () => {
        const body = {
          title:             document.getElementById("etitle-" + ev.id).value,
          short_description: document.getElementById("eshort-" + ev.id).value,
          description:       document.getElementById("edesc-"  + ev.id).value,
          location:          document.getElementById("eloc-"   + ev.id).value,
        };
        try {
          await api("/api/events/" + ev.id, { method: "PUT", body: JSON.stringify(body) });
          toast("✓ Event updated", "success");
          loadEvents();
        } catch { toast("Failed to update", "error"); }
      });
      card.querySelector(".btn-del").addEventListener("click", async () => {
        if (!confirm("Delete this event?")) return;
        try {
          await api("/api/events/" + ev.id, { method: "DELETE" });
          toast("Event deleted", "");
          loadEvents(); loadStats();
        } catch { toast("Failed to delete", "error"); }
      });
    });
  } catch(e) {
    console.error("loadEvents error:", e);
    emptyState(list, "&#x26A0;", "Failed to load events.");
  }
}

async function addEvent() {
  const title   = document.getElementById("ev-title").value.trim();
  const date    = document.getElementById("ev-date").value;
  const btn     = document.getElementById("addEventBtn");
  if (!title || !date) { toast("Title and Date are required", "error"); return; }

  const fd = new FormData();
  fd.append("title",             title);
  fd.append("short_description", document.getElementById("ev-short").value.trim());
  fd.append("description",       document.getElementById("ev-desc").value.trim());
  fd.append("location",          document.getElementById("ev-loc").value.trim());
  fd.append("event_date",        date);
  fd.append("time",              document.getElementById("ev-time").value);
  const imgFile = document.getElementById("ev-img").files[0];
  if (imgFile) fd.append("image", imgFile);

  btn.disabled = true; btn.textContent = "Adding...";
  try {
    await fetch("/api/events", { method: "POST", headers: { "Authorization": "Bearer " + token }, body: fd });
    toast("✝ Event added!", "success");
    ["ev-title","ev-short","ev-desc","ev-loc","ev-date","ev-time"].forEach(id => {
      const el = document.getElementById(id); if (el) el.value = "";
    });
    document.getElementById("ev-img").value = "";
    loadEvents(); loadStats();
  } catch { toast("Failed to add event", "error"); }
  finally { btn.disabled = false; btn.innerHTML = "&#x271D; Add Event"; }
}

/* ============================================================
   GENERIC SECTION (users, donations, prayer, contact)
   ============================================================ */
const TABLE_CONFIG = {
  users:     { title:"email",      sub:"phone",       tags:["role","is_verified"] },
  donations: { title:"donor_name", sub:"donor_email", tags:["amount","payment_status"] },
  prayer:    { title:"name",       sub:"message",     tags:["status"] },
  contact:   { title:"full_name",  sub:"message",     tags:["subject","status"] },
};

function renderGenericSection(table, area) {
  const cfg      = TABLE_CONFIG[table] || {};
  const readOnly = ["users","donations","prayer","contact"].includes(table);

  area.innerHTML = `
    <div class="section-grid single-col">
      <div class="panel">
        <div class="panel-header">
          <span class="panel-title" id="genericPanelTitle">All Records</span>
          <span class="panel-count" id="genericCount">—</span>
        </div>
        <div class="panel-body">
          <div class="data-list" id="genericList"><div class="loading"><div class="spinner"></div><span>Loading...</span></div></div>
        </div>
      </div>
    </div>`;

  loadGenericTable(table, cfg, readOnly);
}

async function loadGenericTable(table, cfg, readOnly) {
  const list    = document.getElementById("genericList");
  const countEl = document.getElementById("genericCount");
  if (!list) return;
  loading(list);

  try {
    const d    = await api("/api/" + table);
    const rows = Array.isArray(d) ? d : (Array.isArray(d.data) ? d.data : []);
    if (countEl) countEl.textContent = rows.length + " record" + (rows.length !== 1 ? "s" : "");
    if (!rows.length) { emptyState(list, "&#x1F4C2;", "No records found."); return; }

    list.innerHTML = "";
    rows.forEach(row => {
      const card = document.createElement("div");
      card.className = "data-row";
      const titleVal = row[cfg.title] || row.title || ("ID " + row.id);
      const subVal   = row[cfg.sub]   || "";
      const tags     = (cfg.tags || []).map(k => {
        const v = row[k];
        if (v === null || v === undefined) return "";
        return `<span class="meta-tag ${k === "payment_status" && v === "paid" ? "gold" : ""}">${k}: ${v}</span>`;
      }).join("");

      card.innerHTML = `
        <div class="data-row-header">
          <div class="data-row-title">${titleVal}</div>
          <div class="data-row-actions">
            <button class="btn btn-sm btn-del" data-id="${row.id}">Delete</button>
          </div>
        </div>
        ${subVal ? `<div class="data-row-body">${String(subVal).substring(0,180)}${String(subVal).length > 180 ? "…" : ""}</div>` : ""}
        ${tags   ? `<div class="data-row-meta">${tags}</div>` : ""}`;

      card.querySelector(".btn-del").addEventListener("click", async () => {
        if (!confirm("Delete this record?")) return;
        try {
          await api("/api/" + table + "/" + row.id, { method: "DELETE" });
          toast("Deleted", "");
          loadGenericTable(table, cfg, readOnly);
          loadStats();
        } catch { toast("Failed to delete", "error"); }
      });

      list.appendChild(card);
    });
  } catch(e) {
    console.error("loadGenericTable error:", e);
    emptyState(list, "&#x26A0;", "Failed to load records.");
  }
}

/* ── BOOT ── */
loadStats();