// TODOS:
// - make version history for response component
// - finish history sidebar
// - on / route, when making a new response, check first for existing link in db
// - if found, make new response with that discussion id and route to that discussion page
// fix logout and history button not showing up in discussion page
// fix overall styling

"use client";

import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import React, { useEffect, useState } from "react";
import { LinkCard } from "@/app/_components/link-card";
import { Id } from "../../../../convex/_generated/dataModel";
import { PageWrapper } from "@/components/common/page-wrapper";
import { Label } from "@/components/ui/label";
import { Response } from "@/app/_components/response";
import { Spinner } from "@/components/common/icons";

export type Response = {
  id: Id<"responses">;
  response: string;
  version: number;
  customPrompt: string | undefined;
  selectedStudents: string[];
  students: string[];
  discussionId: Id<"discussions">;
  link: string;
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
  const [isMounted, setIsMounted] = useState(false);
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
    if (getResponses) {
      setResponses(getResponses);
      setLatestResponse(getResponses[0]);
      setIsMounted(true);
      setGettingResponses(false);
    }
  }, [getResponses]);

  if (isLoading || gettingResponses) {
    return (
      <div className="flex justify-center items-center h-screen bg-black">
        <Spinner className="w-10 h-10" />
      </div>
    );
  }

  if (notFound) {
    return <div>Discussion not found</div>;
  }

  if (!authorized) {
    return <div>Not authorized</div>;
  }

  return (
    <PageWrapper>
      <LinkCard
        linkFromParams={latestResponse?.link}
        customPromptFromParams={latestResponse?.customPrompt}
        studentsFromParams={latestResponse?.students}
        selectedStudentsFromParams={latestResponse?.selectedStudents}
        isMounted={isMounted}
      />
      <div className="space-y-2">
        <Label
          htmlFor="summary"
          className="text-sm font-semibold text-gray-700 dark:text-gray-300"
        >
          Response
        </Label>
        <Response
          responses={responses}
          latestResponse={latestResponse}
          setLatestResponse={setLatestResponse}
        />
      </div>
    </PageWrapper>
  );
}
