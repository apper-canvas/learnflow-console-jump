import React from "react";
import Header from "@/components/organisms/Header";

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="min-h-[calc(100vh-4rem)]">
        {children}
      </main>
    </div>
  );
};

export default Layout;