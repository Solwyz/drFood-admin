import React from "react";
import Sidebar from "./section/sidebar/Sidebar";
import Header from "./section/header/Header";
import { Outlet } from "react-router-dom";

function Layout() {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-auto">
        <Header />
        <main className="p-4 flex-1 bg-[#F2F1ED] max-w-screen-xl overflow-y-auto">
          <Outlet/>
        </main>
      </div>
    </div>
  );
}

export default Layout;
