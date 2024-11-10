"use client";

import { useEffect, useState } from "react";
import { Key, LogOut } from "lucide-react";
import { ThemeToggle } from "./_components/theme-toggle";
import { Spinner } from "@/components/spinner";
import { Discussion } from "./_components/discussion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { tokenSchema } from "@/lib/schema";
import { ZodError } from "zod";

export default function Home() {
  useEffect(() => {
    const token = localStorage.getItem("canvasApiToken");
    if (token) {
      setIsValidToken(true);
    }
    setIsCheckingToken(false);
  }, []);

  const [accessToken, setAccessToken] = useState("");
  const [isValidToken, setIsValidToken] = useState(false);
  const [isCheckingToken, setIsCheckingToken] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleTokenSubmit = async () => {
    try {
      tokenSchema.parse({ token: accessToken });
    } catch (error) {
      if (error instanceof ZodError) {
        toast.error(error.errors[0].message, { position: "top-center" });
        return;
      }
    }

    try {
      setIsLoading(true);
      const response = await fetch("/api/token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: accessToken }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("canvasApiToken", accessToken);
        setIsValidToken(true);
        toast.success("API token validated successfully", {
          position: "top-center",
        });
      } else {
        toast.error(data.error || "Failed to validate API token", {
          position: "top-center",
        });
      }
    } catch (error) {
      toast.error("An unexpected error occurred", { position: "top-center" });
    } finally {
      setIsLoading(false);
    }
  };

  if (isCheckingToken) return;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black text-gray-900 dark:text-white p-8">
      <Card className="max-w-2xl mx-auto bg-white dark:bg-[#1D1D1F] shadow-lg rounded-2xl overflow-hidden border-0">
        <CardHeader className="bg-gray-100/50 dark:bg-[#1D1D1F] p-6 border-b border-gray-200 dark:border-[#2D2D2F]">
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl font-semibold">
              Canvas Discussion Summarizer
            </CardTitle>
            {isValidToken ? (
              <div className="flex items-center space-x-2">
                <ThemeToggle />
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="bg-gray-200 hover:bg-gray-300 dark:bg-[#2D2D2F] dark:hover:bg-[#3D3D3F] text-gray-700 dark:text-gray-300 p-2 rounded-full transition-colors"
                    >
                      <LogOut className="w-5 h-5" />
                      <span className="font-semibold">Logout</span>
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="bg-white dark:bg-[#1D1D1F] rounded-2xl p-6 shadow-xl border dark:border-[#2D2D2F]">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="text-xl font-semibold text-gray-900 dark:text-white">
                        Are you sure you want to logout?
                      </AlertDialogTitle>
                      <AlertDialogDescription className="text-gray-600 dark:text-[#86868B] mt-2">
                        If you logout, you'll have to input your API access
                        token again.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="mt-6">
                      <AlertDialogCancel className="bg-gray-100 hover:bg-gray-200 dark:bg-[#2D2D2F] dark:hover:bg-[#3D3D3F] text-gray-700 dark:text-gray-300 font-semibold py-2 px-4 rounded-lg transition-colors">
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => {
                          localStorage.removeItem("canvasApiToken");
                          localStorage.removeItem("discussionLink");
                          localStorage.removeItem("customPrompt");
                          localStorage.removeItem("summary");
                          setIsValidToken(false);
                          setAccessToken("");
                        }}
                        className="bg-red-500 hover:bg-red-600 dark:bg-[#FF453A] dark:hover:bg-[#D70015] text-white font-semibold py-2 px-4 rounded-lg transition-colors ml-3"
                      >
                        Logout
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            ) : (
              <ThemeToggle />
            )}
          </div>
          <CardDescription className="text-gray-600 dark:text-[#86868B] mt-2">
            Summarize Human Event discussion posts in seconds
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          {!isValidToken ? (
            <div className="space-y-2">
              <Label
                htmlFor="access-token"
                className="text-sm font-semibold text-gray-700 dark:text-gray-300"
              >
                Canvas API Access Token
              </Label>
              <div className="flex space-x-2">
                <Input
                  type="password"
                  placeholder="Enter your API access token"
                  value={accessToken}
                  onChange={(e) => setAccessToken(e.target.value)}
                  className="flex-grow rounded-lg border-gray-300 dark:border-[#2D2D2F] dark:bg-[#1D1D1F] dark:text-white focus:ring-2 focus:ring-[#2997FF] dark:focus:ring-[#2997FF] focus:border-transparent"
                />
                <Button
                  onClick={handleTokenSubmit}
                  disabled={isLoading}
                  className="bg-[#2997FF] hover:bg-[#147CE5] text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                >
                  {isLoading ? (
                    <Spinner />
                  ) : (
                    <>
                      <Key className="w-4 h-4" />
                      Submit
                    </>
                  )}
                </Button>
              </div>
            </div>
          ) : (
            <Discussion />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
