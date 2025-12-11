import { supabase } from "../lib/supabase";

export default async function handler(req, res) {
  const { id, email } = req.body;

  await supabase.from("users").upsert({
    id,
    email
  });

  res.json({ saved: true });
}
