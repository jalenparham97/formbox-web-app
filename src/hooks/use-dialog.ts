import { useState } from "react";

export const useDialog = (
  defaultState: boolean = false,
): [boolean, { open: () => void; close: () => void; toggle: () => void }] => {
  const [open, setOpen] = useState(defaultState);

  const handlers = {
    open: () => {
      setOpen(true);
    },
    close: () => {
      setOpen(false);
    },
    toggle: () => {
      setOpen((prev) => !prev);
    },
  };

  return [open, handlers];
};
