"use client";

import { useEffect, useState } from "react";
import { Key } from "lucide-react";
import { ThemeToggle } from "./_components/theme-toggle";
import { Loading } from "@/components/loading";

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
    setIsLoading(true);
    try {
      const response = await fetch("/api/token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: accessToken }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("canvasApiToken", accessToken);
        setIsValidToken(true);
        setIsLoading(false);
        toast.success("API token validated successfully");
      } else {
        setIsLoading(false);
        toast.error(data.error || "Failed to validate API token");
      }
    } catch (error) {
      setIsLoading(false);
      toast.error("An unexpected error occurred");
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
            <ThemeToggle />
          </div>
          <CardDescription className="text-gray-600 dark:text-[#86868B] mt-2">
            Summarize Canvas discussion posts with ease
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          {!isValidToken ? (
            <div className="space-y-4">
              <Label
                htmlFor="api-token"
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Canvas API Access Token
              </Label>
              <div className="flex space-x-2">
                <Input
                  id="token"
                  type="password"
                  placeholder="Enter your API access token"
                  value={accessToken}
                  onChange={(e) => setAccessToken(e.target.value)}
                  className="flex-grow rounded-lg border-gray-300 dark:border-[#2D2D2F] dark:bg-[#1D1D1F] dark:text-white focus:ring-2 focus:ring-[#2997FF] dark:focus:ring-[#2997FF] focus:border-transparent"
                />
                <Button
                  onClick={handleTokenSubmit}
                  className="bg-[#2997FF] hover:bg-[#147CE5] text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                >
                  {isLoading ? (
                    <Loading />
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
            <div>Valid token</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
