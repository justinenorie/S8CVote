import Typography from "../ui/Typography";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/Button";
import { Eye, EyeOff, UserRound, Save } from "lucide-react";
import React, { useState } from "react";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@renderer/components/ui/form";
import { toast } from "sonner";

// Account Details Schema
const accountDetailsSchema = z.object({
  profile: z.string().min(1, { message: "Full Name is required" }),
  name: z.string().min(1, { message: "Full Name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
});
type AccountDetailsForm = z.infer<typeof accountDetailsSchema>;

// Change Password Schema
const changePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" }),
    newPassword: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" }),
    confirmPassword: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });
type PasswordDetailsForm = z.infer<typeof changePasswordSchema>;

const GeneralTab = (): React.ReactElement => {
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const accountDetailsForm = useForm<AccountDetailsForm>({
    resolver: zodResolver(accountDetailsSchema),
    defaultValues: {
      profile: "",
      name: "",
      email: "",
    },
  });

  const changePasswordForm = useForm<PasswordDetailsForm>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmitAccountDetails = (values: AccountDetailsForm): void => {
    console.log("Account Details:", values);
    toast.success("Account details updated successfully!");
  };
  const onSubmitChangePassword = (values: PasswordDetailsForm): void => {
    console.log("Change Password:", values);
    toast.success("Password updated successfully!");
  };

  return (
    <div className="space-y-8">
      {/* Account Details */}
      <div className="bg-PRIMARY-100 dark:bg-PRIMARY-900 rounded-lg p-6 shadow-sm">
        <div className="mb-5">
          <Typography variant="h3" className="font-semibold">
            Account Details
          </Typography>
          <Typography variant="small" className="text-muted-foreground">
            Update your personal information
          </Typography>
        </div>

        <Form {...accountDetailsForm}>
          <form
            onSubmit={accountDetailsForm.handleSubmit(onSubmitAccountDetails)}
            className="flex w-full flex-col gap-4"
          >
            {/* Profile Image */}
            <FormField
              control={accountDetailsForm.control}
              name="profile"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <div className="flex flex-row items-center gap-2">
                      <Label htmlFor="file-upload">
                        <div className="bg-PRIMARY-800/50 dark:bg-PRIMARY-400/50 flex h-16 w-16 items-center justify-center rounded-full border object-cover p-2">
                          <UserRound size={40} />
                        </div>
                        <Input
                          id="file-upload"
                          type="file"
                          className="hidden"
                          {...field}
                        />
                      </Label>
                      <div className="flex flex-col">
                        <Typography variant="p">Profile Image</Typography>
                        <Typography variant="small">
                          Click the camera icon to upload a new profile picture.
                          JPG, PNG or GIF (max. 2MB)
                        </Typography>
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex flex-row gap-4">
              {/* Name */}
              <FormField
                control={accountDetailsForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Admin User"
                        {...field}
                        className="border-PRIMARY-800/50 dark:border-PRIMARY-400/50 cursor-pointer border-1"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Email */}
              <FormField
                control={accountDetailsForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="admin@example.com"
                        {...field}
                        className="border-PRIMARY-800/50 dark:border-PRIMARY-400/50 cursor-pointer border-1"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button type="submit" className="px-10 md:self-end">
              <Save className="h-10 w-10" />
              Save Changes
            </Button>
          </form>
        </Form>
      </div>

      {/* Change Password */}
      <div className="bg-PRIMARY-100 dark:bg-PRIMARY-900 rounded-lg p-6 shadow-sm">
        <Typography variant="h3" className="mb-1 font-semibold">
          Change Password
        </Typography>
        <Typography variant="p" className="text-muted-foreground mb-5 text-sm">
          Update your password to keep your account secure
        </Typography>

        <Form {...changePasswordForm}>
          <form
            onSubmit={changePasswordForm.handleSubmit(onSubmitChangePassword)}
            className="grid gap-4 md:grid-cols-2"
          >
            {/* Current Password */}
            <FormField
              control={changePasswordForm.control}
              name="currentPassword"
              render={({ field }) => (
                <FormItem className="relative md:col-span-2">
                  <FormLabel>Current Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        className="border-PRIMARY-800/50 dark:border-PRIMARY-400/50 cursor-pointer border-1"
                        type={showPassword.current ? "text" : "password"}
                        placeholder="Enter Current Password"
                        {...field}
                      />
                      <button
                        type="button"
                        className="text-muted-foreground absolute top-2.5 right-3"
                        onClick={() =>
                          setShowPassword((prev) => ({
                            ...prev,
                            current: !prev.current,
                          }))
                        }
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
              control={changePasswordForm.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem className="relative">
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        className="border-PRIMARY-800/50 dark:border-PRIMARY-400/50 cursor-pointer border-1"
                        type={showPassword.new ? "text" : "password"}
                        placeholder="Enter New Password"
                        {...field}
                      />
                      <button
                        type="button"
                        className="text-muted-foreground absolute top-2.5 right-3"
                        onClick={() =>
                          setShowPassword((prev) => ({
                            ...prev,
                            new: !prev.new,
                          }))
                        }
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
              control={changePasswordForm.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem className="relative">
                  <FormLabel>Confirm New Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        className="border-PRIMARY-800/50 dark:border-PRIMARY-400/50 cursor-pointer border-1"
                        type={showPassword.confirm ? "text" : "password"}
                        placeholder="Enter Confirm New Password"
                        {...field}
                      />
                      <button
                        type="button"
                        className="text-muted-foreground absolute top-2.5 right-3"
                        onClick={() =>
                          setShowPassword((prev) => ({
                            ...prev,
                            confirm: !prev.confirm,
                          }))
                        }
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
            <Button
              type="submit"
              className="px-6 md:col-span-2 md:justify-self-end"
            >
              <Save className="h-10 w-10" />
              Update Password
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default GeneralTab;
