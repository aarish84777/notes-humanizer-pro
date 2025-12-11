import { supabase } from "../lib/supabase.js";

export default async function handler(req, res) {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: "Missing userId" });
    }

    const { data, error } = await supabase
      .from("credits")
      .select("credits")
      .eq("user_id", userId)
      .maybeSingle();

    if (error) {
      console.error("Supabase getCredits error:", error);
      return res.status(500).json({ error: "Failed fetching credits" });
    }

    if (!data) return res.json(null);

    return res.json(data.credits);
  } catch (err) {
    console.error("getCredits API error:", err);
    return res.status(500).json({ error: "Server error" });
  }
}
