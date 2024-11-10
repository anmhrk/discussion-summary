import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { LinkIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";

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
            <div className="w-full prose dark:prose-invert prose-sm max-w-none p-4 rounded-lg border border-gray-300 dark:border-[#2D2D2F] bg-white dark:bg-[#1D1D1F] dark:text-white">
              <ReactMarkdown
                components={{
                  h1: ({ children }) => (
                    <h1 className="text-xl font-bold mb-4">{children}</h1>
                  ),
                  h2: ({ children }) => (
                    <h2 className="text-lg font-semibold mb-3">{children}</h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="text-base font-medium mb-2">{children}</h3>
                  ),
                  ul: ({ children }) => (
                    <ul className="list-disc list-inside space-y-1 ml-4 mb-4">
                      {children}
                    </ul>
                  ),
                  li: ({ children }) => (
                    <li className="text-sm leading-6">{children}</li>
                  ),
                  p: ({ children }) => (
                    <p className="text-sm leading-6 mb-4">{children}</p>
                  ),
                  strong: ({ children }) => (
                    <strong className="font-semibold">{children}</strong>
                  ),
                  em: ({ children }) => <em className="italic">{children}</em>,
                }}
              >
                {summary}
              </ReactMarkdown>
            </div>
          </div>
        )
      )}
    </>
  );
};
