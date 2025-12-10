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

    const file = path.join(process.cwd(), "proUsers.json");

    let db = {};
    if (fs.existsSync(file)) {
      db = JSON.parse(fs.readFileSync(file, "utf8"));
    }

    if (
      eventName === "order_created" ||
      eventName === "subscription_created" ||
      eventName === "invoice_payment_succeeded"
    ) {
      db[email] = true;
    }

    if (eventName === "subscription_cancelled") {
      db[email] = false;
    }

    fs.writeFileSync(file, JSON.stringify(db, null, 2));

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return res.status(200).json({ error: false });
  }
}
