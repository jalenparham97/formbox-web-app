import { useState } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/utils/tailwind-helpers";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { type ActiveModifiers } from "react-day-picker";
import { Label } from "./label";

export interface DatePickerProps {
  label?: string;
  date?: Date | null | undefined;
  onChange?: (date: Date) => void;
  description?: string;
  required?: boolean;
  error?: boolean;
  errorMessage?: string;
  className?: string;
  classNames?: {
    label?: string;
    day_selected?: string;
    description?: string;
  };
  styles?: {
    label?: React.CSSProperties;
    day?: React.CSSProperties;
    description?: React.CSSProperties;
  };
  style?: React.CSSProperties;
}

export function DatePicker({
  label,
  description,
  error,
  errorMessage,
  date,
  onChange,
  className,
  classNames,
  style,
  styles,
}: DatePickerProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null | undefined>(
    date,
  );

  function selectDate(
    _day: Date | undefined,
    selectedDay: Date,
    _activeModifiers: ActiveModifiers,
    _e: React.MouseEvent,
  ) {
    // console.log("day: ", day);
    // console.log("selectedDay: ", selectedDay);
    // console.log("activeModifiers: ", activeModifiers);
    // console.log("e: ", e);
    // return onChange ? onChange(selectedDay) : setSelectedDate(selectedDay);
    if (onChange) {
      onChange(selectedDay);
    }
    setSelectedDate(selectedDay);
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className="w-full">
          {label && <Label className={cn(classNames?.label)}>{label}</Label>}
          {description && (
            <p
              className="block text-sm text-gray-500"
              style={styles?.description}
            >
              {description}
            </p>
          )}
          <Button
            type="button"
            leftIcon={<CalendarIcon size={16} />}
            variant={"outline"}
            className={cn(
              "w-full justify-start px-2 font-normal focus-visible:ring-offset-0",
              !date && "text-muted-foreground",
              label && "mt-[5px]",
              className,
            )}
            style={style}
          >
            {selectedDate ? (
              <span className="text-black">
                {format(selectedDate as Date, "PPP")}
              </span>
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
          {error && <p className="mt-1 text-sm text-red-500">{errorMessage}</p>}
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          defaultMonth={date as Date}
          selected={selectedDate as Date}
          onSelect={selectDate}
          initialFocus
          className={cn(className)}
          classNames={{
            day_selected: cn(
              "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
              classNames?.day_selected,
            ),
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
