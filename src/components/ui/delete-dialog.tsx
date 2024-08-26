import { Button } from "./button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  type DialogProps,
  DialogTitle,
} from "./dialog";
import { DialogDescription } from "@radix-ui/react-dialog";

interface Props extends DialogProps {
  onDelete: () => Promise<void>;
  onClose: () => void;
  title?: string;
  loading?: boolean;
}

export function DeleteDialog({
  onClose,
  open,
  title,
  onDelete,
  loading,
}: Props) {
  function closeModal() {
    onClose();
  }

  async function handleDelete() {
    try {
      await onDelete();
      closeModal();
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Dialog open={open} onOpenChange={closeModal}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle>Delete {title}</DialogTitle>
        </DialogHeader>

        <DialogDescription>
          Are you sure you want to delete this {title}?
        </DialogDescription>

        <DialogFooter className="mt-3">
          <Button
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              closeModal();
            }}
            className="mt-2 w-full sm:mt-0"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            className="w-full"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete();
            }}
            loading={loading}
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
