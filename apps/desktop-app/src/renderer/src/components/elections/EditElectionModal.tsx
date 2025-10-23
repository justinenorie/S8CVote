import { useState, useEffect } from "react";
import { Button } from "@renderer/components/ui/Button";
import { Input } from "../ui/input";
import Typography from "../ui/Typography";
import { Textarea } from "../ui/textarea";
import { Calendar } from "../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { ChevronDownIcon, Lock, LockOpen, Loader2 } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@renderer/components/ui/form";
import { Label } from "../ui/label";
import { toast } from "sonner";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { useElectionStore } from "@renderer/stores/useElectionStore";
import { Election } from "@renderer/types/api";

// Election Form Schema
const formSchema = z.object({
  name: z.string().min(1, { message: "Election name is required" }),
  status: z
    .enum(["active", "closed"])
    .refine((val) => val !== undefined && val !== null, {
      message: "Status is required",
    }),
  date: z.date().min(1, { message: "Date is required" }),
  time: z.string().time().min(1, { message: "Time is required" }),
  description: z.string().optional(),
});

type EditElectionForm = z.infer<typeof formSchema>;

// Edit Election Modal
export function EditElectionModal({
  open,
  onClose,
  election,
}: {
  open: boolean;
  onClose: () => void;
  election: Election | null;
}): React.ReactElement | null {
  // Initializing the Form value
  const form = useForm<EditElectionForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      status: "active",
      date: new Date(),
      time: `${new Date().getHours().toString().padStart(2, "0")}:${new Date().getMinutes().toString().padStart(2, "0")}`,
      description: "",
    },
  });

  const [openState, setOpenState] = useState(false);
  const { updateElection, loading } = useElectionStore();

  // Fetching the current data using the setValue
  useEffect(() => {
    if (election) {
      form.reset({
        name: election.election || "",
        status: election.status || "active",
        date: new Date(`${election.end_date}`),
        time: `${election.end_time}`,
        description: election.description,
      });
    }
  }, [election, form]);

  if (!open || !election) return null;

  // Submit the updated data
  const onSubmit = async (values: EditElectionForm): Promise<void> => {
    const payload = {
      election: values.name,
      status: values.status,
      end_date: values.date.toISOString().split("T")[0],
      end_time: values.time,
      description: values.description ?? "",
    };

    const result = await updateElection(election?.id ?? "", payload);

    if (result.error) {
      console.error("Failed to update election:", result.error);
      toast.error(result.error, {
        description: "Invalid Request.....",
      });
    } else {
      toast.success("Election updated successfully!", {
        description: `${payload.election} has been edited..`,
      });
      onClose();
    }
  };

  return (
    <div
      className="bg-BGdark/30 dark:bg-BGlight/10 fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-PRIMARY-50 dark:bg-PRIMARY-900 text-TEXTdark dark:text-TEXTlight grid w-100 gap-5 rounded-xl p-6">
        <div>
          <Typography variant="h3" className="font-semibold">
            Edit Election
          </Typography>

          <Typography variant="small" className="">
            Make changes for {`${election.election}'s`} information.
          </Typography>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
            {/* Election Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <div className="flex flex-row gap-4">
                    <FormLabel>Election Name</FormLabel>
                    <FormMessage />
                  </div>
                  <FormControl>
                    <Input
                      className="border-PRIMARY-800/50 dark:border-PRIMARY-400/50 border-1"
                      placeholder="e.g. President"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Date and time */}
            <div className="grid grid-cols-2 gap-5">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex w-full flex-col">
                    <FormLabel>End Date</FormLabel>
                    <Popover open={openState} onOpenChange={setOpenState}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={`bg-PRIMARY-50/50 dark:bg-input/20 text-TEXTdark dark:text-TEXTlight hover:dark:text-TEXTlight border-PRIMARY-800/50 dark:border-PRIMARY-400/50 w-full justify-between border-1 ${
                            field.value
                              ? field.value.toLocaleDateString()
                              : "text-TEXTdark/40 dark:text-TEXTlight/50"
                          }`}
                        >
                          {field.value
                            ? field.value.toLocaleDateString()
                            : "Select date"}
                          <ChevronDownIcon />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent
                        className="bg-PRIMARY-100 dark:bg-PRIMARY-800 text-TEXTdark dark:text-TEXTlight w-auto overflow-hidden p-0"
                        align="start"
                      >
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={(date) => {
                            field.onChange(date);
                            setOpenState(false);
                          }}
                          captionLayout="dropdown"
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="time"
                render={({ field }) => (
                  <FormItem className="flex w-full flex-col">
                    <FormLabel>End Time</FormLabel>
                    <FormControl>
                      <Input
                        className="bg-PRIMARY-50 border-PRIMARY-800/50 dark:border-PRIMARY-400/50 appearance-none border-1 [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                        type="time"
                        id="time-picker"
                        step="1"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Status */}
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-2">
                  <FormLabel>Status</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                      className="border-PRIMARY-800/50 dark:border-PRIMARY-400/50 flex gap-2 rounded-md border p-1"
                    >
                      <FormItem className="flex-1">
                        <FormControl>
                          <RadioGroupItem
                            value="closed"
                            id="closed"
                            className="peer sr-only"
                          />
                        </FormControl>
                        <Label
                          htmlFor="closed"
                          className="peer-data-[state=checked]:bg-PRIMARY-900 dark:peer-data-[state=checked]:bg-PRIMARY-200 dark:peer-data-[state=checked]:text-TEXTdark peer-data-[state=checked]:text-TEXTlight flex cursor-pointer items-center justify-center gap-2 rounded-md px-4 py-2 text-sm"
                        >
                          <Lock className="h-4 w-4" /> Closed
                        </Label>
                      </FormItem>

                      <FormItem className="flex-1">
                        <FormControl>
                          <RadioGroupItem
                            value="active"
                            id="active"
                            className="peer sr-only"
                          />
                        </FormControl>
                        <Label
                          htmlFor="active"
                          className="peer-data-[state=checked]:bg-PRIMARY-900 dark:peer-data-[state=checked]:bg-PRIMARY-200 dark:peer-data-[state=checked]:text-TEXTdark peer-data-[state=checked]:text-TEXTlight flex cursor-pointer items-center justify-center gap-2 rounded-md px-4 py-2 text-sm"
                        >
                          <LockOpen className="h-4 w-4" /> Active
                        </Label>
                      </FormItem>
                    </RadioGroup>
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
                      className="border-PRIMARY-800/50 dark:border-PRIMARY-400/50 max-h-30 max-w-full border-1"
                      placeholder="Add Description here......"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2">
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
                  "Submit"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
