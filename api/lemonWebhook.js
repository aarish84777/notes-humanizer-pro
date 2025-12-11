import fs from "fs";
import path from "path";
import getRawBody from "raw-body";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  try {
    const rawBody = await getRawBody(req);
    const event = JSON.parse(rawBody.toString("utf8"));

    console.log("🍋 Webhook received:", event.meta.event_name);

    const email = event?.data?.attributes?.user_email;
    if (!email) return res.status(200).json({ message: "no email" });

    const eventName = event.meta.event_name;

    // Load email → userId mapping
    const mapFile = path.join(process.cwd(), "emailToUserId.json");
    let emailMap = {};

    if (fs.existsSync(mapFile)) {
      emailMap = JSON.parse(fs.readFileSync(mapFile, "utf8"));
    }

    const userId = emailMap[email];

    if (!userId) {
      console.log("⚠️ No userId found for email:", email);
      return res.status(200).json({ message: "userId not yet mapped" });
    }

    // Load proUsers.json
    const proFile = path.join(process.cwd(), "proUsers.json");
    let db = {};

    if (fs.existsSync(proFile)) {
      db = JSON.parse(fs.readFileSync(proFile, "utf8"));
    }

    // Handle PRO activation
    if (
      eventName === "order_created" ||
      eventName === "subscription_created" ||
      eventName === "invoice_payment_succeeded"
    ) {
      db[userId] = {
        isPro: true,
        plan: "lifetime",
        activatedAt: new Date().toISOString().split("T")[0]
      };
      console.log("⭐ PRO ACTIVATED for:", userId);
    }

    // Handle cancellation
    if (eventName === "subscription_cancelled") {
      if (db[userId]) db[userId].isPro = false;
      console.log("❌ PRO CANCELLED for:", userId);
    }

    fs.writeFileSync(proFile, JSON.stringify(db, null, 2));

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("Webhook error:", err);
    return res.status(200).json({ error: true });
  }
}
