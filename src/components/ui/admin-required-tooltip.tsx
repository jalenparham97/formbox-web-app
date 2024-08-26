import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./tooltip";

interface Props {
  children: React.ReactNode;
  message: string;
}

export function AdminRequiredTooltip({ children, message }: Props) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger className="cursor-not-allowed">
          {children}
        </TooltipTrigger>
        <TooltipContent>
          <p>{message}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
