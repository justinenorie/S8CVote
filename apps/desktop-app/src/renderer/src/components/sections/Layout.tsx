import * as React from "react";
import { Outlet } from "react-router-dom";
import SideNav from "./SideNav";

const Layout = (): React.JSX.Element => {
  return (
    <div className="shadow-PRIMARY-900 flex h-screen w-screen overflow-hidden">
      {/* Sidebar */}
      <SideNav />

      {/* Main Content */}
      <main className="bg-BGlight dark:bg-BGdark flex-1 overflow-y-auto p-6 transition-colors duration-500">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
