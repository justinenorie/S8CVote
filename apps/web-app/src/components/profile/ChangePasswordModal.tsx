"use client";

import { useState } from "react";
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
import { Lock, Eye, EyeOff } from "lucide-react";

const passwordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(8, "Password must be at least 8 characters"),
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z
      .string()
      .min(8, "Password must be at least 8 characters"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });
type PasswordForm = z.infer<typeof passwordSchema>;

export function ChangePasswordModal({ close }: { close: () => void }) {
  const { changePassword } = useAuthStore();

  const [show, setShow] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const form = useForm<PasswordForm>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: PasswordForm) => {
    const toastLoading = toast.loading("Updating your password…");
    const res = await changePassword(
      values.currentPassword,
      values.newPassword
    );
    toast.dismiss(toastLoading);

    if (res.error) {
      toast.error(res.error);
    } else {
      toast.success("Password updated successfully!");
      form.reset();
      close();
    }
  };

  const toggleShow = (field: keyof typeof show) =>
    setShow((prev) => ({ ...prev, [field]: !prev[field] }));

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 p-4">
        {/* Current Password */}
        <FormField
          control={form.control}
          name="currentPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Current Password</FormLabel>
              <FormControl>
                <div className="relative">
                  <Lock
                    className="text-muted-foreground absolute top-3 left-3"
                    size={18}
                  />
                  <Input
                    type={show.current ? "text" : "password"}
                    className="pr-10 pl-10"
                    placeholder="Enter current password"
                    {...field}
                  />
                  <button
                    type="button"
                    onClick={() => toggleShow("current")}
                    className="text-muted-foreground absolute top-3 right-3"
                  >
                    {show.current ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* New Password */}
        <FormField
          control={form.control}
          name="newPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>New Password</FormLabel>
              <FormControl>
                <div className="relative">
                  <Lock
                    className="text-muted-foreground absolute top-3 left-3"
                    size={18}
                  />
                  <Input
                    type={show.new ? "text" : "password"}
                    className="pr-10 pl-10"
                    placeholder="Enter new password"
                    {...field}
                  />
                  <button
                    type="button"
                    onClick={() => toggleShow("new")}
                    className="text-muted-foreground absolute top-3 right-3"
                  >
                    {show.new ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Confirm Password */}
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <div className="relative">
                  <Lock
                    className="text-muted-foreground absolute top-3 left-3"
                    size={18}
                  />
                  <Input
                    type={show.confirm ? "text" : "password"}
                    className="pr-10 pl-10"
                    placeholder="Confirm new password"
                    {...field}
                  />
                  <button
                    type="button"
                    onClick={() => toggleShow("confirm")}
                    className="text-muted-foreground absolute top-3 right-3"
                  >
                    {show.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          Update Password
        </Button>
      </form>
    </Form>
  );
}
