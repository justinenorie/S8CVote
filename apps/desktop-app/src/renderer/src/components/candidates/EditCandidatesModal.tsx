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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
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
    // TODO: Add a Default value
  });

  // Fetching the current data using the setValue
  // useEffect(() => {
  //   if (election) {
  //     form.setValue("name", election.election);
  //     form.setValue("status", election.status);
  //     form.setValue("date", new Date(`${election.end_date}`));
  //     form.setValue("time", `${election.end_time}`);
  //     form.setValue("description", election.description);

  //   }
  // }, [election, form]);

  if (!open || !candidates) return null;

  // TODO: Submit data here
  const onSubmit = async (values: EditCandidatesModal): Promise<void> => {
    console.log("Form submitted:", values);
    onClose();
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
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => field.onChange(e.target.files?.[0])}
                    className="border-PRIMARY-800/50 dark:border-PRIMARY-400/50 cursor-pointer border-1"
                  />
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
                    <Select {...field}>
                      <SelectTrigger className="border-PRIMARY-800/50 dark:border-PRIMARY-400/50 dark:bg-muted/20 w-full rounded-md border-1">
                        <SelectValue placeholder="Select Election Postion" />
                      </SelectTrigger>
                      <SelectContent className="bg-PRIMARY-100 dark:bg-PRIMARY-800 text-TEXTdark dark:text-TEXTlight">
                        <SelectGroup>
                          <SelectLabel>Election Positions</SelectLabel>
                          {/* TODO: Render the item based on the current positions from db */}
                          <SelectItem
                            value="president"
                            className="dark:focus:bg-PRIMARY-200/80 focus:bg-PRIMARY-800/80 dark:focus:text-TEXTdark/80 focus:text-TEXTlight/80"
                          >
                            SSG President
                          </SelectItem>
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
