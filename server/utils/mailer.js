require("dotenv").config();
const nodemailer = require("nodemailer");
console.log("EMAIL_USER =", process.env.EMAIL_USER);
console.log("EMAIL_PASS =", process.env.EMAIL_PASS);
const transporter = nodemailer.createTransport({
  service: "gmail",

  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

transporter.verify((error) => {
  if (error) console.error("❌ Mailer error:", error.message);
  else console.log("✅ Mailer ready");
});

async function sendOTP(email, otp) {
  const digits = otp.split("").map(d =>
    `<td style="padding:0 6px;">
       <div style="
         width:48px;height:60px;
         background:linear-gradient(160deg,#1a2540,#0c1120);
         border:1px solid rgba(201,168,76,0.45);
         border-radius:6px;
         display:inline-block;
         line-height:60px;
         text-align:center;
         font-family:'Georgia',serif;
         font-size:28px;
         font-weight:700;
         color:#E8C97A;
         letter-spacing:0;
         box-shadow:0 0 18px rgba(201,168,76,0.18),inset 0 1px 0 rgba(255,255,255,0.06);
       ">${d}</div>
     </td>`
  ).join("");

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
  <title>OTP Verification — Living Christ</title>
</head>
<body style="margin:0;padding:0;background:#070B14;font-family:'Georgia',serif;">

  <!-- Outer wrapper -->
  <table width="100%" cellpadding="0" cellspacing="0" border="0"
         style="background:#070B14;padding:40px 16px;">
    <tr>
      <td align="center">

        <!-- Card -->
        <table width="600" cellpadding="0" cellspacing="0" border="0"
               style="max-width:600px;width:100%;background:#0C1120;
                      border:1px solid rgba(201,168,76,0.22);
                      border-radius:14px;overflow:hidden;
                      box-shadow:0 32px 80px rgba(0,0,0,0.7);">

          <!-- ── GOLD TOP BAR ── -->
          <tr>
            <td style="height:3px;
                       background:linear-gradient(90deg,transparent,#C9A84C,#E8C97A,#C9A84C,transparent);
                       font-size:0;line-height:0;">&nbsp;</td>
          </tr>

          <!-- ── HERO SECTION ── -->
          <tr>
            <td align="center"
                style="background:linear-gradient(180deg,#101829 0%,#0C1120 100%);
                       padding:48px 40px 36px;
                       border-bottom:1px solid rgba(201,168,76,0.12);">

              <!-- Cross glyph -->
              <div style="font-size:52px;color:#C9A84C;
                          text-shadow:0 0 40px rgba(201,168,76,0.6),0 0 80px rgba(201,168,76,0.25);
                          line-height:1;margin-bottom:18px;">&#x271D;</div>

              <!-- Brand name -->
              <div style="font-family:'Georgia',serif;
                          font-size:22px;font-weight:700;
                          color:#E8C97A;
                          letter-spacing:0.18em;
                          text-transform:uppercase;
                          margin-bottom:4px;">Living Christ</div>

              <div style="font-family:Arial,sans-serif;
                          font-size:9px;letter-spacing:0.30em;
                          color:rgba(201,168,76,0.5);
                          text-transform:uppercase;
                          margin-bottom:28px;">Global Outreach Ministry</div>

              <!-- Ornament -->
              <div style="font-size:11px;color:rgba(201,168,76,0.25);
                          letter-spacing:10px;margin-bottom:24px;">· · ✦ · ·</div>

              <!-- Title -->
              <h1 style="margin:0 0 10px;
                         font-family:'Georgia',serif;
                         font-size:28px;font-weight:600;
                         color:#ffffff;letter-spacing:0.04em;">
                Verify Your Identity
              </h1>

              <p style="margin:0;
                        font-family:Arial,sans-serif;
                        font-size:13px;line-height:1.7;
                        color:rgba(232,228,220,0.55);
                        max-width:380px;">
                Use the one-time code below to complete your verification.
                This code expires in <strong style="color:rgba(201,168,76,0.75);">10 minutes</strong>.
              </p>
            </td>
          </tr>

          <!-- ── OTP DIGITS ── -->
          <tr>
            <td align="center"
                style="padding:40px 40px 32px;
                       background:#0C1120;">

              <p style="margin:0 0 20px;
                        font-family:Arial,sans-serif;
                        font-size:10px;font-weight:700;
                        letter-spacing:0.22em;text-transform:uppercase;
                        color:rgba(201,168,76,0.6);">Your Verification Code</p>

              <!-- Digit boxes -->
              <table cellpadding="0" cellspacing="0" border="0"
                     style="margin:0 auto 20px;">
                <tr>${digits}</tr>
              </table>

              <!-- Thin gold rule -->
              <table width="60%" cellpadding="0" cellspacing="0" border="0"
                     style="margin:0 auto;">
                <tr>
                  <td style="height:1px;
                             background:linear-gradient(90deg,transparent,rgba(201,168,76,0.35),transparent);
                             font-size:0;">&nbsp;</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- ── SCRIPTURE VERSE ── -->
          <tr>
            <td align="center"
                style="padding:24px 48px 28px;
                       background:linear-gradient(180deg,#0C1120,#101829);
                       border-top:1px solid rgba(201,168,76,0.08);
                       border-bottom:1px solid rgba(201,168,76,0.08);">

              <div style="border-left:2px solid rgba(201,168,76,0.45);
                          padding:10px 0 10px 18px;
                          text-align:left;
                          max-width:420px;margin:0 auto;">
                <p style="margin:0 0 6px;
                           font-family:'Georgia',serif;
                           font-size:15px;font-style:italic;
                           line-height:1.7;
                           color:rgba(232,228,220,0.65);">
                  "The LORD your God is with you, the Mighty Warrior who saves."
                </p>
                <span style="font-family:Arial,sans-serif;
                             font-size:9px;font-weight:700;
                             letter-spacing:0.18em;text-transform:uppercase;
                             color:rgba(201,168,76,0.55);">Zephaniah 3:17</span>
              </div>
            </td>
          </tr>

          <!-- ── SECURITY NOTE ── -->
          <tr>
            <td style="padding:24px 40px;background:#0C1120;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0"
                     style="background:rgba(139,26,47,0.08);
                            border:1px solid rgba(139,26,47,0.22);
                            border-radius:6px;">
                <tr>
                  <td style="padding:14px 18px;">
                    <p style="margin:0;
                               font-family:Arial,sans-serif;
                               font-size:11px;line-height:1.65;
                               color:rgba(232,228,220,0.45);">
                      <strong style="color:rgba(224,120,136,0.8);">&#x26A0; Security Notice:</strong>
                      Never share this code with anyone. Living Christ staff will never ask for your OTP.
                      If you did not request this, you can safely ignore this email.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- ── FOOTER ── -->
          <tr>
            <td align="center"
                style="padding:20px 40px 32px;
                       background:#0C1120;
                       border-top:1px solid rgba(201,168,76,0.08);">

              <div style="font-size:20px;color:rgba(201,168,76,0.30);
                          margin-bottom:12px;">&#x271D;</div>

              <p style="margin:0 0 6px;
                        font-family:Arial,sans-serif;
                        font-size:10px;letter-spacing:0.14em;
                        text-transform:uppercase;
                        color:rgba(201,168,76,0.35);">Living Christ Global Outreach</p>

              <p style="margin:0;
                        font-family:Arial,sans-serif;
                        font-size:10px;
                        color:rgba(232,228,220,0.20);
                        line-height:1.6;">
                This is an automated message. Please do not reply to this email.
              </p>
            </td>
          </tr>

          <!-- ── GOLD BOTTOM BAR ── -->
          <tr>
            <td style="height:3px;
                       background:linear-gradient(90deg,transparent,#C9A84C,#E8C97A,#C9A84C,transparent);
                       font-size:0;line-height:0;">&nbsp;</td>
          </tr>

        </table>
        <!-- /Card -->

      </td>
    </tr>
  </table>

</body>
</html>`;

  const mailOptions = {
    from: `"Living Christ Global Outreach" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "✝ Your Verification Code — Living Christ",
    html,
  };

  await transporter.sendMail(mailOptions);
}

module.exports = { sendOTP };