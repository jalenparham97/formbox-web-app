import Link from "next/link";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  type DialogProps,
  DialogTitle,
} from "../ui/dialog";
import { DialogDescription } from "@radix-ui/react-dialog";

interface Props extends DialogProps {
  onClose: () => void;
  title?: string;
  description: string;
  href: string;
}

export function LimitReachedModal({
  onClose,
  open,
  title,
  description,
  href,
}: Props) {
  function closeModal() {
    onClose();
  }

  return (
    <Dialog open={open} onOpenChange={closeModal}>
      <DialogContent className="sm:max-w-[465px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <DialogDescription>{description}</DialogDescription>

        <DialogFooter>
          <Button variant="outline" onClick={closeModal} className="w-full">
            Close
          </Button>
          <Link href={href} className="w-full">
            <Button className="w-full">Upgrade</Button>
          </Link>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
