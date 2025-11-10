"use client";

import { useAuthStore } from "@/stores/useAuthStores";
import { toast } from "sonner";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail } from "lucide-react";

const emailSchema = z.object({
  email: z.string().email("Enter a valid email"),
});
type EmailForm = z.infer<typeof emailSchema>;

export function ChangeEmailModal({ close }: { close: () => void }) {
  const { updateEmail } = useAuthStore();

  const form = useForm({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (values: EmailForm) => {
    const toastLoading = toast.loading("Updating email...");
    const res = await updateEmail(values.email);
    toast.dismiss(toastLoading);

    if (res.error) toast.error(res.error);
    else toast.success("Check your inbox to confirm your new email.");

    close();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 p-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>New Email</FormLabel>
              <FormControl>
                <div className="relative">
                  <Mail
                    className="text-muted-foreground absolute top-3 left-3"
                    size={18}
                  />
                  <Input
                    className="pl-10"
                    placeholder="Enter new email"
                    {...field}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">
          Update Email
        </Button>
      </form>
    </Form>
  );
}
