"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Typography from "@/components/ui/Typography";
import { Mail, Lock, Eye, EyeOff, User, IdCard } from "lucide-react";

const profileSchema = z
  .object({
    email: z.string().email("Invalid email address"),
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

type ProfileForm = z.infer<typeof profileSchema>;

export default function ProfileForms() {
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const form = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      email: "",
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (values: ProfileForm) => {
    console.log(values);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Typography variant="h2">Profile Settings</Typography>
            <Typography variant="p" className="text-muted-foreground mb-6">
              Manage your account information and security.
            </Typography>
          </div>

          {/* Personal Info */}
          <div className="bg-card rounded-2xl p-6 shadow-md transition hover:shadow-lg">
            <Typography variant="h4" className="mb-4">
              Personal Information
            </Typography>

            <div className="space-y-4">
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <div className="relative">
                  <User
                    className="text-muted-foreground absolute top-3 left-3"
                    size={18}
                  />
                  <Input
                    className="pl-10"
                    value="Student D User"
                    disabled
                    readOnly
                  />
                </div>
                <Typography variant="small" className="text-muted-foreground">
                  This field cannot be modified
                </Typography>
              </FormItem>

              <FormItem>
                <FormLabel>Student ID</FormLabel>
                <div className="relative">
                  <IdCard
                    className="text-muted-foreground absolute top-3 left-3"
                    size={18}
                  />
                  <Input
                    className="pl-10"
                    value="2020-000000"
                    disabled
                    readOnly
                  />
                </div>
                <Typography variant="small" className="text-muted-foreground">
                  This field cannot be modified
                </Typography>
              </FormItem>
            </div>
          </div>

          {/* Account Security */}
          <div className="bg-card space-y-4 rounded-2xl p-6 shadow-md transition hover:shadow-lg">
            <Typography variant="h4" className="mb-4">
              Account Security
            </Typography>

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Mail
                        className="text-muted-foreground absolute top-3 left-3"
                        size={18}
                      />
                      <Input
                        placeholder="Enter email address"
                        className="pl-10"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                        type={showPassword.current ? "text" : "password"}
                        placeholder="Enter Current Password"
                        className="pr-10 pl-10"
                        {...field}
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowPassword((prev) => ({
                            ...prev,
                            current: !prev.current,
                          }))
                        }
                        className="text-muted-foreground absolute top-3 right-3"
                      >
                        {showPassword.current ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
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
                        type={showPassword.new ? "text" : "password"}
                        placeholder="Enter New Password"
                        className="pr-10 pl-10"
                        {...field}
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowPassword((prev) => ({
                            ...prev,
                            new: !prev.new,
                          }))
                        }
                        className="text-muted-foreground absolute top-3 right-3"
                      >
                        {showPassword.new ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
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
                  <FormLabel>Confirm New Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock
                        className="text-muted-foreground absolute top-3 left-3"
                        size={18}
                      />
                      <Input
                        type={showPassword.confirm ? "text" : "password"}
                        placeholder="Enter Confirm New Password"
                        className="pr-10 pl-10"
                        {...field}
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowPassword((prev) => ({
                            ...prev,
                            confirm: !prev.confirm,
                          }))
                        }
                        className="text-muted-foreground absolute top-3 right-3"
                      >
                        {showPassword.confirm ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="mt-6 w-full">
              Save Changes
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
