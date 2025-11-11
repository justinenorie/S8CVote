import { useNavigate } from "react-router-dom";
import Typography from "@renderer/components/ui/Typography";
import { Button } from "@renderer/components/ui/Button";
import { MoveLeft } from "lucide-react";

export default function PendingApproval() {
  const navigate = useNavigate();

  return (
    <div className="bg-BGlight text-TEXTdark dark:text-TEXTlight dark:bg-BGdark grid h-screen place-content-center space-y-5 text-center">
      <Typography variant="h1" className="mb-2">
        Account pending approval
      </Typography>
      <Typography variant="p" className="text-muted-foreground">
        An existing admin must approve your account before you can access the
        dashboard.
      </Typography>

      <Button
        onClick={() => navigate("/")}
        variant="ghost"
        className="flex w-fit cursor-pointer items-center place-self-center"
      >
        <MoveLeft />
        Back to Login
      </Button>
    </div>
  );
}
