import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { LinkIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { discussionSchema } from "@/lib/schema";
import { ZodError } from "zod";
import { Summary } from "./summary";

export const Discussion = () => {
  // const token = localStorage.getItem("canvasApiToken");
  const [discussionLink, setDiscussionLink] = useState("");
  const [customPrompt, setCustomPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [summary, setSummary] = useState("");
  const [showSkeleton, setShowSkeleton] = useState(false);
  const [isPopulatingData, setIsPopulatingData] = useState(true);
  const hasSavedData =
    localStorage.getItem("discussionLink") ||
    localStorage.getItem("customPrompt") ||
    localStorage.getItem("summary");

  // Persist data on refresh using local storage
  useEffect(() => {
    if (localStorage.getItem("discussionLink")) {
      setDiscussionLink(
        localStorage.getItem("discussionLink") || discussionLink
      );
    }
    if (localStorage.getItem("customPrompt")) {
      setCustomPrompt(localStorage.getItem("customPrompt") || customPrompt);
    }
    if (localStorage.getItem("summary")) {
      setSummary(localStorage.getItem("summary") || summary);
      setShowSummary(true);
    }

    setIsPopulatingData(false);
  }, []);

  // Toast to show that saved data has been loaded
  useEffect(() => {
    const hasShownToast = sessionStorage.getItem("hasShownSavedDataToast");

    if (!hasShownToast) {
      if (hasSavedData) {
        const timeout = setTimeout(() => {
          toast.info("Previous data loaded", {
            duration: 5000,
            position: "top-center",
          });
          sessionStorage.setItem("hasShownSavedDataToast", "true");
        }, 500);
        return () => clearTimeout(timeout);
      }
    }
  }, []);

  const handleSummarize = async () => {
    localStorage.removeItem("discussionLink");
    localStorage.removeItem("customPrompt");
    localStorage.removeItem("summary");
    setShowSummary(false);
    setSummary("");

    try {
      discussionSchema.parse({ link: discussionLink, customPrompt });
    } catch (error) {
      if (error instanceof ZodError) {
        toast.error(error.errors[0].message, { position: "top-center" });
        return;
      }
    }

    try {
      setIsLoading(true);
      toast.info("Hang tight! Fetching discussion posts...", {
        duration: 30000,
        id: "fetching",
        position: "top-center",
      });
      const response = await fetch("/api/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ link: discussionLink, customPrompt }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.dismiss("fetching");
        toast.info("Generating response...", {
          duration: 10000,
          id: "generating",
          position: "top-center",
        });
        setSummary(data.summary);
        setShowSkeleton(true);
        setTimeout(() => {
          setShowSkeleton(false);
          setShowSummary(true);
          toast.dismiss("generating");
          toast.success("Successfully generated response!", {
            position: "top-center",
          });
          localStorage.setItem("discussionLink", discussionLink);
          if (customPrompt) {
            localStorage.setItem("customPrompt", customPrompt);
          }
          localStorage.setItem("summary", data.summary);
        }, 5000);
      } else {
        toast.dismiss("fetching");
        toast.dismiss("generating");
        toast.error(data.error, { position: "top-center" });
      }
    } catch (error) {
      toast.dismiss("fetching");
      toast.dismiss("generating");
      toast.error("An unexpected error occurred", { position: "top-center" });
    } finally {
      setIsLoading(false);
    }
  };

  if (hasSavedData && isPopulatingData) return null;

  return (
    <>
      <div className="space-y-2">
        <Label
          htmlFor="discussion-link"
          className="text-sm font-semibold text-gray-700 dark:text-gray-300"
        >
          Discussion Link
        </Label>
        <div className="flex space-x-2">
          <Input
            type="url"
            placeholder="Paste your discussion link here"
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
            {isLoading ? "Generating..." : "Generate"}
          </Button>
        </div>
      </div>
      <div className="space-y-2">
        <Label
          htmlFor="custom-prompt"
          className="text-sm font-semibold text-gray-700 dark:text-gray-300"
        >
          Custom Prompt (Optional)
        </Label>
        <Textarea
          id="custom-prompt"
          placeholder="Example: 'What do the posts say about the theme of love?' Leave blank for a general summary"
          value={customPrompt}
          onChange={(e) => setCustomPrompt(e.target.value)}
          className="w-full rounded-lg border-gray-300 dark:border-[#2D2D2F] dark:bg-[#1D1D1F] dark:text-white focus:ring-2 h-24 focus:ring-[#2997FF]"
        />
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Note: Non-discussion related prompts will be ignored.
        </p>
      </div>
      {showSkeleton ? (
        <div className="space-y-2">
          <Label
            htmlFor="summary"
            className="text-sm font-semibold text-gray-700 dark:text-gray-300"
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
              className="text-sm font-semibold text-gray-700 dark:text-gray-300"
            >
              Summary
            </Label>
            <Summary summary={summary} />
          </div>
        )
      )}
    </>
  );
};
