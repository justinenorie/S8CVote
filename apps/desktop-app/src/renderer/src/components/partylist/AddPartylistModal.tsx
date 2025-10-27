import React from "react";
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

const formPartylistSchema = z.object({
  logo: z.any().optional(),
  partylist: z.string().min(1, { message: "Partylist name is required" }),
  acronym: z.string().min(1, { message: "ACRONYM is required" }),
  color: z.string().min(1, { message: "Color is required" }),
  description: z.string().optional(),
});

type AddPartylistForm = z.infer<typeof formPartylistSchema>;

export const AddPartylistModal = ({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}): React.ReactElement | null => {
  const form = useForm<AddPartylistForm>({
    resolver: zodResolver(formPartylistSchema),
    defaultValues: {
      logo: null,
      partylist: "",
      acronym: "",
      color: "",
      description: "",
    },
  });

  const { addPartylist, updatePartylist, loading } = usePartylistStore();
  const [uploading, setUploading] = React.useState(false);
  const { reset } = form;
  const colorValue = form.watch("color");

  if (!open) return null;

  const onSubmit = async (values: AddPartylistForm): Promise<void> => {
    try {
      setUploading(true);

      const insertPayload = {
        logo: "",
        logo_path: "",
        partylist: values.partylist,
        acronym: values.acronym,
        color: values.color,
      };

      // Step 1️⃣: Add Partylist Record to SQLite first
      const result = await addPartylist(insertPayload);

      if (result.error || !result.data) {
        console.error("Failed to add partylist:", result.error);
        toast.error(result.error ?? "Failed to add partylist", {
          description: "Invalid Request...",
        });
        setUploading(false);
        return;
      }

      const partylistId = result.data.id;

      // Step 2️⃣: Upload logo (if provided)
      if (values.logo instanceof File) {
        const loadingToast = toast.loading("Uploading logo...", {
          description: `Uploading logo for ${values.partylist}...`,
        });

        const uploaded = await uploadProfileImage(values.logo, partylistId);
        // 👆 optional: pass a storage bucket name like "partylogos"

        if (!uploaded) {
          toast.dismiss(loadingToast);
          toast.error("Failed to upload logo image");
          setUploading(false);
          return;
        }

        const { publicUrl, path } = uploaded;
        await updatePartylist(partylistId, {
          logo: publicUrl,
          logo_path: path,
        });

        toast.dismiss(loadingToast);
        toast.success("Logo uploaded successfully!");
      }

      // Step 3️⃣: Success Toast
      toast.success("New Partylist added successfully!", {
        description: `${values.partylist} has been added.`,
      });

      reset();
      onClose();
    } catch (error) {
      console.error("AddPartylist Error:", error);
      toast.error("Something went wrong while adding the partylist");
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
            <Typography variant="h3">Add New Partylist</Typography>
            <Typography variant="small">
              Add a new partylist by entering the details below.
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
                    {!field.value || !(field.value instanceof File) ? (
                      <div className="bg-PRIMARY-800/50 dark:bg-PRIMARY-400/50 flex h-fit w-fit items-center justify-center rounded-full border object-cover p-2">
                        <FileImage size={40} />
                      </div>
                    ) : (
                      <img
                        src={URL.createObjectURL(field.value)}
                        alt="Preview"
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
                    placeholder="e.g. Unified Student Alliance"
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
                    placeholder="e.g. USA"
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
                    placeholder="Describe the partylist"
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
              className="bg-PRIMARY-50 dark:bg-PRIMARY-900/50 hover:bg-PRIMARY-200 hover:dark:bg-PRIMARY-800 text-TEXTdark dark:text-TEXTlight border-PRIMARY-700 border"
              onClick={onClose}
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
                "Submit"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
