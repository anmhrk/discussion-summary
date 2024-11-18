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
        {/* <div className="flex flex-row gap-2 items-center">
          <div className="text-zinc-500">
            <SlashIcon size={16} />
          </div>
          <div className="text-sm dark:text-zinc-300 truncate w-28 md:w-fit">
            Human Event Discussion Summarizer
          </div>
        </div> */}
      </div>
      <div className="flex flex-row gap-3 items-center">
        {isAuthenticated && <LogoutButton />}
        <ThemeToggle />
      </div>
    </nav>
  );
};
