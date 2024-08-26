interface AlertProps {
  message?: string;
}

export function AlertSuccess({ message }: AlertProps) {
  if (!message) return null;

  return (
    <div className="flex items-center space-x-3 rounded-lg bg-emerald-500/15 p-3 text-sm text-emerald-500">
      {/* <IconCircleCheck className="h-5 w-5" /> */}
      <p>{message}</p>
    </div>
  );
}
