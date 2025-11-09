import Typography from "@/components/ui/Typography";
import ProfileForms from "@/components/profile/ProfileForms";

export default function Profile() {
  return (
    <>
      <div className="mb-6">
        <Typography variant="h2">Profile Settings</Typography>
        <Typography variant="p" className="text-muted-foreground">
          Manage your account information and security.
        </Typography>
      </div>
      <ProfileForms />
    </>
  );
}
