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
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

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

export default function DiscussionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [notFound, setNotFound] = useState(false);
  const [authorized, setAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [latestResponse, setLatestResponse] = useState<Response | null>(null);
  const [gettingResponses, setGettingResponses] = useState(true);
  const [numOfResponses, setNumOfResponses] = useState(0);
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
  const getNumOfResponses = useMutation(api.discussion.getNumOfResponses);

  const goToPreviousVersion = () => {
    if (latestResponse?.version === 1 || !latestResponse) {
      return;
    }

    const previousVersion = latestResponse?.version - 1;
    const previousVersionResponse: Response | undefined = getResponses?.find(
      (response) => response.version === previousVersion
    );

    if (previousVersionResponse) {
      setLatestResponse(previousVersionResponse);
    }
  };

  const goToNextVersion = () => {
    if (latestResponse?.version === numOfResponses || !latestResponse) {
      return;
    }

    const nextVersion = latestResponse?.version + 1;
    const nextVersionResponse: Response | undefined = getResponses?.find(
      (response) => response.version === nextVersion
    );

    if (nextVersionResponse) {
      setLatestResponse(nextVersionResponse);
    }
  };

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
      getNumOfResponses({ discussionId }).then((result) => {
        setNumOfResponses(result as number);
      });
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
    return <div className="bg-black h-screen">Discussion not found</div>;
  }

  if (!authorized) {
    return <div className="bg-black h-screen">Not authorized</div>;
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
      <div className="flex items-center space-x-4">
        <div className="flex-1 space-y-2">
          <div className="flex items-center justify-between">
            <Label
              htmlFor="summary"
              className="text-sm font-semibold text-gray-700 dark:text-gray-300"
            >
              Response
            </Label>

            <div className="flex items-center">
              <Button
                variant="ghost"
                className="p-2"
                onClick={goToPreviousVersion}
              >
                <ArrowLeft />
              </Button>
              <Label
                htmlFor="version"
                className="text-sm font-semibold text-gray-700 dark:text-gray-300"
              >
                Version {latestResponse?.version} of {numOfResponses}
              </Label>
              <Button variant="ghost" className="p-2" onClick={goToNextVersion}>
                <ArrowRight />
              </Button>
            </div>
          </div>
          <Response latestResponse={latestResponse} />
        </div>
      </div>
    </PageWrapper>
  );
}
