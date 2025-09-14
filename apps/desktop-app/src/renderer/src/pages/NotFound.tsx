import { Link } from "react-router-dom";
import Typography from "@renderer/components/ui/Typography";
import { Button } from "@renderer/components/ui/Button";

const NotFound = (): React.JSX.Element => {
  return (
    <div className="text-TEXTdark dark:text-TEXTlight flex h-full flex-col items-center justify-center text-center">
      <Typography
        variant="h1"
        className="text-ERRORlight dark:text-ERRORlight mb-4 text-8xl font-bold"
      >
        404
      </Typography>
      <Typography variant="h3" className="mb-2">
        Oops! Page not found.
      </Typography>
      <Typography variant="p" className="mb-6 text-gray-500">
        The page you are looking for does not exist or has been moved.
      </Typography>

      <Button variant="default">
        <Link to="/dashboard" className="rounded-lg text-white transition">
          ⬅ Back to Dashboard
        </Link>
      </Button>
    </div>
  );
};

export default NotFound;
