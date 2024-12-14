import { InfoIcon, PencilEditIcon } from "@/components/common/icons";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useQuery } from "convex/react";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { api } from "../../../convex/_generated/api";
interface HistoryProps {
  isHistoryVisible: boolean;
  setIsHistoryVisible: (state: boolean) => void;
}

export const History = ({
  isHistoryVisible,
  setIsHistoryVisible,
}: HistoryProps) => {
  const { user } = useUser();
  const discussions = useQuery(api.discussion.getDiscussions, {
    userId: user?.id ?? "",
  });
  return (
    <>
      <Sheet
        open={isHistoryVisible}
        onOpenChange={(state) => {
          setIsHistoryVisible(state);
        }}
      >
        <SheetContent side="left" className="p-3 w-80 bg-muted">
          <SheetHeader>
            <SheetTitle className="text-left flex items-center gap-2">
              History
              {discussions && discussions.length > 0 && (
                <span className="text-xs text-zinc-400">
                  ({discussions.length} discussion
                  {discussions.length === 1 ? "" : "s"})
                </span>
              )}
            </SheetTitle>
          </SheetHeader>

          <div className="mt-8 flex flex-col">
            <Button
              className="rounded-md font-semibold py-5 text-sm flex flex-row justify-between text-white bg-[#2997FF] hover:bg-[#147CE5]"
              asChild
            >
              <Link href="/">
                <div>New discussion</div>
                <PencilEditIcon size={14} />
              </Link>
            </Button>
          </div>

          {discussions && discussions.length > 0 ? (
            <>
              {discussions.map((discussion) => (
                <div key={discussion.id} className="flex flex-col mt-10">
                  <Button
                    variant="custom"
                    className="rounded-md font-normal py-5 text-sm flex flex-row justify-between text-white"
                    asChild
                  >
                    <Link href={`/discussion/${discussion.id}`}>
                      <div className="w-full">
                        <span>...</span>
                        {discussion.link.split("canvas.asu.edu/cour")[1]}
                      </div>
                    </Link>
                  </Button>
                </div>
              ))}
            </>
          ) : (
            <div className="flex flex-col overflow-y-scroll p-1 h-[calc(100dvh-124px)]">
              <div className="text-zinc-500 dark:text-zinc-400 h-dvh w-full flex flex-row justify-center items-center text-sm gap-2">
                <InfoIcon />
                <div>No saved discussions available</div>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
};
