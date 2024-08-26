import { type ColorResult, SketchPicker } from "react-color";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { cn } from "@/utils/tailwind-helpers";

interface Props {
  color: string;
  onColorChange: (color: ColorResult) => void;
  colorClassName?: string;
  className?: string;
}

export function ColorPicker({
  color,
  onColorChange,
  colorClassName,
  className,
}: Props) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <div
          className={cn(
            "cursor-pointer rounded-md border border-gray-300 bg-white p-[5px] shadow-sm",
            className,
          )}
        >
          <div
            className={cn("h-5 w-12 rounded", colorClassName)}
            style={{
              backgroundColor: color,
            }}
          ></div>
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="end">
        <SketchPicker color={color} onChange={onColorChange} width="235px" />
      </PopoverContent>
    </Popover>
  );
}
