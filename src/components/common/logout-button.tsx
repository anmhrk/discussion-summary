import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "../ui/button";
import { LogOut } from "lucide-react";
import { toast } from "sonner";
import useAuthStore from "@/lib/useAuthStore";

export const LogoutButton = () => {
  const { logout } = useAuthStore();

  return (
    <>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button className="py-1.5 px-2 h-fit rounded-lg">
            <LogOut className="w-5 h-5" />
            <span className="font-semibold">Logout</span>
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent className="bg-white dark:bg-[#1D1D1F] rounded-2xl p-6 shadow-xl border dark:border-[#2D2D2F]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-semibold text-gray-900 dark:text-white">
              Are you sure you want to logout?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600 dark:text-[#86868B] mt-2">
              If you logout, you'll have to input your API access token again.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-6">
            <AlertDialogCancel className="bg-gray-100 hover:bg-gray-200 dark:bg-[#2D2D2F] dark:hover:bg-[#3D3D3F] text-gray-700 dark:text-gray-300 font-semibold py-2 px-4 rounded-lg transition-colors">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                logout();
                toast.success("Successfully logged out!", {
                  position: "top-center",
                });
              }}
              className="bg-red-500 hover:bg-red-600 dark:bg-[#FF453A] dark:hover:bg-[#D70015] text-white font-semibold py-2 px-4 rounded-lg transition-colors ml-3"
            >
              Logout
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
