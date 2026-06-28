require("dotenv").config();
const express  = require("express");
const cors     = require("cors");
const helmet   = require("helmet");
const morgan   = require("morgan");
const jwt      = require("jsonwebtoken");
const bcrypt   = require("bcrypt");
const { Pool } = require("pg");
const multer   = require("multer");
const crypto   = require("crypto");
const path     = require("path");
const fs       = require("fs");
const Razorpay = require("razorpay");

const app        = express();
const PORT       = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET || "replace-this-secret";
const clientPath = path.join(__dirname, "../public");

const pool = new Pool(
  process.env.DATABASE_URL
    ? { connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } }
    : { host: "localhost", user: "postgres", password: "newpassword", database: "living_christ", port: 5432 }
);

const query = (text, params) => pool.query(text, params);
pool.connect()
  .then(() => console.log("PostgreSQL Connected"))
  .catch((err) => console.error("DB Connection Failed", err));

let razorpay = null;
if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
  razorpay = new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID, key_secret: process.env.RAZORPAY_KEY_SECRET });
}

app.use(cors());
app.use(express.json());
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc:    ["'self'"],
      scriptSrc:     ["'self'", "'unsafe-inline'", "https://checkout.razorpay.com", "https://www.paypal.com", "https://fonts.googleapis.com"],
      scriptSrcAttr: ["'unsafe-inline'"],
      styleSrc:      ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc:       ["'self'", "https://fonts.gstatic.com"],
      imgSrc:        ["'self'", "data:", "https://images.unsplash.com", "https://res.cloudinary.com"],
      connectSrc:    ["'self'", "http://localhost:4000", "https://livingchrist.onrender.com"],
      frameSrc:      ["https://api.razorpay.com", "https://www.paypal.com"],
    },
  },
}));
app.use(morgan("dev"));

const uploadDir = path.join(__dirname, "uploads");
fs.mkdirSync(uploadDir, { recursive: true });
const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, uploadDir),
  filename:    (_, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });
app.use("/uploads", express.static(uploadDir));
app.use(express.static(clientPath));

/* ── AUTH MIDDLEWARE ── */
const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token" });
  try { req.user = jwt.verify(token, JWT_SECRET); next(); }
  catch { res.status(401).json({ message: "Invalid token" }); }
};
const adminOnly = (req, res, next) => {
  if (req.user?.role !== "admin") return res.status(403).json({ message: "Admin only" });
  next();
};

/* ── AUTH ROUTES ── */
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await query("SELECT * FROM users WHERE email = $1", [email.toLowerCase()]);
    const user = result.rows[0];
    if (!user) return res.status(401).json({ message: "Invalid credentials" });
    if (!user.is_verified) return res.status(403).json({ message: "Please verify OTP first" });
    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: "12h" });
    res.json({ token, user });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ message: "Server error during login" });
  }
});

app.post("/api/auth/signup", async (req, res) => {
  try {
    const { email, password, phone } = req.body;
    const existing = await query("SELECT * FROM users WHERE email=$1", [email.toLowerCase()]);
    if (existing.rows.length > 0 && existing.rows[0].is_verified)
      return res.status(400).json({ message: "User already exists" });
    const hash   = await bcrypt.hash(password, 10);
    const otp    = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = new Date(Date.now() + 10 * 60 * 1000);
    if (existing.rows.length > 0 && !existing.rows[0].is_verified) {
      await query(`UPDATE users SET password_hash=$1, phone=$2, otp=$3, otp_expiry=$4 WHERE email=$5`,
        [hash, phone, otp, expiry, email.toLowerCase()]);
    } else {
      await query(`INSERT INTO users (email, password_hash, phone, otp, otp_expiry, is_verified) VALUES ($1,$2,$3,$4,$5,false)`,
        [email.toLowerCase(), hash, phone, otp, expiry]);
    }
    res.json({ message: "OTP sent to email" });
    setImmediate(async () => {
      try { const mailer = require("./utils/mailer"); await mailer.sendOTP(email, otp); }
      catch (mailErr) { console.error("Email error:", mailErr.message); }
    });
  } catch (err) {
    console.error("SIGNUP ERROR:", err);
    res.status(500).json({ message: "Server error during signup" });
  }
});

app.post("/api/auth/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;
    const result = await query("SELECT * FROM users WHERE email=$1", [email.toLowerCase()]);
    const user = result.rows[0];
    if (!user) return res.status(400).json({ message: "User not found" });
    if (user.is_verified) return res.json({ message: "Already verified" });
    if (user.otp !== otp) return res.status(400).json({ message: "Invalid OTP" });
    if (new Date() > user.otp_expiry) return res.status(400).json({ message: "OTP expired" });
    await query(`UPDATE users SET is_verified=true, otp=NULL, otp_expiry=NULL WHERE email=$1`, [email.toLowerCase()]);
    res.json({ message: "Verified successfully" });
  } catch (err) {
    console.error("VERIFY OTP ERROR:", err);
    res.status(500).json({ message: "Server error during OTP verification" });
  }
});

app.post("/api/auth/resend-otp", async (req, res) => {
  try {
    const { email } = req.body;
    const result = await query("SELECT * FROM users WHERE email=$1", [email.toLowerCase()]);
    const user = result.rows[0];
    if (!user) return res.status(400).json({ message: "User not found" });
    if (user.is_verified) return res.status(400).json({ message: "Already verified" });
    const otp    = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = new Date(Date.now() + 10 * 60 * 1000);
    await query(`UPDATE users SET otp=$1, otp_expiry=$2 WHERE email=$3`, [otp, expiry, email.toLowerCase()]);
    res.json({ message: "OTP resent" });
    setImmediate(async () => {
      try { const mailer = require("./utils/mailer"); await mailer.sendOTP(email, otp); }
      catch (err) { console.error("Resend email error:", err.message); }
    });
  } catch (err) {
    console.error("RESEND OTP ERROR:", err);
    res.status(500).json({ message: "Failed to resend OTP" });
  }
});

/* ========================================================
   CMS FACTORY
   ========================================================
   EXPANDED field sets for ministries, projects, services:

   ministries  → num, title, description, short_description,
                 category, subgroups (JSON), cta (JSON array)

   projects    → num, title, description, short_description,
                 category, location, event_date

   services    → num, title, description, short_description,
                 category, cta
   ======================================================== */
const tableFieldsMap = {
  ministries:    ["num", "title", "description", "short_description", "category", "subgroups", "cta"],
  projects:      ["num", "title", "description", "short_description", "category", "location", "event_date"],
  services:      ["num", "title", "description", "short_description", "category", "cta"],
  events:        ["title", "description", "short_description", "location", "event_date", "time"],
  gallery_items: ["title", "description"],
  testimonials:  ["person_name", "testimony_text"],
};

/*
  DB MIGRATION NOTE — run these ALTER statements once if the columns don't exist:

  -- ministries
  ALTER TABLE ministries ADD COLUMN IF NOT EXISTS num         VARCHAR(4);
  ALTER TABLE ministries ADD COLUMN IF NOT EXISTS subgroups   JSONB;
  ALTER TABLE ministries ADD COLUMN IF NOT EXISTS cta         JSONB;

  -- projects
  ALTER TABLE projects   ADD COLUMN IF NOT EXISTS num         VARCHAR(4);

  -- services
  ALTER TABLE services   ADD COLUMN IF NOT EXISTS num         VARCHAR(4);
  ALTER TABLE services   ADD COLUMN IF NOT EXISTS cta         VARCHAR(100);
*/

const createCMS = (table) => {
  const fields = tableFieldsMap[table];

  app.get(`/api/${table}`, async (_, res) => {
    try {
      const data = await query(`SELECT * FROM ${table} ORDER BY
        CASE WHEN num IS NOT NULL THEN num::int ELSE 9999 END,
        created_at DESC NULLS LAST`);
      res.json(data.rows);
    } catch (err) {
      // Fallback without num ordering if column doesn't exist
      try {
        const data = await query(`SELECT * FROM ${table} ORDER BY created_at DESC NULLS LAST`);
        res.json(data.rows);
      } catch (err2) {
        console.error(`GET ${table} ERROR:`, err2.message);
        res.status(500).json({ message: "DB error" });
      }
    }
  });

  app.get(`/api/${table}/:id`, async (req, res) => {
    try {
      const data = await query(`SELECT * FROM ${table} WHERE id=$1`, [req.params.id]);
      if (!data.rows[0]) return res.status(404).json({ message: "Not found" });
      res.json(data.rows[0]);
    } catch (err) {
      console.error(`GET ONE ${table} ERROR:`, err.message);
      res.status(500).json({ message: "DB error" });
    }
  });

  app.post(`/api/${table}`, auth, upload.single("image"), async (req, res) => {
    try {
      const image    = req.file ? `/uploads/${req.file.filename}` : null;
      const body     = req.body;
      const columns  = [], values = [], params = [];
      let i = 1;

      for (const key of fields) {
        let val = body[key];
        if (val == null || val === "") continue;

        // subgroups and cta may arrive as a JSON string from form submissions
        if ((key === "subgroups" || key === "cta") && typeof val === "string") {
          try { val = JSON.parse(val); } catch { /* keep as string */ }
        }
        // Store JSON fields as JSONB
        columns.push(key);
        values.push(`$${i++}`);
        params.push(typeof val === "object" ? JSON.stringify(val) : val);
      }

      if (image) { columns.push("image_url"); values.push(`$${i++}`); params.push(image); }
      if (columns.length === 0) return res.status(400).json({ message: "No valid data sent" });

      const data = await query(
        `INSERT INTO ${table} (${columns.join(",")}) VALUES (${values.join(",")}) RETURNING *`,
        params
      );
      res.json(data.rows[0]);
    } catch (err) {
      console.error(`${table} INSERT ERROR:`, err);
      res.status(500).json({ message: "Insert failed" });
    }
  });

  app.put(`/api/${table}/:id`, auth, adminOnly, upload.single("image"), async (req, res) => {
    try {
      const image      = req.file ? `/uploads/${req.file.filename}` : null;
      const body       = req.body;
      const setClauses = [], params = [];
      let i = 1;

      for (const key of fields) {
        let val = body[key];
        if (val == null || val === "") continue;
        if ((key === "subgroups" || key === "cta") && typeof val === "string") {
          try { val = JSON.parse(val); } catch { /* keep as string */ }
        }
        setClauses.push(`${key}=$${i++}`);
        params.push(typeof val === "object" ? JSON.stringify(val) : val);
      }

      if (image) { setClauses.push(`image_url=$${i++}`); params.push(image); }
      if (setClauses.length === 0) return res.status(400).json({ message: "No valid data to update" });

      params.push(req.params.id);
      const data = await query(
        `UPDATE ${table} SET ${setClauses.join(",")} WHERE id=$${i} RETURNING *`,
        params
      );
      if (!data.rows[0]) return res.status(404).json({ message: "Not found" });
      res.json(data.rows[0]);
    } catch (err) {
      console.error(`${table} UPDATE ERROR:`, err);
      res.status(500).json({ message: "Update failed" });
    }
  });

  app.delete(`/api/${table}/:id`, auth, adminOnly, async (req, res) => {
    try {
      const result = await query(`DELETE FROM ${table} WHERE id=$1 RETURNING id`, [req.params.id]);
      if (!result.rows[0]) return res.status(404).json({ message: "Not found" });
      res.json({ message: "Deleted", id: req.params.id });
    } catch (err) {
      console.error(`${table} DELETE ERROR:`, err);
      res.status(500).json({ message: "Delete failed" });
    }
  });
};

["ministries", "projects", "services", "events"].forEach(createCMS);

/* ── CONTACT ── */
app.post("/api/contact", async (req, res) => {
  try {
    const { full_name, email, subject, message } = req.body;
    const data = await query(
      `INSERT INTO contacts (full_name, email, subject, message, status) VALUES ($1,$2,$3,$4,'new') RETURNING *`,
      [full_name, email, subject, message]
    );
    res.json(data.rows[0]);
  } catch (err) {
    console.error("CONTACT ERROR:", err);
    res.status(500).json({ message: "Failed to save contact" });
  }
});

app.get("/api/contact", auth, adminOnly, async (_, res) => {
  try {
    const data = await query(`SELECT * FROM contacts ORDER BY created_at DESC NULLS LAST`);
    res.json(data.rows);
  } catch (err) {
    console.error("GET CONTACTS ERROR:", err);
    res.status(500).json({ message: "DB error" });
  }
});

/* ── PRAYER ── */
app.post("/api/prayer", async (req, res) => {
  try {
    const { name, message } = req.body;
    const data = await query(
      `INSERT INTO prayer_requests (name, message, status) VALUES ($1,$2,'pending') RETURNING *`,
      [name, message]
    );
    res.json(data.rows[0]);
  } catch (err) {
    console.error("PRAYER ERROR:", err);
    res.status(500).json({ message: "Failed to save prayer request" });
  }
});

app.get("/api/prayer", auth, adminOnly, async (_, res) => {
  try {
    const data = await query(`SELECT * FROM prayer_requests ORDER BY created_at DESC NULLS LAST`);
    res.json(data.rows);
  } catch (err) {
    console.error("GET PRAYERS ERROR:", err);
    res.status(500).json({ message: "DB error" });
  }
});

/* ── DONATIONS ── */
app.post("/api/donations/order", auth, async (req, res) => {
  try {
    const { donor_name, donor_email, donor_phone, amount } = req.body;
    const order = await razorpay.orders.create({ amount: Number(amount) * 100, currency: "INR", receipt: "rcpt_" + Date.now() });
    const data  = await query(
      `INSERT INTO donations (donor_name, donor_email, donor_phone, amount, razorpay_order_id, payment_status) VALUES ($1,$2,$3,$4,$5,'pending') RETURNING *`,
      [donor_name, donor_email, donor_phone, amount, order.id]
    );
    res.json({ order, donation: data.rows[0] });
  } catch (err) {
    console.error("DONATION ORDER ERROR:", err);
    res.status(500).json({ error: "Order creation failed" });
  }
});

app.post("/api/donations/verify", async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const expected = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");
    if (expected !== razorpay_signature)
      return res.status(400).json({ success: false, message: "Signature mismatch" });
    await query(
      `UPDATE donations SET payment_status='paid', razorpay_payment_id=$1, razorpay_signature=$2 WHERE razorpay_order_id=$3`,
      [razorpay_payment_id, razorpay_signature, razorpay_order_id]
    );
    res.json({ success: true });
  } catch (err) {
    console.error("DONATION VERIFY ERROR:", err);
    res.status(500).json({ error: "Verification failed" });
  }
});

app.get("/api/donations", auth, adminOnly, async (_, res) => {
  try {
    const data = await query(`SELECT * FROM donations ORDER BY created_at DESC NULLS LAST`);
    res.json(data.rows);
  } catch (err) {
    console.error("GET DONATIONS ERROR:", err);
    res.status(500).json({ message: "DB error" });
  }
});

/* ── DASHBOARD ── */
app.get("/api/dashboard", auth, async (_, res) => {
  try {
    const result = await query(`
      SELECT
        (SELECT COUNT(*) FROM ministries)                              AS ministries,
        (SELECT COUNT(*) FROM projects)                               AS projects,
        (SELECT COUNT(*) FROM services)                               AS services,
        (SELECT COUNT(*) FROM events)                                 AS events,
        (SELECT COUNT(*) FROM donations)                              AS donations,
        (SELECT COUNT(*) FROM prayer_requests WHERE status='pending') AS prayers,
        (SELECT COUNT(*) FROM contacts WHERE status='new')            AS contacts
    `);
    res.json(result.rows[0]);
  } catch (err) {
    console.error("DASHBOARD ERROR:", err);
    res.status(500).json({ message: "Dashboard query failed" });
  }
});

app.get("/api/health", (_, res) => res.json({ status: "ok" }));
app.get("/events.html", (_, res) => res.sendFile(path.join(clientPath, "events.html")));
app.get("*", (_, res) => res.sendFile(path.join(clientPath, "index.html")));

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));