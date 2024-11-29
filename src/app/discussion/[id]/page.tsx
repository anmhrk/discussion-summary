// TODOS:
// - fix styling
// - implement loading spinner in this page
// - getResponses from id params
// - make response component with version history
// - make not found and not authorized components
// - make the parallel route for response
// - finish history sidebar
// - make the discussionId a number string

"use client";

import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useEffect, useState } from "react";
import React from "react";
import { LinkCard } from "@/app/_components/link-card";
import { Response } from "@/app/@discussion/(.)discussion/[id]/response";

export const dynamicParams = false;

export default function DiscussionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [notFound, setNotFound] = useState(false);
  const [authorized, setAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const unwrappedParams = React.use(params);
  const discussionId = unwrappedParams.id;
  const checkIfDiscussionExists = useMutation(
    api.discussion.checkIfDiscussionExists
  );
  const checkIfUserCreatedDiscussion = useMutation(
    api.discussion.checkIfUserCreatedDiscussion
  );

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

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (notFound) {
    return <div>Discussion not found</div>;
  }

  if (!authorized) {
    return <div>Not authorized</div>;
  }

  return (
    <>
      <LinkCard />
      <Response />
    </>
  );
}
