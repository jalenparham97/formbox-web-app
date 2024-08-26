import { type ColorResult, SketchPicker } from "react-color";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

interface Props {
  color: string;
  onColorChange: (color: ColorResult) => void;
}

export function FormColorPicker({ color, onColorChange }: Props) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className="cursor-pointer rounded-md border border-gray-300 bg-white p-[5px] shadow-sm">
          <div
            className="h-5 w-12 rounded"
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
