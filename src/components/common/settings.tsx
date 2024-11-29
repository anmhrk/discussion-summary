import Link from "next/link";
import { DropdownMenuItem, DropdownMenuSeparator } from "../ui/dropdown-menu";
import { GitIcon } from "./icons";
import { LogOut, MailIcon, Menu } from "lucide-react";
import { History } from "./history";
import useAuthStore from "@/lib/useAuthStore";
import { useState } from "react";

export const Settings = () => {
  const { isAuthenticated, logout } = useAuthStore();
  const [isHistoryVisible, setIsHistoryVisible] = useState(false);

  return (
    <>
      {isAuthenticated && (
        <>
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={(e) => {
              e.preventDefault();
              setIsHistoryVisible(true);
            }}
          >
            <Menu className="h-4 w-4" />
            View history
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => {
              logout();
            }}
          >
            <LogOut className="w-5 h-5" />
            Logout
          </DropdownMenuItem>
          <DropdownMenuSeparator />
        </>
      )}
      <DropdownMenuItem>
        <Link
          href="https://github.com/anmolhurkat/discussion-summary"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2"
        >
          <GitIcon />
          View source code
        </Link>
      </DropdownMenuItem>
      <DropdownMenuItem>
        <Link
          href="mailto:ahurkat@asu.edu"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2"
        >
          <MailIcon className="h-4 w-4" />
          Send feedback
        </Link>
      </DropdownMenuItem>

      {isHistoryVisible && (
        <History
          isHistoryVisible={isHistoryVisible}
          setIsHistoryVisible={setIsHistoryVisible}
        />
      )}
    </>
  );
};
