import { Suspense, useState, useEffect } from "react";
import { HashRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";

const App = (): React.JSX.Element => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    localStorage.getItem("isAuthenticated") === "true"
  );

  useEffect(() => {
    localStorage.setItem("isAuthenticated", String(isAuthenticated));
  }, [isAuthenticated]);

  return (
    <HashRouter>
      <Suspense fallback={<div className="p-6 text-center">Loading...</div>}>
        <AppRoutes
          isAuthenticated={isAuthenticated}
          setIsAuthenticated={setIsAuthenticated}
        />
      </Suspense>
    </HashRouter>
  );
};

export default App;
