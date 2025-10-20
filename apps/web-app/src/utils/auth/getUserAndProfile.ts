import { createServerClientInstance } from "@/lib/supabase/server";

export async function getUserAndProfile() {
  const supabase = await createServerClientInstance();
  const {
    data: { user },
    error: userErr,
  } = await supabase.auth.getUser();
  if (userErr || !user) return { user: null, profile: null };

  const { data: profile } = await supabase
    .from("profiles")
    .select("fullname, student_id, role")
    .eq("id", user.id)
    .single();

  return { user, profile: profile ?? null };
}
