import { Link } from "react-router-dom";

const Candidates = (): React.JSX.Element => {
  return (
    <div className="bg-blue-500">
      Elections
      <Link to="/dashboard">
        <button className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700">
          Go to Dashboard
        </button>
      </Link>
    </div>
  );
};

export default Candidates;
