import { Suspense } from "react";
import { HashRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import { AuthProvider } from "./services/AuthProvider";
import { Toaster } from "@renderer/components/ui/sonner";
import { useFullSync } from "@renderer/hooks/useSync";

const App = (): React.JSX.Element => {
  useFullSync();
  const htmlClasses = document.documentElement.className;
  const theme = htmlClasses.includes("dark") ? "dark" : "light";

  return (
    <HashRouter>
      <AuthProvider>
        <Suspense fallback={<div className="p-6 text-center">Loading...</div>}>
          <AppRoutes />
        </Suspense>
        <Toaster theme={theme} richColors position="top-right" />
      </AuthProvider>
    </HashRouter>
  );
};

export default App;
