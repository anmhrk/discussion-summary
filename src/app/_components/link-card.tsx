import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { LinkIcon, Users } from "lucide-react";
import { StudentsModal } from "./students-modal";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useRouter, useParams } from "next/navigation";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { toast } from "sonner";
import { Messages } from "./messages";

export const LinkCard = () => {
  const [discussionLink, setDiscussionLink] = useState("");
  const [customPrompt, setCustomPrompt] = useState("");
  const [isLinkValid, setIsLinkValid] = useState<boolean | null>(null);
  const [isValidatingLink, setIsValidatingLink] = useState(false);
  const [isFetchingStudents, setIsFetchingStudents] = useState(false);
  const [hasFetchedStudents, setHasFetchedStudents] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [students, setStudents] = useState<string[]>([]);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const token = localStorage.getItem("canvasApiToken");
  const router = useRouter();
  const params = useParams<{ id: string }>();

  const insertDiscussion = useMutation(api.discussion.createDiscussion);
  const insertResponse = useMutation(api.response.createResponse);
  const checkIfNewLink = useMutation(api.discussion.checkIfNewLink);

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
        body: JSON.stringify({ link: discussionLink, token }),
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

  const handleGenerate = async () => {
    let discussionId =
      params?.id || Math.random().toString(36).substring(2, 12);

    const newLink = await checkIfNewLink({ link: discussionLink });
    if (newLink) {
      discussionId = Math.random().toString(36).substring(7);
    }

    setIsLoading(true);
    try {
      if (selectedStudents.length < 10) {
        throw new Error(
          "Please select at least 10 students for a meaningful response"
        );
      }

      toast.loading("Generating response...", {
        id: "loading",
        position: "top-center",
      });

      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          link: discussionLink,
          customPrompt,
          selectedStudents,
          token,
        }),
      });

      const data = await response.json();

      toast.dismiss("loading");

      if (response.ok) {
        insertDiscussion({
          currentUserId: localStorage.getItem("userId") || "",
          discussionId: discussionId,
          link: discussionLink,
          students: students,
        });

        insertResponse({
          currentDiscussionId: discussionId,
          customPrompt: customPrompt,
          selectedStudents: selectedStudents,
          response: data.summary,
        });

        toast.success("Response generated!", { position: "top-center" });
        router.push(`/discussion/${discussionId}`);
      } else {
        toast.dismiss("loading");
        throw new Error(data.error || "An unexpected error occurred");
      }
    } catch (error: any) {
      toast.dismiss("loading");
      toast.error(error.message, { position: "top-center", duration: 5000 });
    } finally {
      setIsLoading(false);
    }
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
          <Messages
            discussionLink={discussionLink}
            isValidatingLink={isValidatingLink}
            isLinkValid={isLinkValid}
            hasFetchedStudents={hasFetchedStudents}
            isFetchingStudents={isFetchingStudents}
            error={error}
          />
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
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Note: Non-discussion related prompts will be ignored.
        </p>
      </div>
      <Button
        onClick={handleGenerate}
        disabled={isLoading || selectedStudents.length === 0}
        className="w-full bg-[#2997FF] hover:bg-[#147CE5] text-white font-semibold py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <LinkIcon className="w-4 h-4" />
        {isLoading ? "Generating..." : "Generate"}
      </Button>
    </>
  );
};
