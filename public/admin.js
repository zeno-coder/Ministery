const token = localStorage.getItem("token");
if (!token) { window.location.href = "login.html"; }
let payload;
try {
  payload = JSON.parse(atob(token.split(".")[1]));
} catch {
  localStorage.clear();
  window.location.href = "login.html";
}
if (!payload || payload.role !== "admin") {
  alert("Access Denied");
  window.location.href = "index.html";
}

function toast(msg, type = "") {
  const el = document.getElementById("toast");
  el.textContent = msg;
  el.className = "toast show" + (type ? " " + type : "");
  setTimeout(() => { el.className = "toast"; }, 3500);
}

async function api(url, opts = {}) {
  const headers = { "Authorization": "Bearer " + token };
  if (opts.body && !(opts.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }
  const res = await fetch(url, { ...opts, headers: { ...headers, ...(opts.headers || {}) } });
  return res.json();
}

function loading(container) {
  container.innerHTML = `
    <div class="loading">
      <div class="spinner"></div>
      <span>Loading...</span>
    </div>`;
}

function emptyState(container, icon, msg) {
  container.innerHTML = `
    <div class="empty-state">
      <div class="empty-icon">${icon}</div>
      <p>${msg}</p>
    </div>`;
}


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
  } catch(e) {
    console.warn("Stats load failed", e);
  }
}

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


function loadSection(section) {
  const area = document.getElementById("sectionContent");
  if (section === "events") {
    renderEventsSection(area);
  } else {
    renderGenericSection(section, area);
  }
}


function renderEventsSection(area) {
  area.innerHTML = `
    <div class="section-grid">

      <!-- ADD FORM -->
      <div class="panel">
        <div class="panel-header">
          <span class="panel-title">Add New Event</span>
        </div>
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

      <!-- LIST -->
      <div class="panel">
        <div class="panel-header">
          <span class="panel-title">All Events</span>
          <span class="panel-count" id="eventsCount">0 events</span>
        </div>
        <div class="panel-body">
          <div class="data-list" id="eventsList">
            <div class="loading"><div class="spinner"></div><span>Loading...</span></div>
          </div>
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

        <!-- Inline edit form -->
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

      card.querySelector(".btn-edit").addEventListener("click", () => {
        document.getElementById("edit-" + ev.id).classList.toggle("open");
      });

      card.querySelector(".btn-cancel").addEventListener("click", () => {
        document.getElementById("edit-" + ev.id).classList.remove("open");
      });

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
        } catch(e) {
          toast("Failed to update", "error");
        }
      });

      card.querySelector(".btn-del").addEventListener("click", async () => {
        if (!confirm("Delete this event?")) return;
        try {
          await api("/api/events/" + ev.id, { method: "DELETE" });
          toast("Event deleted", "");
          loadEvents();
          loadStats();
        } catch(e) {
          toast("Failed to delete", "error");
        }
      });
    });
  } catch(e) {
    console.error("loadEvents error:", e);
    emptyState(list, "&#x26A0;", "Failed to load events.");
  }
}

async function addEvent() {
  const title   = document.getElementById("ev-title").value.trim();
  const short   = document.getElementById("ev-short").value.trim();
  const desc    = document.getElementById("ev-desc").value.trim();
  const loc     = document.getElementById("ev-loc").value.trim();
  const date    = document.getElementById("ev-date").value;
  const time    = document.getElementById("ev-time").value;
  const imgFile = document.getElementById("ev-img").files[0];
  const btn     = document.getElementById("addEventBtn");
  if (!title || !date) { toast("Title and Date are required", "error"); return; }
  btn.disabled = true;
  btn.textContent = "Adding...";
  const fd = new FormData();
  fd.append("title",             title);
  fd.append("short_description", short);
  fd.append("description",       desc);
  fd.append("location",          loc);
  fd.append("event_date",        date);
  fd.append("time",              time);
  if (imgFile) fd.append("image", imgFile);
  try {
    await fetch("/api/events", {
      method:  "POST",
      headers: { "Authorization": "Bearer " + token },
      body:    fd,
    });
    toast("✝ Event added!", "success");
    ["ev-title","ev-short","ev-desc","ev-loc","ev-date","ev-time"].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = "";
    });
    document.getElementById("ev-img").value = "";
    loadEvents();
    loadStats();
  } catch(e) {
    toast("Failed to add event", "error");
  } finally {
    btn.disabled = false;
    btn.innerHTML = "&#x271D; Add Event";
  }
}

const TABLE_CONFIG = {
  ministries:      { title:"title",      sub:"short_description", tags:[] },
  projects:        { title:"title",      sub:"short_description", tags:["category"] },
  services:        { title:"title",      sub:"short_description", tags:[] },
  users:           { title:"email",      sub:"phone",             tags:["role","is_verified"] },
  donations:       { title:"donor_name", sub:"donor_email",       tags:["amount","payment_status"] },
  prayer:          { title:"name",       sub:"message",           tags:["status"] },
  contact:         { title:"full_name",  sub:"message",           tags:["subject","status"] },
};

const ADD_FORMS = {
  ministries: [
    { id:"title",             label:"Title *",           type:"input",    placeholder:"Ministry title" },
    { id:"short_description", label:"Short Description", type:"input",    placeholder:"One-line summary" },
    { id:"description",       label:"Full Description",  type:"textarea", placeholder:"Details..." },
    { id:"category",          label:"Category",          type:"input",    placeholder:"e.g. Education" },
  ],
  projects: [
    { id:"title",             label:"Title *",           type:"input",    placeholder:"Project title" },
    { id:"short_description", label:"Short Description", type:"input",    placeholder:"One-line summary" },
    { id:"description",       label:"Full Description",  type:"textarea", placeholder:"Details..." },
    { id:"category",          label:"Category",          type:"input",    placeholder:"e.g. Healthcare" },
    { id:"location",          label:"Location",          type:"input",    placeholder:"e.g. Kerala" },
  ],
  services: [
    { id:"title",             label:"Title *",           type:"input",    placeholder:"Service title" },
    { id:"short_description", label:"Short Description", type:"input",    placeholder:"One-line summary" },
    { id:"description",       label:"Full Description",  type:"textarea", placeholder:"Details..." },
  ],
};

function renderGenericSection(table, area) {
  const cfg     = TABLE_CONFIG[table] || {};
  const formCfg = ADD_FORMS[table];
  const canAdd  = !!formCfg;
  const readOnly = ["users","donations","prayer","contact"].includes(table);

  let formHTML = "";
  if (canAdd) {
    const fields = formCfg.map(f => `
      <div class="field">
        <label>${f.label}</label>
        ${f.type === "textarea"
          ? `<textarea id="af-${f.id}" placeholder="${f.placeholder}"></textarea>`
          : `<input    id="af-${f.id}" placeholder="${f.placeholder}" />`}
      </div>`).join("");

    formHTML = `
      <div class="panel">
        <div class="panel-header">
          <span class="panel-title">Add New</span>
        </div>
        <div class="panel-body">
          ${fields}
          <button class="panel-add-btn" id="addGenericBtn">&#x271D; Add</button>
        </div>
      </div>`;
  }

  area.innerHTML = `
    <div class="section-grid ${!canAdd ? "single-col" : ""}">
      ${formHTML}
      <div class="panel">
        <div class="panel-header">
          <span class="panel-title" id="genericPanelTitle">All Records</span>
          <span class="panel-count" id="genericCount">—</span>
        </div>
        <div class="panel-body">
          <div class="data-list" id="genericList">
            <div class="loading"><div class="spinner"></div><span>Loading...</span></div>
          </div>
        </div>
      </div>
    </div>`;

  if (canAdd) {
    document.getElementById("addGenericBtn").addEventListener("click", () => addGeneric(table, formCfg));
  }

  loadGenericTable(table, cfg, readOnly);
}

async function loadGenericTable(table, cfg, readOnly) {
  const list    = document.getElementById("genericList");
  const countEl = document.getElementById("genericCount");
  if (!list) return;
  loading(list);

  try {
  const d = await api("/api/" + table);
  console.log("API RESPONSE:", d);
  const rows = Array.isArray(d)
  ? d
  : Array.isArray(d.data)
    ? d.data
    : [];
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
        } catch(e) {
          toast("Failed to delete", "error");
        }
      });

      list.appendChild(card);
    });
  } catch(e) {
    console.error("loadGenericTable error:", e);
    emptyState(list, "&#x26A0;", "Failed to load records.");
  }
}

async function addGeneric(table, formCfg) {
  const btn  = document.getElementById("addGenericBtn");
  const body = {};

  for (const f of formCfg) {
    const el = document.getElementById("af-" + f.id);
    if (el) body[f.id] = el.value.trim();
  }

  const firstRequired = formCfg[0];
  if (!body[firstRequired.id]) {
    toast(firstRequired.label.replace(" *","") + " is required", "error");
    return;
  }

  btn.disabled = true;
  btn.textContent = "Adding...";

  try {
    await api("/api/" + table, { method: "POST", body: JSON.stringify(body) });
    toast("✝ Added successfully!", "success");
    formCfg.forEach(f => {
      const el = document.getElementById("af-" + f.id);
      if (el) el.value = "";
    });
    const cfg      = TABLE_CONFIG[table] || {};
    const readOnly = ["users","donations","prayer","contact"].includes(table);
    loadGenericTable(table, cfg, readOnly);
    loadStats();
  } catch(e) {
    toast("Failed to add", "error");
  } finally {
    btn.disabled = false;
    btn.innerHTML = "&#x271D; Add";
  }
}

loadStats();