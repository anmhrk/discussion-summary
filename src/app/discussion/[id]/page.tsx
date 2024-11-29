// TODOS:
// - implement loading spinner in this page
// - make version history for response component
// - make not found and not authorized components
// - finish history sidebar
// - populate custom prompt and link in link card from params
// - on / route, when making a new response, check first for existing link in db
// - if found, make new response with that discussion id and route to that discussion page

"use client";

import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import React, { useEffect, useState } from "react";
import { LinkCard } from "@/app/_components/link-card";
import { Id } from "../../../../convex/_generated/dataModel";
import { PageWrapper } from "@/components/common/page-wrapper";
import { Label } from "@/components/ui/label";
import { Response } from "@/app/_components/response";

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
    <PageWrapper>
      <LinkCard />
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
