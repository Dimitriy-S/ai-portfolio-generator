import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://ukkjfetmtmixiwphnhbm.supabase.co";

const supabaseKey = "sb_publishable_gRZUh2Fws59AeRjKvCK0zA__aV9jXWK";

export const supabase = createClient(
  supabaseUrl,
  supabaseKey
);
