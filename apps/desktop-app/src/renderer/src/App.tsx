import { Suspense } from "react";
import { HashRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import { useAuthStore } from "./stores/useAuthStore";
import { Toaster } from "@renderer/components/ui/sonner";

const App = (): React.JSX.Element => {
  const { user } = useAuthStore();
  const htmlClasses = document.documentElement.className;
  const theme = htmlClasses.includes("dark") ? "dark" : "light";

  return (
    <HashRouter>
      <Suspense fallback={<div className="p-6 text-center">Loading...</div>}>
        <AppRoutes isAuthenticated={!!user} />
      </Suspense>
      <Toaster theme={theme} richColors position="top-right" />
    </HashRouter>
  );
};

export default App;
