import React, { useEffect, useState } from "react";
import { Button } from "../ui/Button";
import Typography from "../ui/Typography";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@renderer/components/ui/form";
import { toast } from "sonner";
import { FileImage, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { usePartylistStore } from "@renderer/stores/usePartylistStore";
import { uploadProfileImage } from "@renderer/lib/upload";
import { Partylist } from "@renderer/types/api";

const formPartylistSchema = z.object({
  logo: z.any().optional(),
  partylist: z.string().min(1, { message: "Partylist name is required" }),
  acronym: z.string().min(1, { message: "ACRONYM is required" }),
  color: z.string().min(1, { message: "Color is required" }),
  description: z.string().optional(),
});

type EditPartylistForm = z.infer<typeof formPartylistSchema>;

export const EditPartylistModal = ({
  open,
  onClose,
  selectedPartylist,
}: {
  open: boolean;
  onClose: () => void;
  selectedPartylist: Partylist | null;
}): React.ReactElement | null => {
  const form = useForm<EditPartylistForm>({
    resolver: zodResolver(formPartylistSchema),
    defaultValues: {
      logo: null,
      partylist: "",
      acronym: "",
      color: "#000000",
      description: "",
    },
  });

  const { updatePartylist, fetchPartylist, loading } = usePartylistStore();
  const [uploading, setUploading] = useState(false);
  const colorValue = form.watch("color");

  // 🟢 Load selected data into form
  useEffect(() => {
    if (selectedPartylist) {
      form.reset({
        logo: null,
        partylist: selectedPartylist.partylist,
        acronym: selectedPartylist.acronym,
        color: selectedPartylist.color,
        description: selectedPartylist.description || "",
      });
    }
  }, [selectedPartylist, form]);

  if (!open || !selectedPartylist) return null;

  // 🟡 Handle form submit
  const onSubmit = async (values: EditPartylistForm): Promise<void> => {
    try {
      setUploading(true);
      const id = selectedPartylist.id;

      const updatePayload = {
        partylist: values.partylist,
        acronym: values.acronym,
        color: values.color,
        description: values.description,
      };

      // Step 1️⃣ Update main info
      const result = await updatePartylist(id, updatePayload);

      if (result.error) {
        toast.error("Failed to update partylist", {
          description: result.error,
        });
        setUploading(false);
        return;
      }

      // Step 2️⃣ Upload logo if changed
      if (values.logo instanceof File) {
        const loadingToast = toast.loading("Uploading new logo...", {
          description: `Updating logo for ${values.partylist}...`,
        });

        const uploaded = await uploadProfileImage(values.logo, id);

        if (!uploaded) {
          toast.dismiss(loadingToast);
          toast.error("Failed to upload logo image");
          setUploading(false);
          return;
        }

        const { publicUrl, path } = uploaded;
        await updatePartylist(id, {
          logo: publicUrl,
          logo_path: path,
        });

        toast.dismiss(loadingToast);
        toast.success("Logo updated successfully!");
      }

      toast.success("Partylist updated successfully!", {
        description: `${values.partylist} has been updated.`,
      });

      await fetchPartylist();
      onClose();
    } catch (error) {
      console.error("EditPartylist Error:", error);
      toast.error("Something went wrong while updating the partylist");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div
      className="bg-BGdark/30 dark:bg-BGlight/10 fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="bg-PRIMARY-50 dark:bg-PRIMARY-900 text-TEXTdark dark:text-TEXTlight grid w-[420px] gap-5 rounded-xl p-6 shadow-lg"
        >
          <div>
            <Typography variant="h3">Edit Partylist</Typography>
            <Typography variant="small">
              Update the information below to modify the selected partylist.
            </Typography>
          </div>

          {/* Logo Upload */}
          <FormField
            control={form.control}
            name="logo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Logo</FormLabel>
                <FormControl>
                  <div className="flex flex-row items-center gap-2">
                    {/* If there’s no new file, show existing logo */}
                    {!field.value || !(field.value instanceof File) ? (
                      selectedPartylist.logo ? (
                        <img
                          src={selectedPartylist.logo}
                          alt="Current Logo"
                          className="h-16 w-16 rounded-full border object-cover"
                        />
                      ) : (
                        <div className="bg-PRIMARY-800/50 dark:bg-PRIMARY-400/50 flex h-fit w-fit items-center justify-center rounded-full border object-cover p-2">
                          <FileImage size={40} />
                        </div>
                      )
                    ) : (
                      <img
                        src={URL.createObjectURL(field.value)}
                        alt="New Preview"
                        className="h-16 w-16 rounded-full border object-cover"
                      />
                    )}

                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => field.onChange(e.target.files?.[0])}
                      className="border-PRIMARY-800/50 dark:border-PRIMARY-400/50 cursor-pointer border-1"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Partylist Name */}
          <FormField
            control={form.control}
            name="partylist"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Partylist Name</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    className="border-PRIMARY-800/50 dark:border-PRIMARY-400/50 border-1"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Acronym */}
          <FormField
            control={form.control}
            name="acronym"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ACRONYM</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    className="border-PRIMARY-800/50 dark:border-PRIMARY-400/50 border-1"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Color */}
          <FormField
            control={form.control}
            name="color"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Color</FormLabel>
                <FormControl>
                  <div className="grid grid-cols-1">
                    <Input
                      type="color"
                      {...field}
                      className="border-PRIMARY-800/50 dark:border-PRIMARY-400/50 h-10 w-full cursor-pointer rounded-md border-1 p-1"
                    />
                    <Typography>
                      Selected Color:{" "}
                      <span style={{ color: colorValue, fontWeight: "bold" }}>
                        {colorValue}
                      </span>
                    </Typography>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Description */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    rows={3}
                    {...field}
                    className="border-PRIMARY-800/50 dark:border-PRIMARY-400/50 border-1"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Buttons */}
          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="default"
              onClick={onClose}
              className="bg-PRIMARY-50 dark:bg-PRIMARY-900/50 hover:bg-PRIMARY-200 hover:dark:bg-PRIMARY-800 text-TEXTdark dark:text-TEXTlight border-PRIMARY-700 border"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="default"
              disabled={loading || uploading}
              className="bg-PRIMARY-900 dark:bg-PRIMARY-200 text-TEXTlight hover:bg-PRIMARY-800 hover:dark:bg-PRIMARY-400 dark:text-TEXTdark border-PRIMARY-700 border"
            >
              {uploading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
