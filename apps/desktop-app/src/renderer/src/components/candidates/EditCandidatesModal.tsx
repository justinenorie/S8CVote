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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@renderer/components/ui/select";
import { toast } from "sonner";
import { UserRound, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { useCandidateStore } from "@renderer/stores/useCandidateStore";
import { useElectionStore } from "@renderer/stores/useElectionStore";
import { uploadProfileImage } from "@renderer/lib/upload";
import { Candidates } from "@renderer/types/api";

// Form Candidate Schema
const formCandidateSchema = z.object({
  profile: z.any().optional(),
  name: z.string().min(1, { message: "Candidate name is required" }),
  election_id: z.string().min(1, { message: "Election Position is required" }),
  description: z.string().optional(),
});

type EditCandidatesModal = z.infer<typeof formCandidateSchema>;

export const EditCandidatesModal = ({
  open,
  onClose,
  candidates,
}: {
  open: boolean;
  onClose: () => void;
  candidates: Candidates | null;
}): React.ReactElement | null => {
  const form = useForm<EditCandidatesModal>({
    resolver: zodResolver(formCandidateSchema),
    defaultValues: {
      profile: "",
      name: "",
      election_id: "",
      description: "",
    },
  });

  const { reset } = form;

  const { updateCandidate, loading } = useCandidateStore();
  const { elections, fetchElections } = useElectionStore();
  const [originalImageUrl, setOriginalImageUrl] = React.useState<string | null>(
    null
  );

  // Fetching Elections for Select
  React.useEffect(() => {
    if (open) {
      fetchElections();
    }
  }, [open, fetchElections]);

  // Fetching Candidates Info
  React.useEffect(() => {
    if (open && candidates && elections.length > 0) {
      setOriginalImageUrl(candidates.profile || null);

      form.reset({
        profile: candidates.profile || "",
        name: candidates.name || "",
        election_id: String(candidates.election_id),
        description: candidates.description || "",
      });
    }
  }, [open, candidates, elections, form]);

  // Fetching the Image initially
  React.useEffect(() => {
    if (!open) {
      setOriginalImageUrl(null);
      form.reset();
    }
  }, [open, form]);

  if (!open || !candidates) return null;

  const onSubmit = async (values: EditCandidatesModal): Promise<void> => {
    let profileUrl: string | null = originalImageUrl;
    let profilePath: string | null = null;

    if (values.profile instanceof File) {
      const uploaded = await uploadProfileImage(values.profile, candidates.id);
      if (!uploaded) {
        toast.error("Failed to upload profile image");
        return;
      }
      profileUrl = uploaded.publicUrl;
      profilePath = uploaded.path;
    } else if (typeof values.profile === "string" && values.profile) {
      profileUrl = values.profile;
    } else if (!values.profile && originalImageUrl) {
      profileUrl = originalImageUrl;
    }

    const payload = {
      profile: profileUrl,
      profile_path: profilePath,
      name: values.name,
      election_id: values.election_id,
      description: values.description,
    };

    const result = await updateCandidate(candidates.id, payload);

    if (result.error) {
      console.error("Failed to add candidate:", result.error);
      toast.error(result.error, {
        description: "Invalid Request.....",
      });
    } else {
      toast.success("Updated successfully!", {
        description: `${payload.name}'s information updated successfully..`,
      });
      reset();
      onClose();
    }
  };

  return (
    <div
      className="bg-BGdark/30 dark:bg-BGlight/10 fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* Header */}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="bg-PRIMARY-50 dark:bg-PRIMARY-900 text-TEXTdark dark:text-TEXTlight grid w-[420px] gap-5 rounded-xl p-6 shadow-lg"
        >
          <div>
            <Typography variant="h3">Edit Candidates</Typography>
            <Typography variant="small">
              Update the {candidates.name}’s information below.
            </Typography>
          </div>

          {/* Profile Upload */}
          <FormField
            control={form.control}
            name="profile"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Profile Image</FormLabel>
                <FormControl>
                  <div className="flex flex-row items-center gap-2">
                    {!field.value ? (
                      <div className="bg-PRIMARY-800/50 flex h-16 w-16 items-center justify-center rounded-full">
                        <UserRound size={40} />
                      </div>
                    ) : field.value instanceof File ? (
                      <img
                        src={URL.createObjectURL(field.value)}
                        alt="Preview"
                        className="h-16 w-16 rounded-full border object-cover"
                      />
                    ) : (
                      <img
                        src={field.value}
                        alt="Profile"
                        className="h-16 w-16 rounded-full border object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
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

          {/* Full Name */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g. Juan Dela Cruz"
                    {...field}
                    className="border-PRIMARY-800/50 dark:border-PRIMARY-400/50 border-1"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Election Position */}
          <FormField
            control={form.control}
            name="election_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Election Position</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="border-PRIMARY-800/50 dark:border-PRIMARY-400/50 dark:bg-muted/20 w-full rounded-md border-1">
                        <SelectValue placeholder="Select Election Postion" />
                      </SelectTrigger>
                      <SelectContent className="bg-PRIMARY-100 dark:bg-PRIMARY-800 text-TEXTdark dark:text-TEXTlight">
                        <SelectGroup>
                          <SelectLabel>Election Positions</SelectLabel>
                          {elections.map((election) => (
                            <SelectItem
                              key={election.id}
                              value={String(election.id)}
                              className="dark:focus:bg-PRIMARY-200/80 focus:bg-PRIMARY-800/80"
                            >
                              {election.election}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
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
                    placeholder="Candidate description"
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
              disabled={loading}
              className="bg-PRIMARY-900 dark:bg-PRIMARY-200 text-TEXTlight hover:bg-PRIMARY-800 hover:dark:bg-PRIMARY-400 dark:text-TEXTdark border-PRIMARY-700 border"
            >
              {loading ? (
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
