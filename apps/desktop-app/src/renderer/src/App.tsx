import { Suspense } from "react";
import { HashRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import { useAuthStore } from "./stores/useAuthStore";

const App = (): React.JSX.Element => {
  // TODO: Replace this entirely
  const { user } = useAuthStore();

  return (
    <HashRouter>
      <Suspense fallback={<div className="p-6 text-center">Loading...</div>}>
        <AppRoutes isAuthenticated={!!user} />
      </Suspense>
    </HashRouter>
  );
};

export default App;
