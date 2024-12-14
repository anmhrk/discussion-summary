import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { LinkIcon, PlusIcon, Users } from "lucide-react";
import { StudentsModal } from "./students-modal";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { toast } from "sonner";
import { Messages } from "./messages";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { v4 as uuidv4 } from "uuid";

export const LinkCard = ({
  linkFromParams,
  customPromptFromParams,
  isMounted,
  selectedStudentsFromParams,
  studentsFromParams,
}: {
  linkFromParams?: string;
  customPromptFromParams?: string;
  isMounted?: boolean;
  selectedStudentsFromParams?: string[];
  studentsFromParams?: string[];
}) => {
  const [discussionLink, setDiscussionLink] = useState(linkFromParams || "");
  const [customPrompt, setCustomPrompt] = useState(
    customPromptFromParams || ""
  );
  const [isLinkValid, setIsLinkValid] = useState<boolean | null>(null);
  const [isValidatingLink, setIsValidatingLink] = useState(false);
  const [isFetchingStudents, setIsFetchingStudents] = useState(false);
  const [hasFetchedStudents, setHasFetchedStudents] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [students, setStudents] = useState<string[]>(studentsFromParams || []);
  const [selectedStudents, setSelectedStudents] = useState<string[]>(
    selectedStudentsFromParams || []
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const insertDiscussion = useMutation(api.discussion.createDiscussion);
  const insertResponse = useMutation(api.response.createResponse);
  const checkIfDiscussionExists = useMutation(
    api.discussion.checkIfDiscussionExists
  );
  const getDiscussionId = useMutation(api.discussion.getDiscussionId);
  const { user } = useUser();

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

  useEffect(() => {
    setCustomPrompt(customPromptFromParams || "");
  }, [customPromptFromParams]);

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
      const response = await fetch("/api/fetch-students", {
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

  const handleGenerate = async () => {
    setIsLoading(true);
    try {
      if (selectedStudents.length < 10) {
        throw new Error(
          "Please select at least 10 students for a meaningful response"
        );
      }

      let discussionId = "";

      const discussionExists = await checkIfDiscussionExists({
        link: discussionLink,
      });

      if (discussionExists) {
        discussionId = (await getDiscussionId({ link: discussionLink })) || "";
      } else {
        discussionId = uuidv4();
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
        }),
      });

      const data = await response.json();

      toast.dismiss("loading");

      if (response.ok) {
        await insertDiscussion({
          currentUserId: user?.id || "",
          discussionId: discussionId,
          link: discussionLink,
        });

        await insertResponse({
          currentDiscussionId: discussionId,
          customPrompt: customPrompt,
          selectedStudents: selectedStudents,
          students: students,
          response: data.summary,
          link: discussionLink,
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
            disabled={isMounted}
            value={discussionLink}
            onChange={handleLinkChange}
            className="w-full rounded-lg border-gray-300 dark:border-[#2D2D2F] dark:bg-[#1D1D1F] dark:text-white focus:ring-2 focus:ring-[#2997FF] dark:focus:ring-[#2997FF] focus:border-transparent"
          />
          <Messages
            discussionLink={linkFromParams || discussionLink}
            isValidatingLink={isValidatingLink}
            isLinkValid={isLinkValid}
            hasFetchedStudents={hasFetchedStudents}
            isFetchingStudents={isFetchingStudents}
            error={error}
          />
        </div>
      </div>
      {isMounted ? (
        <>
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button variant="custom" className="w-full">
                <Users className="w-4 h-4" />
                {selectedStudents.length !== 0
                  ? `${selectedStudents.length}/${students.length} students selected`
                  : "Select Students"}
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
      ) : (
        discussionLink &&
        students.length != 0 && (
          <>
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
              <DialogTrigger asChild>
                <Button variant="custom" className="w-full">
                  <Users className="w-4 h-4" />
                  {selectedStudents.length !== 0
                    ? `${selectedStudents.length}/${students.length} students selected`
                    : "Select Students"}
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
        )
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
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Note: Non-discussion related prompts will be ignored.
        </p>
      </div>
      <div className="md:flex md:space-x-3 space-y-3 md:space-y-0">
        <Button
          onClick={handleGenerate}
          disabled={isLoading || selectedStudents.length === 0}
          className="w-full bg-[#2997FF] hover:bg-[#147CE5] text-white font-semibold py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <LinkIcon className="w-4 h-4" />
          {isLoading ? "Generating..." : "Generate"}
        </Button>
        {isMounted && (
          <Button disabled={isLoading} className="w-full" variant="custom">
            <Link href="/" className="flex items-center gap-2">
              <PlusIcon className="w-4 h-4" />
              New discussion
            </Link>
          </Button>
        )}
      </div>
    </>
  );
};
