"use client";

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
import { Key, LinkIcon, LogOut, RefreshCw } from "lucide-react";
import { useState } from "react";

export const Config = () => {
  const [isValidToken, setIsValidToken] = useState(false);
  const [accessToken, setAccessToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedClass, setSelectedClass] = useState("");
  const [discussionLink, setDiscussionLink] = useState("");
  const [customPrompt, setCustomPrompt] = useState("");

  return (
    <div className="w-80 flex-shrink-0">
      <Card className="bg-white dark:bg-[#1D1D1F] shadow-sm h-[calc(100vh-5.4rem)]">
        <div className="p-6 flex flex-col h-full">
          <div className="flex-1 space-y-6">
            {!isValidToken ? (
              <div className="space-y-3">
                <div>
                  <Label
                    htmlFor="api-token"
                    className="text-sm font-semibold text-gray-700 dark:text-gray-300"
                  >
                    Canvas API Token
                  </Label>
                  <div className="mt-1.5">
                    <Input
                      id="api-token"
                      type="password"
                      placeholder="Enter your Canvas API token"
                      value={accessToken}
                      onChange={(e) => setAccessToken(e.target.value)}
                    />
                  </div>
                </div>
                <Button
                  onClick={() => setIsValidToken(true)}
                  disabled={isLoading}
                  className="w-full bg-[#2997FF] hover:bg-[#147CE5] text-white"
                >
                  <Key className="w-4 h-4 mr-2" />
                  {isLoading ? "Validating..." : "Submit Token"}
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <Label
                    htmlFor="class-select"
                    className="text-sm font-medium text-gray-700 dark:text-gray-300"
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
                    className="text-sm font-medium text-gray-700 dark:text-gray-300"
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
                    className="text-sm font-medium text-gray-700 dark:text-gray-300"
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
                    className="w-full bg-[#2997FF] hover:bg-[#147CE5] text-white"
                  >
                    <LinkIcon className="w-4 h-4 mr-2" />
                    {isLoading ? "Summarizing..." : "Summarize"}
                  </Button>
                  <Button
                    onClick={() => {}}
                    variant="secondary"
                    className="w-full"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Reset
                  </Button>
                </div>
              </div>
            )}
          </div>
          <div className="pt-6">
            <Button
              onClick={() => setIsValidToken(false)}
              variant="secondary"
              className="w-full"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};
