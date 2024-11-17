import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./theme-toggle";
import { History } from "./history";
import { GitIcon } from "@/components/icons";

export const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 w-dvw py-3 px-3 justify-between flex flex-row items-center z-30">
      <History />
      <div className="flex flex-row gap-3 items-center">
        <Link href="https://github.com/anmolhurkat/discussion-summary">
          <Button className="py-1.5 px-2 h-fit font-semibold rounded-lg">
            <GitIcon />
            GitHub
          </Button>
        </Link>
        <ThemeToggle />
      </div>
    </nav>
  );
};
