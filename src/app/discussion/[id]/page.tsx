// TODOS:
// - fix styling
// - implement loading spinner in this page
// - make version history for response component
// - make not found and not authorized components
// - make the parallel route for response
// - finish history sidebar

"use client";

import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import React, { useEffect, useState } from "react";
import { LinkCard } from "@/app/_components/link-card";
import { Response } from "@/app/@discussion/(.)discussion/[id]/response";
import { Id } from "../../../../convex/_generated/dataModel";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export type Response = {
  id: Id<"responses">;
  response: string;
  version: number;
  customPrompt: string | undefined;
  selectedStudents: string[];
  discussionId: Id<"discussions">;
};

export const dynamicParams = false;

export default function DiscussionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [notFound, setNotFound] = useState(false);
  const [authorized, setAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [responses, setResponses] = useState<Response[] | Error>([]);
  const [latestResponse, setLatestResponse] = useState<Response | null>(null);
  const [gettingResponses, setGettingResponses] = useState(true);
  const unwrappedParams = React.use(params);
  const discussionId = unwrappedParams.id;
  const checkIfDiscussionExists = useMutation(
    api.discussion.checkIfDiscussionExists
  );
  const checkIfUserCreatedDiscussion = useMutation(
    api.discussion.checkIfUserCreatedDiscussion
  );
  const getResponses = useQuery(api.response.getResponses, { discussionId });

  useEffect(() => {
    const userId = localStorage.getItem("userId") || "";
    checkIfDiscussionExists({
      discussionId,
    }).then((result) => {
      if (result) {
        checkIfUserCreatedDiscussion({
          discussionId,
          userId,
        }).then((result) => {
          setAuthorized(result as boolean);
          setIsLoading(false);
        });
      } else {
        setNotFound(true);
        setIsLoading(false);
      }
    });
  }, [discussionId, checkIfDiscussionExists]);

  useEffect(() => {
    if (getResponses && !(getResponses instanceof Error)) {
      setResponses(getResponses);
      setLatestResponse(getResponses[0]);
      setGettingResponses(false);
    }
  }, [getResponses]);

  if (isLoading || gettingResponses) {
    return <div>Loading...</div>;
  }

  if (notFound) {
    return <div>Discussion not found</div>;
  }

  if (!authorized) {
    return <div>Not authorized</div>;
  }

  return (
    <main className="flex-grow flex-col flex items-start pt-20 px-4 space-y-4">
      <Card className="max-w-3xl w-full mx-auto bg-white dark:bg-[#1D1D1F] shadow-lg rounded-2xl overflow-hidden border-0">
        <CardHeader className="bg-gray-100/50 dark:bg-[#1D1D1F] p-6 border-b border-gray-200 dark:border-[#2D2D2F]">
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl font-semibold">
              Canvas Discussion Summarizer
            </CardTitle>
          </div>
          <CardDescription className="text-gray-600 dark:text-[#86868B] mt-2">
            Generate summaries of Human Event discussion boards in seconds
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-6 mb-3">
          <LinkCard />
          <Label
            htmlFor="summary"
            className="text-sm font-semibold text-gray-700 dark:text-gray-300"
          >
            Summary
          </Label>
          <Response
            responses={responses}
            latestResponse={latestResponse}
            setLatestResponse={setLatestResponse}
          />
        </CardContent>
      </Card>
    </main>
  );
}
