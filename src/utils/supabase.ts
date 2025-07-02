import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL || "https://supabase.com";
const supabaseKey = process.env.SUBABASE_KEY ?? "";
const supabase = createClient(supabaseUrl, supabaseKey);
