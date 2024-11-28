import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { DialogHeader } from "@/components/ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface StudentsModalProps {
  students: string[];
  selectedStudents: string[];
  setSelectedStudents: React.Dispatch<React.SetStateAction<string[]>>;
}

export const StudentsModal = ({
  students,
  selectedStudents,
  setSelectedStudents,
}: StudentsModalProps) => {
  const allSelected = students.length === selectedStudents.length;

  const handleSelectStudent = (student: string) => {
    setSelectedStudents((prev) =>
      prev.includes(student)
        ? prev.filter((s) => s !== student)
        : [...prev, student]
    );
  };

  const handleSelectAll = () => {
    setSelectedStudents(allSelected ? [] : [...students]);
  };

  return (
    <>
      <VisuallyHidden.Root>
        <DialogTitle></DialogTitle>
      </VisuallyHidden.Root>
      <DialogHeader>
        <DialogTitle>
          Select students to be included in the response
        </DialogTitle>
      </DialogHeader>
      <div>
        <Button
          onClick={handleSelectAll}
          variant="outline"
          className="mb-4 w-full"
        >
          {allSelected ? "Deselect All" : "Select All"}
        </Button>
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
          {selectedStudents.length}/{students.length} students selected
        </p>
      </div>
      <ScrollArea className="h-[300px] pr-4">
        {students.map((student, idx) => (
          <div key={idx} className="flex items-center space-x-2 mb-2">
            <Checkbox
              id={`student-${idx}`}
              checked={selectedStudents.includes(student)}
              onCheckedChange={() => handleSelectStudent(student)}
            />
            <Label
              htmlFor={`student-${idx}`}
              className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer"
            >
              {student}
            </Label>
          </div>
        ))}
      </ScrollArea>
    </>
  );
};
