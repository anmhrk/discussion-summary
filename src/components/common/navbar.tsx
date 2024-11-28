"use client";

import { ThemeToggle } from "./theme-toggle";
import { History } from "./history";
import { LogoutButton } from "@/components/common/logout-button";
import useAuthStore from "@/lib/useAuthStore";

export const Navbar = () => {
  const { isAuthenticated } = useAuthStore();

  return (
    <nav className="fixed top-0 left-0 w-dvw py-3 px-3 justify-between flex flex-row items-center z-30">
      <div className="flex flex-row gap-3 items-center">
        <History />
      </div>
      <div className="flex flex-row gap-3 items-center">
        {isAuthenticated && <LogoutButton />}
        <ThemeToggle />
      </div>
    </nav>
  );
};
