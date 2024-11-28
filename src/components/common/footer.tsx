import { MailIcon } from "lucide-react";
import Link from "next/link";
import { GitIcon, SlashIcon } from "./icons";

export const Footer = () => {
  return (
    <footer className="bg-gray-100 dark:bg-[#1D1D1F] py-3 px-8 text-center text-sm text-gray-600 dark:text-gray-400">
      <div className="max-w-4xl mx-auto flex justify-center items-center space-x-2">
        <div className="flex items-center justify-center space-x-1 hover:text-black dark:hover:text-gray-200">
          <GitIcon />
          <Link
            href="https://github.com/anmolhurkat/discussion-summary"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline transition-colors"
          >
            GitHub
          </Link>
        </div>
        <SlashIcon />
        <div className="flex items-center justify-center space-x-1 hover:text-black dark:hover:text-gray-200">
          <MailIcon className="h-4 w-4" />
          <Link
            href="mailto:ahurkat@asu.edu"
            className="hover:underline transition-colors"
          >
            Send feedback
          </Link>
        </div>
      </div>
    </footer>
  );
};
