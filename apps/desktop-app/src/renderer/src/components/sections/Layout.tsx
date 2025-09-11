import * as React from "react";
import { Outlet } from "react-router-dom";
import SideNav from "./SideNav";

const Layout = (): React.JSX.Element => {
  return (
    <div className="flex h-screen w-screen overflow-hidden">
      {/* Sidebar */}
      <SideNav />

      {/* Main Content */}
      <main className="bg-BGlight dark:bg-BGdark flex-1 overflow-y-auto p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
