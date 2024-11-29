import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { ThemeToggle } from "./theme-toggle";
import { Settings } from "./settings";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { SettingsIcon } from "lucide-react";

export const PageWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="overflow-auto bg-gray-50 dark:bg-black text-gray-900 dark:text-white p-8 mt-6">
      <Card className="max-w-2xl mx-auto bg-white dark:bg-[#1D1D1F] shadow-lg rounded-2xl overflow-hidden border-0">
        <CardHeader className="bg-gray-100/50 dark:bg-[#1D1D1F] p-6 border-b border-gray-200 dark:border-[#2D2D2F]">
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl font-semibold">
              Canvas Discussion Summarizer
            </CardTitle>
            <div className="flex items-center space-x-2">
              <ThemeToggle />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="custom"
                    className="p-2 h-fit rounded-full transition-colors"
                  >
                    <SettingsIcon />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <Settings />
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <CardDescription className="text-gray-600 dark:text-[#86868B] mt-2">
            Generate summaries of Human Event discussion posts in seconds
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-6">{children}</CardContent>
      </Card>
    </main>
  );
};
