import { supabase } from "../lib/supabase";

export default async function handler(req, res) {
  const { userId, credits } = req.body;

  await supabase.from("credits").upsert({
    user_id: userId,
    credits,
  });

  res.json({ success: true });
}
