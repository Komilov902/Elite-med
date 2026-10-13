// Vercel serverless function: forwards booking requests to Telegram.
// The bot token lives only in server-side env vars (NOT prefixed with VITE_).
//   TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID

const clean = (v, max = 300) => String(v ?? "").replace(/[\u0000-\u001f]+/g, " ").trim().slice(0, max);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false });
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chat = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chat) return res.status(500).json({ ok: false, error: "not_configured" });

  const b = typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {};
  const name = clean(b.name, 80);
  const phone = clean(b.phone, 30);
  if (name.length < 2 || phone.replace(/\D/g, "").length < 9) {
    return res.status(400).json({ ok: false, error: "invalid" });
  }

  const text = [
    "🩺 ELITE MED — YANGI QABULGA ARIZA",
    "",
    `👤 Bemor: ${name}`,
    `📞 Telefon: ${phone}`,
    `🏥 Xizmat: ${clean(b.service) || "Tanlanmagan"}`,
    `📅 Qulay sana: ${clean(b.date, 20) || "Tanlanmagan"}`,
    `👨‍⚕️ Shifokor: ${clean(b.doctor) || "Tanlanmagan"}`,
    `📝 Izoh: ${clean(b.comment, 600) || "Yo‘q"}`,
    b.account ? `🔐 Akkaunt: ${clean(b.account, 120)}` : "",
  ]
    .filter((line) => line !== "")
    .join("\n");

  try {
    const tg = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chat, text }),
    });
    const result = await tg.json();
    if (!tg.ok || !result.ok) return res.status(502).json({ ok: false });
    return res.status(200).json({ ok: true });
  } catch {
    return res.status(502).json({ ok: false });
  }
}
