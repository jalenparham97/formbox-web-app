interface AlertProps {
  message?: string;
}

export function AlertError({ message }: AlertProps) {
  if (!message) return null;

  return (
    <div className="flex items-center space-x-3 rounded-lg bg-destructive/15 p-3 text-sm text-destructive">
      {/* <IconAlertTriangle className="h-5 w-5" /> */}
      <p>{message}</p>
    </div>
  );
}
