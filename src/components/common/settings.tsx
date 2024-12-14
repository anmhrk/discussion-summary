import Link from "next/link";
import { DropdownMenuItem, DropdownMenuSeparator } from "../ui/dropdown-menu";
import { GitIcon } from "./icons";
import { MailIcon, Menu, Moon, Sun } from "lucide-react";
import { History } from "./history";
import { useState } from "react";
import { useTheme } from "next-themes";

export const Settings = () => {
  const [isHistoryVisible, setIsHistoryVisible] = useState(false);
  const { theme } = useTheme();
  const { setTheme } = useTheme();

  return (
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
        onClick={(e) => {
          e.preventDefault();
          setTheme(theme === "dark" ? "light" : "dark");
        }}
      >
        {theme === "dark" ? (
          <Sun className="h-4 w-4" />
        ) : (
          <Moon className="h-4 w-4" />
        )}
        {theme === "dark" ? "Light mode" : "Dark mode"}
      </DropdownMenuItem>
      <DropdownMenuSeparator />
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
