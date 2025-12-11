import { supabase } from "../lib/supabase";
import getRawBody from "raw-body";

export const config = { api: { bodyParser: false } };

export default async function handler(req, res) {
  try {
    const raw = await getRawBody(req);
    const event = JSON.parse(raw.toString());

    const email = event?.data?.attributes?.user_email;
    const eventName = event?.meta?.event_name;

    if (!email) return res.status(200).json({ error: "No email" });

    // Find user in Supabase
    const { data: user } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .single();

    if (!user) {
      console.log("⚠️ No matching user for email:", email);
      return res.status(200).json({ message: "User not found" });
    }

    console.log("🍋 Webhook event:", eventName);

    if (["order_created", "invoice_payment_succeeded"].includes(eventName)) {
      await supabase.from("pro_users").upsert({
        user_id: user.id,
        is_pro: true,
        plan: "lifetime",
        activated_at: new Date().toISOString()
      });

      console.log("⭐ PRO ACTIVATED:", user.id);
    }

    res.status(200).json({ success: true });
  } catch (err) {
    console.error("Webhook error:", err);
    res.status(200).json({ error: true });
  }
}
