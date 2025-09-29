import { supabase } from "@renderer/lib/supabaseClient";

export async function uploadProfileImage(
  file: File,
  candidateId: string
): Promise<{ publicUrl: string; path: string } | null> {
  if (!file) return null;

  // const fileExt = file.name.split(".").pop();
  const filePath = `candidates/${candidateId}`;

  // Upload the file to Supabase storage
  const { error } = await supabase.storage
    .from("avatars")
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: true,
      contentType: file.type, // optional but useful
    });

  if (error) {
    console.error("Error uploading file:", error.message);
    return null;
  }

  // Get public URL of uploaded file
  const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);
  const publicUrl = `${data.publicUrl}?t=${Date.now()}`;
  return { publicUrl, path: filePath };
}
