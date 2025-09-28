import { supabase } from "@renderer/lib/supabaseClient";

export async function uploadProfileImage(
  file: File
): Promise<{ publicUrl: string; path: string } | null> {
  if (!file) return null;

  const fileExt = file.name.split(".").pop();
  const fileName = `${Date.now()}.${fileExt}`;
  const filePath = `candidates/${fileName}`;

  // Upload the file to Supabase storage
  const { error } = await supabase.storage
    .from("avatars")
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    console.error("Error uploading file:", error.message);
    return null;
  }

  // Get public URL of uploaded file
  const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);
  return { publicUrl: data.publicUrl, path: filePath };
}
