// TODOS:
// once students are fetched, it will match the student list with list in convex db from previous discussions
// if matched, it will take the selected students stored in db and update selected students array

// will be doing a parallel route implementation for generate button
// once clicked, it will route to the discussionID but keep the same page
// link, selected students and custom prompt will be stored in db
// generate function will be called, above data will be read from db, and response will be displayed to client and stored in db
// also have a version history of responses, each version should also show the custom prompt if provided
// if no custom prompt is provided, it should tell that it was a general summary
// each version should also have a timestamp

// uuid for discussionID
// https://github.com/vercel/nextgram - for parrallel route implementation

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2, LinkIcon, Users, XCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { StudentsModal } from "./students-modal";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useRouter } from "next/navigation";

export const LinkCard = () => {
  const [discussionLink, setDiscussionLink] = useState("");
  const [customPrompt, setCustomPrompt] = useState("");
  const [isLinkValid, setIsLinkValid] = useState<boolean | null>(null);
  const [isValidatingLink, setIsValidatingLink] = useState(false);
  const [isFetchingStudents, setIsFetchingStudents] = useState(false);
  const [hasFetchedStudents, setHasFetchedStudents] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [students, setStudents] = useState<string[]>([]);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();
  const discussionId = Math.random().toString(36).substring(7);

  useEffect(() => {
    if (isLinkValid) {
      fetchStudents().finally(() => setIsFetchingStudents(false));
    }

    if (hasFetchedStudents && discussionLink) {
      setStudents([]);
      setSelectedStudents([]);
      setHasFetchedStudents(false);
    }
  }, [discussionLink, isLinkValid]);

  const validateCanvasUrl = (url: string) => {
    try {
      const urlObj = new URL(url);

      if (urlObj.hostname !== "canvas.asu.edu") {
        return false;
      }

      const pathRegex = /^\/courses\/\d+\/discussion_topics\/\d{7}$/;
      return pathRegex.test(urlObj.pathname);
    } catch {
      return false;
    }
  };

  const handleLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    setDiscussionLink(value);
    setIsValidatingLink(true);
    setIsLinkValid(null);
    setError(null);

    setTimeout(() => {
      setIsValidatingLink(false);
      const isValid = validateCanvasUrl(value);

      if (isValid) {
        setIsLinkValid(true);
        setIsFetchingStudents(true);
      } else {
        setIsLinkValid(false);
      }
    }, 300);
  };

  const fetchStudents = async () => {
    try {
      const response = await fetch("/api/students", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ link: discussionLink }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "An unexpected error occurred");
      }

      const data = await response.json();

      if (data.participants.length < 15) {
        throw new Error("Not enough participants yet. Please try again later!");
      }

      setStudents(data.participants);
      setHasFetchedStudents(true);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsFetchingStudents(false);
    }
  };

  const handleGenerate = () => {
    router.push(`/discussion/${discussionId}`);
  };

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
          {discussionLink && isFetchingStudents && (
            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
              <Skeleton className="h-4 w-4 rounded-full" />
              <span>Fetching students...</span>
            </div>
          )}
          {hasFetchedStudents && (
            <div className="flex items-center space-x-2 text-sm text-green-600 dark:text-green-400">
              <CheckCircle2 className="w-4 h-4" />
              <span>Fetched students</span>
            </div>
          )}
          {error !== null && !hasFetchedStudents && (
            <div className="flex items-center space-x-2 text-sm text-red-600 dark:text-red-400">
              <XCircle className="w-4 h-4" />
              <span>{error}</span>
            </div>
          )}
        </div>
      </div>
      {discussionLink && (students.length != 0) === true && (
        <>
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button variant="custom" className="w-full">
                <Users className="w-4 h-4" />
                Select Students
              </Button>
            </DialogTrigger>
            <DialogContent>
              <StudentsModal
                students={students}
                selectedStudents={selectedStudents}
                setSelectedStudents={setSelectedStudents}
              />
            </DialogContent>
          </Dialog>
        </>
      )}
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
          className="w-full rounded-lg border-gray-300 dark:border-[#2D2D2F] dark:bg-[#1D1D1F] dark:text-white focus:ring-2 h-24 focus:ring-[#2997FF] dark:focus:ring-[#2997FF]"
        />
      </div>
      <Button
        onClick={handleGenerate}
        // disabled={isLoading || selectedStudents.length === 0}
        className="w-full bg-[#2997FF] hover:bg-[#147CE5] text-white font-semibold py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <LinkIcon className="w-4 h-4" />
        {isLoading ? "Generating..." : "Generate"}
      </Button>
    </>
  );
};
