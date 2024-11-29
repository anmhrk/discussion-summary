import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle2, XCircle } from "lucide-react";

interface MessagesProps {
  discussionLink: string;
  isValidatingLink: boolean;
  isLinkValid: boolean | null;
  hasFetchedStudents: boolean;
  isFetchingStudents: boolean;
  error: string | null;
}

export const Messages = ({
  discussionLink,
  isValidatingLink,
  isLinkValid,
  hasFetchedStudents,
  isFetchingStudents,
  error,
}: MessagesProps) => {
  return (
    <>
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
      {discussionLink && hasFetchedStudents && (
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
    </>
  );
};
