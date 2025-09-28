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

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { useCandidateStore } from "@renderer/stores/useCandidateStore";
import { useElectionStore } from "@renderer/stores/useElectionStore";
import { uploadProfileImage } from "@renderer/lib/upload";

// Form Candidate Schema
const formCandidateSchema = z.object({
  profile: z.any().optional(),
  name: z.string().min(1, { message: "Candidate name is required" }),
  election_id: z.string({ message: "Election Position is required" }),
  description: z.string().optional(),
});

type AddCandidateForm = z.infer<typeof formCandidateSchema>;

export const AddCandidatesModal = ({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}): React.ReactElement | null => {
  const form = useForm<AddCandidateForm>({
    resolver: zodResolver(formCandidateSchema),
    defaultValues: {
      profile: "",
      name: "",
      election_id: "",
      description: "",
    },
  });

  const { reset } = form;

  const { addCandidate } = useCandidateStore();
  const { elections, fetchElections } = useElectionStore();

  // Fetch Elections
  React.useEffect(() => {
    if (open) fetchElections();
  }, [open, fetchElections]);

  if (!open) return null;

  const onSubmit = async (values: AddCandidateForm): Promise<void> => {
    let profileUrl: string | null = null;

    if (values.profile instanceof File) {
      profileUrl = await uploadProfileImage(values.profile);
      if (!profileUrl) {
        toast.error("Failed to upload profile image");
        return;
      }
    }

    const payload = {
      profile: profileUrl,
      name: values.name,
      election_id: values.election_id,
      description: values.description,
    };

    const result = await addCandidate(payload);

    if (result.error) {
      console.error("Failed to add candidate:", result.error);
      toast.error(result.error, {
        description: "Invalid Request.....",
      });
    } else {
      toast.success("New Candidates added successfully!", {
        description: `${payload.name} has been added..`,
      });
      reset();
      onClose();
    }
    reset();
    onClose();
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
          {/* Header */}
          <div>
            <Typography variant="h3">Add New Candidates</Typography>
            <Typography variant="small">
              Add a new candidate by entering the details below.
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
                  <div className="flex flex-col gap-2">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => field.onChange(e.target.files?.[0])}
                      className="border-PRIMARY-800/50 dark:border-PRIMARY-400/50 cursor-pointer border-1"
                    />
                    {field.value && field.value instanceof File && (
                      <img
                        src={URL.createObjectURL(field.value)}
                        alt="Preview"
                        className="h-16 w-16 rounded-full border object-cover"
                      />
                    )}
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
                    <Select
                      {...field}
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="border-PRIMARY-800/50 dark:border-PRIMARY-400/50 dark:bg-muted/20 w-full rounded-md border-1">
                        <SelectValue placeholder="Select Election Postion" />
                      </SelectTrigger>
                      <SelectContent className="bg-PRIMARY-100 dark:bg-PRIMARY-800 text-TEXTdark dark:text-TEXTlight">
                        <SelectGroup>
                          <SelectLabel>Election Positions</SelectLabel>
                          {elections.map((election) => (
                            <SelectItem
                              key={election.id}
                              value={election.id}
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
              className="bg-PRIMARY-900 dark:bg-PRIMARY-200 text-TEXTlight hover:bg-PRIMARY-800 hover:dark:bg-PRIMARY-400 dark:text-TEXTdark border-PRIMARY-700 border"
            >
              Submit
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
