import { Link } from "react-router-dom";

const NotFound = (): React.JSX.Element => {
  return (
    <div className="flex h-full flex-col items-center justify-center text-center">
      <h1 className="mb-4 text-6xl font-bold text-red-500">404</h1>
      <p className="mb-2 text-xl">Oops! Page not found.</p>
      <p className="mb-6 text-gray-500">
        The page you are looking for does not exist or has been moved.
      </p>

      <Link
        to="/dashboard"
        className="bg-primary hover:bg-primary/90 rounded-lg px-6 py-3 text-white transition"
      >
        ⬅ Back to Dashboard
      </Link>
    </div>
  );
};

export default NotFound;
