"use client";

import { InfoIcon, PencilEditIcon, MenuIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import Link from "next/link";
import { useState } from "react";

export const History = () => {
  const [isHistoryVisible, setIsHistoryVisible] = useState(false);

  return (
    <>
      <Button
        variant="outline"
        className="p-1.5 h-fit rounded-lg"
        onClick={() => {
          setIsHistoryVisible(true);
        }}
      >
        <MenuIcon />
      </Button>

      <Sheet
        open={isHistoryVisible}
        onOpenChange={(state) => {
          setIsHistoryVisible(state);
        }}
      >
        <SheetContent side="left" className="p-3 w-80 bg-muted">
          <SheetHeader>
            <SheetTitle className="text-left">History</SheetTitle>
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

          <div className="flex flex-col overflow-y-scroll p-1 h-[calc(100dvh-124px)]">
            <div className="text-zinc-500 h-dvh w-full flex flex-row justify-center items-center text-sm gap-2">
              <InfoIcon />
              <div>No saved discussions available</div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};
