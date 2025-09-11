import * as React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Users, Vote, BarChart, Settings } from "lucide-react"; // Example icons

const SideNav = (): React.JSX.Element => {
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const location = useLocation();

  const navItems = [
    { label: "Dashboard", path: "/dashboard", icon: <Home /> },
    { label: "Elections", path: "/elections", icon: <Vote /> },
    { label: "Candidates", path: "/candidates", icon: <Users /> },
    { label: "Reports", path: "/reports", icon: <BarChart /> },
  ];

  return (
    <aside
      className={`bg-BGdark dark:bg-BGlight text-TEXTlight dark:text-TEXTdark h-screen transition-all duration-300 ${
        isCollapsed ? "w-20" : "w-64"
      } flex flex-col`}
    >
      {/* Logo / Toggle */}
      <div className="flex items-center justify-between p-4">
        {!isCollapsed && <h1 className="text-lg font-bold">S8CVote</h1>}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hover:bg-BGlight/10 rounded-md p-2"
        >
          {isCollapsed ? "»" : "«"}
        </button>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 space-y-2 p-2">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3 rounded-md px-3 py-2 transition-colors ${
              location.pathname === item.path
                ? "bg-primary text-primary-foreground"
                : "hover:bg-BGlight/10"
            }`}
          >
            {item.icon}
            {!isCollapsed && <span>{item.label}</span>}
          </Link>
        ))}
      </nav>

      {/* Bottom Section */}
      <div className="p-4">
        <Link
          to="/settings"
          className="hover:bg-BGlight/10 flex items-center gap-3 rounded-md px-3 py-2"
        >
          <Settings />
          {!isCollapsed && <span>Settings</span>}
        </Link>
      </div>
    </aside>
  );
};

export default SideNav;
