import { LinkIcon } from "lucide-react";

export const Discussion = () => {
  return (
    <div className="flex-1">
      <div className="bg-white dark:bg-[#1D1D1F] rounded-lg shadow-sm border p-6 h-[calc(100vh-5.4rem)]">
        <div className="h-full flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
          <LinkIcon className="w-16 h-16 mb-4" />
          <p className="text-lg">Please press generate to show summary</p>
        </div>
      </div>
    </div>
  );
};
