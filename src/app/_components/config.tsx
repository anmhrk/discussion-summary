"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Key, LinkIcon, LogOut, PlusIcon } from "lucide-react";
import { InfoIcon, Spinner } from "@/components/icons";
import { tokenSchema } from "@/lib/schema";
import { toast } from "sonner";
import { ZodError } from "zod";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
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

export const Config = () => {
  const [accessToken, setAccessToken] = useState("");
  const [isValidToken, setIsValidToken] = useState(false);
  const [isCheckingToken, setIsCheckingToken] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedClass, setSelectedClass] = useState("");
  const [discussionLink, setDiscussionLink] = useState("");
  const [customPrompt, setCustomPrompt] = useState("");

  const insertUser = useMutation(api.user.createUser);

  useEffect(() => {
    const token = localStorage.getItem("canvasApiToken");

    if (token) {
      setIsValidToken(true);
    }
    setIsCheckingToken(false);
  }, []);

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
        const { userData } = data;
        localStorage.setItem("canvasApiToken", accessToken);
        toast.success("API token validated successfully", {
          position: "top-center",
        });
        setIsValidToken(true);
        insertUser({ name: userData.name, userId: userData.userId });
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

  if (isCheckingToken) return null;

  return (
    <div className="w-80 flex-shrink-0">
      <Card className="bg-white dark:bg-[#1D1D1F] shadow-sm h-[calc(100vh-5.4rem)]">
        <div className="p-6 flex flex-col h-full">
          {!isValidToken ? (
            <div className="space-y-10">
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label
                    htmlFor="api-token"
                    className="text-sm font-semibold text-gray-700 dark:text-gray-300"
                  >
                    Canvas API Access Token
                  </Label>
                  <Input
                    id="api-token"
                    type="password"
                    placeholder="Enter your token here"
                    value={accessToken}
                    onChange={(e) => setAccessToken(e.target.value)}
                    className="flex-grow rounded-lg border-gray-300 dark:border-[#2D2D2F] dark:bg-[#1D1D1F] dark:text-white focus:ring-2 focus:ring-[#2997FF] dark:focus:ring-[#2997FF] focus:border-transparent"
                  />
                </div>
                <Button
                  onClick={handleTokenSubmit}
                  disabled={isLoading}
                  className="w-full bg-[#2997FF] hover:bg-[#147CE5] text-white font-semibold py-2 px-4 rounded-lg transition-colors"
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
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Note: Token is stored locally in the browser.
                </p>
              </div>
              <div className="shadow-sm bg-muted/50 rounded-2xl p-6 flex flex-col gap-4 text-zinc-500 text-sm dark:text-zinc-400 dark:border-gray-700">
                <p className="flex flex-row justify-center gap-4 items-center">
                  <InfoIcon />
                  <span className="font-semibold">How to get your token</span>
                </p>
                <ol className="list-decimal list-inside space-y-1">
                  <li>Login to canvas.asu.edu</li>
                  <li>Click on account on the sidebar</li>
                  <li>Click on settings</li>
                  <li>
                    Under "Approved Integrations" click on "New Access Token"
                  </li>
                  <li>
                    Enter a purpose (optional) and leave the expiry date blank
                  </li>
                  <li>Click on "Generate token"</li>
                </ol>
              </div>
            </div>
          ) : (
            <>
              <div className="flex-1 space-y-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="class-select"
                    className="text-sm font-semibold text-gray-700 dark:text-gray-300"
                  >
                    Select Class
                  </Label>
                  <Select
                    onValueChange={setSelectedClass}
                    value={selectedClass}
                  >
                    <SelectTrigger className="mt-1.5">
                      <SelectValue placeholder="Select a class" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="HON 171">HON 171</SelectItem>
                      <SelectItem value="HON 272">HON 272</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label
                    htmlFor="discussion-link"
                    className="text-sm font-semibold text-gray-700 dark:text-gray-300"
                  >
                    Discussion Link
                  </Label>
                  <div className="mt-1.5">
                    <Input
                      id="discussion-link"
                      type="text"
                      placeholder="Paste your Canvas discussion link"
                      value={discussionLink}
                      onChange={(e) => setDiscussionLink(e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <Label
                    htmlFor="custom-prompt"
                    className="text-sm font-semibold text-gray-700 dark:text-gray-300"
                  >
                    Custom Prompt (Optional)
                  </Label>
                  <div className="mt-1.5">
                    <Textarea
                      id="custom-prompt"
                      placeholder="Enter a custom prompt for the LLM"
                      value={customPrompt}
                      onChange={(e) => setCustomPrompt(e.target.value)}
                      className="min-h-[100px]"
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <Button
                    onClick={() => {}}
                    disabled={isLoading}
                    className="w-full bg-[#2997FF] hover:bg-[#147CE5] text-white font-semibold rounded-lg"
                  >
                    <LinkIcon className="w-4 h-4" />
                    {isLoading ? "Generating..." : "Generate"}
                  </Button>
                  <Button
                    onClick={() => {}}
                    variant="custom"
                    className="w-full"
                  >
                    <PlusIcon className="w-4 h-4" />
                    New discussion
                  </Button>
                </div>
              </div>
              <div className="mt-auto pt-6">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="custom" className="w-full">
                      <LogOut className="w-4 h-4" />
                      Logout
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
            </>
          )}
        </div>
      </Card>
    </div>
  );
};
