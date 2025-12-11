import { supabase } from "../lib/supabase";

export default async function handler(req, res) {
  const { userId } = req.query;

  const { data } = await supabase
    .from("pro_users")
    .select("is_pro")
    .eq("user_id", userId)
    .single();

  res.json(data?.is_pro || false);
}
