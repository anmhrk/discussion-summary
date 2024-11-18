import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2, LinkIcon, XCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export const LinkCard = () => {
  const [discussionLink, setDiscussionLink] = useState("");
  const [customPrompt, setCustomPrompt] = useState("");
  const [isLinkValid, setIsLinkValid] = useState<boolean | null>(null);
  const [isValidatingLink, setIsValidatingLink] = useState(false);
  const [isFetchingStudents, setIsFetchingStudents] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const validateCanvasUrl = (url: string) => {
    try {
      const urlObj = new URL(url);

      if (urlObj.hostname !== "canvas.asu.edu") {
        return false;
      }

      const pathRegex = /^\/courses\/\d+\/discussion_topics\/\d+$/;
      return pathRegex.test(urlObj.pathname);
    } catch {
      return false;
    }
  };

  const fetchStudents = async () => {};

  const handleLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    setDiscussionLink(value);
    setIsValidatingLink(true);
    setIsLinkValid(null);

    setTimeout(() => {
      setIsValidatingLink(false);
      const isValid = validateCanvasUrl(value);

      if (isValid) {
        setIsLinkValid(true);
        setIsFetchingStudents(true);
      } else {
        setIsLinkValid(false);
      }
    }, 1000);
  };

  const handleSummarize = () => {};

  return (
    <>
      <div className="space-y-2">
        <Label
          htmlFor="discussion-link"
          className="text-sm font-semibold text-gray-700 dark:text-gray-300"
        >
          Discussion Link
        </Label>
        <div className="space-y-2">
          <Input
            id="discussion-link"
            type="text"
            placeholder="Paste your Canvas discussion link here"
            value={discussionLink}
            onChange={handleLinkChange}
            className="w-full rounded-lg border-gray-300 dark:border-[#2D2D2F] dark:bg-[#1D1D1F] dark:text-white focus:ring-2 focus:ring-[#2997FF] dark:focus:ring-[#2997FF] focus:border-transparent"
          />
          {discussionLink && isValidatingLink && (
            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
              <Skeleton className="h-4 w-4 rounded-full" />
              <span>Validating link...</span>
            </div>
          )}
          {discussionLink && isLinkValid === true && (
            <div className="flex items-center space-x-2 text-sm text-green-600 dark:text-green-400">
              <CheckCircle2 className="w-4 h-4" />
              <span>Link validated successfully</span>
            </div>
          )}
          {discussionLink && isLinkValid === false && (
            <div className="flex items-center space-x-2 text-sm text-red-600 dark:text-red-400">
              <XCircle className="w-4 h-4" />
              <span>Invalid link</span>
            </div>
          )}
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
      </div>
      <Button
        onClick={handleSummarize}
        disabled={isLoading || !isLinkValid}
        className="w-full bg-[#2997FF] hover:bg-[#147CE5] text-white font-semibold py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <LinkIcon className="w-4 h-4 mr-2" />
        {isLoading ? "Summarizing..." : "Summarize"}
      </Button>
    </>
  );
};
