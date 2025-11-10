"use client";

import { useState, useEffect } from "react";
// import { useForm } from "react-hook-form";
// import { z } from "zod";
// import { zodResolver } from "@hookform/resolvers/zod";
// import {
//   Form,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormControl,
//   FormMessage,
// } from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
// import { toast } from "sonner";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Typography from "@/components/ui/Typography";
import { SquarePen, KeyRound } from "lucide-react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { ChangeEmailModal } from "@/components/profile/ChangeEmailModal";
import { ChangePasswordModal } from "./ChangePasswordModal";
import { useAuthStore } from "@/stores/useAuthStores";

// const changeEmailSchema = z.object({
//   email: z.string().email("Invalid email address"),
// });
// type EmailForm = z.infer<typeof changeEmailSchema>;

// const passwordSchema = z
//   .object({
//     // email: z.string().email("Invalid email address"),
//     currentPassword: z
//       .string()
//       .min(8, "Password must be at least 8 characters"),
//     newPassword: z.string().min(8, "Password must be at least 8 characters"),
//     confirmPassword: z
//       .string()
//       .min(8, "Password must be at least 8 characters"),
//   })
//   .refine((data) => data.newPassword === data.confirmPassword, {
//     path: ["confirmPassword"],
//     message: "Passwords do not match",
//   });
// type PasswordForm = z.infer<typeof passwordSchema>;

export default function ProfileForms() {
  const { profile, getCurrentUser } = useAuthStore();

  const [emailOpen, setEmailOpen] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  // const [isLoadingEmail, setIsLoadingEmail] = useState(false);
  // const [isLoadingPassword, setIsLoadingPassword] = useState(false);
  // const [showPassword, setShowPassword] = useState({
  //   current: false,
  //   new: false,
  //   confirm: false,
  // });

  // const emailForm = useForm<EmailForm>({
  //   resolver: zodResolver(changeEmailSchema),
  //   defaultValues: {
  //     email: "",
  //   },
  // });

  // const passwordForm = useForm<PasswordForm>({
  //   resolver: zodResolver(passwordSchema),
  //   defaultValues: {
  //     currentPassword: "",
  //     newPassword: "",
  //     confirmPassword: "",
  //   },
  // });

  // Render the current user
  useEffect(() => {
    getCurrentUser();
  }, [getCurrentUser]);

  // const onEmailSubmit = async (values: EmailForm) => {
  //   setIsLoadingEmail(true);
  //   const toastLoading = toast.loading("Updating email...");

  //   const res = await updateEmail(values.email);

  //   toast.dismiss(toastLoading);

  //   if (res.error) {
  //     toast.error(res.error);
  //   } else {
  //     toast.success("Check your new email inbox to confirm the change!");
  //     emailForm.reset();
  //     getCurrentUser();
  //   }
  //   setIsLoadingEmail(false);
  // };

  // const onPasswordSubmit = async (values: PasswordForm) => {
  //   setIsLoadingPassword(true);
  //   const toastLoading = toast.loading("Updating your password...");
  //   const res = await changePassword(
  //     values.currentPassword,
  //     values.newPassword
  //   );

  //   toast.dismiss(toastLoading);

  //   if (res.error) {
  //     toast.error(res.error);
  //   } else {
  //     toast.success("Password updated successfully!");
  //     passwordForm.reset();
  //   }
  //   setIsLoadingPassword(false);
  // };

  return (
    <div className="space-y-6">
      <div className="bg-card space-y-4 rounded-2xl p-6 shadow-md transition hover:shadow-lg">
        <Typography variant="h4" className="mb-4">
          My Information
        </Typography>
        <div className="space-y-1">
          <Typography variant="small">Full Name</Typography>
          <Typography variant="p" className="rounded-lg border p-3 shadow-md">
            {profile?.fullname ?? ""}
          </Typography>
        </div>

        <div className="space-y-1">
          <Typography variant="small">Student ID</Typography>
          <Typography variant="p" className="rounded-lg border p-3 shadow-md">
            {profile?.student_id ?? ""}
          </Typography>
        </div>
      </div>

      <div className="bg-card space-y-4 rounded-2xl p-6 shadow-md transition hover:shadow-lg">
        <Typography variant="h4" className="mb-4">
          Account Security
        </Typography>

        {/* Email */}
        <div className="flex flex-col space-y-1">
          <Typography variant="small" className="text-muted-foreground">
            Email
          </Typography>
          <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-md">
            <Typography variant="p" className="">
              {profile?.email}
            </Typography>
            <Button variant="outline" onClick={() => setEmailOpen(true)}>
              <SquarePen size={16} />
              <Typography className="hidden sm:block" variant="small">
                Change email
              </Typography>
            </Button>
          </div>
        </div>

        {/* Password */}
        <div className="flex flex-col space-y-1">
          <Typography variant="small" className="text-muted-foreground">
            Password
          </Typography>
          <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-md">
            <Typography variant="p">••••••••</Typography>
            <Button variant="outline" onClick={() => setPasswordOpen(true)}>
              <KeyRound size={16} />
              <Typography className="hidden sm:block" variant="small">
                Change password
              </Typography>
            </Button>
          </div>
        </div>

        {/* EMAIL MODAL / DRAWER WRAPPER */}
        <div>
          {isDesktop ? (
            <Dialog open={emailOpen} onOpenChange={setEmailOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Change Email</DialogTitle>
                  <DialogDescription>
                    Change your email then confirm it!
                  </DialogDescription>
                </DialogHeader>
                <ChangeEmailModal close={() => setEmailOpen(false)} />
              </DialogContent>
            </Dialog>
          ) : (
            <Drawer open={emailOpen} onOpenChange={setEmailOpen}>
              <DrawerContent>
                <DrawerHeader>
                  <DrawerTitle>Change Email</DrawerTitle>
                  <DrawerDescription>
                    Change your email then confirm it!
                  </DrawerDescription>
                </DrawerHeader>
                <ChangeEmailModal close={() => setEmailOpen(false)} />
              </DrawerContent>
            </Drawer>
          )}
        </div>

        {/* PASSWORD MODAL / DRAWER WRAPPER */}
        <div>
          {isDesktop ? (
            <Dialog open={passwordOpen} onOpenChange={setPasswordOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Change Password</DialogTitle>
                  <DialogDescription>
                    Enter your current and new password.
                  </DialogDescription>
                </DialogHeader>
                <ChangePasswordModal close={() => setPasswordOpen(false)} />
              </DialogContent>
            </Dialog>
          ) : (
            <Drawer open={passwordOpen} onOpenChange={setPasswordOpen}>
              <DrawerContent>
                <DrawerHeader>
                  <DrawerTitle>Change Password</DrawerTitle>
                  <DrawerDescription>
                    {" "}
                    Enter your current and new password.
                  </DrawerDescription>
                </DrawerHeader>
                <ChangePasswordModal close={() => setPasswordOpen(false)} />
              </DrawerContent>
            </Drawer>
          )}
        </div>
      </div>
    </div>

    // <div className="space-y-8">
    //   <Form {...emailForm}>
    //     <form
    //       onSubmit={emailForm.handleSubmit(onEmailSubmit)}
    //       className="space-y-4"
    //     >
    //       {/* Personal Info */}
    //       <div className="bg-card space-y-4 rounded-2xl p-6 shadow-md transition hover:shadow-lg">
    //         <Typography variant="h4" className="mb-4">
    //           Personal Information
    //         </Typography>

    //         <div className="space-y-4">
    //           <FormItem>
    //             <FormLabel>Full Name</FormLabel>
    //             <div className="relative">
    //               <User
    //                 className="text-muted-foreground absolute top-3 left-3"
    //                 size={18}
    //               />
    //               <Input
    //                 className="pl-10"
    //                 value={profile?.fullname ?? ""}
    //                 disabled
    //                 readOnly
    //               />
    //             </div>
    //             <Typography variant="small" className="text-muted-foreground">
    //               This field cannot be modified
    //             </Typography>
    //           </FormItem>

    //           <FormItem>
    //             <FormLabel>Student ID</FormLabel>
    //             <div className="relative">
    //               <IdCard
    //                 className="text-muted-foreground absolute top-3 left-3"
    //                 size={18}
    //               />
    //               <Input
    //                 className="pl-10"
    //                 value={profile?.student_id ?? ""}
    //                 disabled
    //                 readOnly
    //               />
    //             </div>
    //             <Typography variant="small" className="text-muted-foreground">
    //               This field cannot be modified
    //             </Typography>
    //           </FormItem>

    //           {/* EMAIL */}
    //           <FormField
    //             control={emailForm.control}
    //             name="email"
    //             render={({ field }) => (
    //               <FormItem>
    //                 <FormLabel>Email Address</FormLabel>
    //                 <FormControl>
    //                   <div className="relative">
    //                     <Mail
    //                       className="text-muted-foreground absolute top-3 left-3"
    //                       size={18}
    //                     />
    //                     <Input
    //                       placeholder="Enter email address"
    //                       className="pl-10"
    //                       {...field}
    //                     />
    //                   </div>
    //                 </FormControl>
    //                 <FormMessage />
    //               </FormItem>
    //             )}
    //           />

    //           <Button
    //             type="submit"
    //             disabled={isLoadingEmail}
    //             className="mt-6 w-full"
    //           >
    //             {isLoadingEmail ? "Updating your Email...." : "Update Email"}
    //           </Button>
    //         </div>
    //       </div>
    //     </form>
    //   </Form>

    //   {/* Header */}
    //   <Form {...passwordForm}>
    //     <form
    //       onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}
    //       className="space-y-4"
    //     >
    //       {/* Account Security */}
    //       <div className="bg-card space-y-4 rounded-2xl p-6 shadow-md transition hover:shadow-lg">
    //         <Typography variant="h4" className="mb-4">
    //           Account Security
    //         </Typography>

    //         {/* Current Password */}
    //         <FormField
    //           control={passwordForm.control}
    //           name="currentPassword"
    //           render={({ field }) => (
    //             <FormItem>
    //               <FormLabel>Current Password</FormLabel>
    //               <FormControl>
    //                 <div className="relative">
    //                   <Lock
    //                     className="text-muted-foreground absolute top-3 left-3"
    //                     size={18}
    //                   />
    //                   <Input
    //                     type={showPassword.current ? "text" : "password"}
    //                     placeholder="Enter Current Password"
    //                     className="pr-10 pl-10"
    //                     {...field}
    //                   />
    //                   <button
    //                     type="button"
    //                     onClick={() =>
    //                       setShowPassword((prev) => ({
    //                         ...prev,
    //                         current: !prev.current,
    //                       }))
    //                     }
    //                     className="text-muted-foreground absolute top-3 right-3"
    //                   >
    //                     {showPassword.current ? (
    //                       <EyeOff size={18} />
    //                     ) : (
    //                       <Eye size={18} />
    //                     )}
    //                   </button>
    //                 </div>
    //               </FormControl>
    //               <FormMessage />
    //             </FormItem>
    //           )}
    //         />

    //         {/* New Password */}
    //         <FormField
    //           control={passwordForm.control}
    //           name="newPassword"
    //           render={({ field }) => (
    //             <FormItem>
    //               <FormLabel>New Password</FormLabel>
    //               <FormControl>
    //                 <div className="relative">
    //                   <Lock
    //                     className="text-muted-foreground absolute top-3 left-3"
    //                     size={18}
    //                   />
    //                   <Input
    //                     type={showPassword.new ? "text" : "password"}
    //                     placeholder="Enter New Password"
    //                     className="pr-10 pl-10"
    //                     {...field}
    //                   />
    //                   <button
    //                     type="button"
    //                     onClick={() =>
    //                       setShowPassword((prev) => ({
    //                         ...prev,
    //                         new: !prev.new,
    //                       }))
    //                     }
    //                     className="text-muted-foreground absolute top-3 right-3"
    //                   >
    //                     {showPassword.new ? (
    //                       <EyeOff size={18} />
    //                     ) : (
    //                       <Eye size={18} />
    //                     )}
    //                   </button>
    //                 </div>
    //               </FormControl>
    //               <FormMessage />
    //             </FormItem>
    //           )}
    //         />

    //         {/* Confirm Password */}
    //         <FormField
    //           control={passwordForm.control}
    //           name="confirmPassword"
    //           render={({ field }) => (
    //             <FormItem>
    //               <FormLabel>Confirm New Password</FormLabel>
    //               <FormControl>
    //                 <div className="relative">
    //                   <Lock
    //                     className="text-muted-foreground absolute top-3 left-3"
    //                     size={18}
    //                   />
    //                   <Input
    //                     type={showPassword.confirm ? "text" : "password"}
    //                     placeholder="Enter Confirm New Password"
    //                     className="pr-10 pl-10"
    //                     {...field}
    //                   />
    //                   <button
    //                     type="button"
    //                     onClick={() =>
    //                       setShowPassword((prev) => ({
    //                         ...prev,
    //                         confirm: !prev.confirm,
    //                       }))
    //                     }
    //                     className="text-muted-foreground absolute top-3 right-3"
    //                   >
    //                     {showPassword.confirm ? (
    //                       <EyeOff size={18} />
    //                     ) : (
    //                       <Eye size={18} />
    //                     )}
    //                   </button>
    //                 </div>
    //               </FormControl>
    //               <FormMessage />
    //             </FormItem>
    //           )}
    //         />

    //         <Button
    //           type="submit"
    //           disabled={isLoadingPassword}
    //           className="mt-6 w-full"
    //         >
    //           {isLoadingPassword ? "Updating Password...." : "Update Password"}
    //         </Button>
    //       </div>
    //     </form>
    //   </Form>
    // </div>
  );
}
