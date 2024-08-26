import { IconInfoCircle } from "@tabler/icons-react";

interface Props {
  message?: string;
}

export function ViewAlert({
  message = "You are viewing this form as a viewer.",
}: Props) {
  return (
    <div className="rounded-xl bg-blue-50 p-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <IconInfoCircle
            className="h-5 w-5 text-blue-400"
            aria-hidden="true"
          />
        </div>
        <div className="ml-3 flex-1 md:flex md:justify-between">
          <p className="text-sm text-blue-700">{message}</p>
        </div>
      </div>
    </div>
  );
}
