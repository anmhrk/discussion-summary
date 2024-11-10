import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { LinkIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const Discussion = () => {
  const token = localStorage.getItem("canvasApiToken");
  const [discussionLink, setDiscussionLink] = useState("");
  const [customPrompt, setCustomPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [summary, setSummary] = useState("");

  const handleSummarize = async () => {
    setIsLoading(true);
    setShowSummary(false);
    try {
      const response = await fetch("/api/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ link: discussionLink, customPrompt, token }),
      });

      const data = await response.json();

      if (response.ok) {
        setSummary(data.summary);
        setIsLoading(false);
        setShowSummary(true);
      } else {
        setIsLoading(false);
        toast.error(data.error || "Failed to fetch posts");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    }
  };

  return (
    <>
      <div className="space-y-2">
        <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Discussion Link
        </Label>
        <div className="flex space-x-2">
          <Input
            type="url"
            placeholder="Paste your Canvas discussion link here"
            value={discussionLink}
            onChange={(e) => setDiscussionLink(e.target.value)}
            className="rounded-lg border-gray-300 dark:border-[#2D2D2F] dark:bg-[#1D1D1F] dark:text-white focus:ring-2 focus:ring-[#2997FF] dark:focus:ring-[#2997FF] focus:border-transparent"
          />
          <Button
            onClick={handleSummarize}
            disabled={isLoading}
            className="bg-[#2997FF] hover:bg-[#147CE5] text-white font-semibold py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <LinkIcon className="w-4 h-4" />
            {isLoading ? "Summarizing..." : "Summarize"}
          </Button>
        </div>
      </div>
      <div className="space-y-2">
        <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Custom Prompt (Optional)
        </Label>
        <Textarea
          placeholder="Example: 'What is the most common theme covered in the discussion?'... Leave blank for default summary"
          value={customPrompt}
          onChange={(e) => setCustomPrompt(e.target.value)}
          className="w-full rounded-lg border-gray-300 dark:border-[#2D2D2F] dark:bg-[#1D1D1F] dark:text-white focus:ring-2 h-24 focus:ring-[#2997FF] dark:focus:ring-[#2997FF] focus:border-transparent"
        />
      </div>
      {isLoading ? (
        <div className="space-y-2">
          <Label
            htmlFor="summary"
            className="text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Summary
          </Label>
          <Skeleton className="h-4 w-1/2 bg-gray-200 dark:bg-[#2D2D2F] rounded" />
          <Skeleton className="h-4 w-3/4 bg-gray-200 dark:bg-[#2D2D2F] rounded" />
          <Skeleton className="h-4 w-1/2 bg-gray-200 dark:bg-[#2D2D2F] rounded" />
        </div>
      ) : (
        showSummary && (
          <div className="space-y-2">
            <Label
              htmlFor="summary"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Summary
            </Label>
            <Textarea
              id="summary"
              value={summary}
              readOnly
              className="w-full h-96 rounded-lg border-gray-300 dark:border-[#2D2D2F] dark:bg-[#1D1D1F] dark:text-white focus:ring-2 focus:ring-[#2997FF] dark:focus:ring-[#2997FF] focus:border-transparent"
            />
          </div>
        )
      )}
    </>
  );
};
