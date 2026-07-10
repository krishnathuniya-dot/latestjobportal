import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../pages/Sidebar";

export default function Adminnav() {
  return (
   <div
  className="admin-layout"
  style={{
    display: "flex",
    minHeight: "100vh",
    width: "100%",
  }}
>
  <aside
    className="sidebar-wrapper"
    style={{
      width: "260px",
      minWidth: "260px",
      flexShrink: 0,
      height: "100vh",
    }}
  >
    <Sidebar />
  </aside>

  <main
    className="content-wrapper"
    style={{
      flex: 1,
      minWidth: 0,
      minHeight: "100vh",
      overflowY: "auto",
      background: "#f8fafc",
    }}
  >
    <Outlet />
  </main>
</div>
  );
}