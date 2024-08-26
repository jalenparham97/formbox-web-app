import { useHover } from "@/hooks/use-hover";
import { cn } from "@/utils/tailwind-helpers";
import { Draggable } from "@hello-pangea/dnd";
import { IconGripHorizontal } from "@tabler/icons-react";
import { Card } from "../ui/card";
import type { FormField } from "@/types/form.types";
interface FormFieldContainerProps {
  children: React.ReactNode;
  fieldId: string | number;
  index?: number;
  selectedId?: string;
  setSelectedId: (fieldId: any) => void;
  element?: FormField;
}

export function FormFieldContainer({
  children,
  fieldId,
  index = 0,
  selectedId,
  setSelectedId,
  element,
}: FormFieldContainerProps) {
  const { hovered, ref } = useHover();

  const handleSelect = () => setSelectedId(fieldId);

  const isSelected = fieldId === selectedId;

  return (
    <Draggable key={fieldId} draggableId={fieldId as string} index={index}>
      {(provided, snapshot) => (
        <div ref={ref}>
          {isSelected && (
            <div ref={provided.innerRef} {...provided.draggableProps}>
              <Card
                onClick={handleSelect}
                className={cn(
                  "relative border-gray-600 border-opacity-20 p-5",
                  isSelected && "border-opacity-50 shadow-lg",
                )}
              >
                <div
                  className="absolute -top-[2px] left-[48%] cursor-grab"
                  {...provided.dragHandleProps}
                >
                  {element?.subtype === "page" ? null : (
                    <IconGripHorizontal className="text-gray-500" />
                  )}
                </div>
                {children}
              </Card>
            </div>
          )}
          {!isSelected && (
            <div
              ref={provided.innerRef}
              {...provided.draggableProps}
              className="cursor-pointer"
            >
              <Card
                onClick={handleSelect}
                className={cn(
                  "relative cursor-pointer border-gray-600 border-opacity-20 p-5",
                  isSelected && "border-opacity-50 shadow-lg",
                )}
              >
                {(hovered || snapshot.isDragging) && (
                  <div
                    className="absolute -top-[2px] left-[48%] cursor-grab"
                    {...provided.dragHandleProps}
                  >
                    {element?.subtype === "page" ? null : (
                      <IconGripHorizontal className="text-gray-500" />
                    )}
                  </div>
                )}
                <div className="cursor-pointer">{children}</div>
              </Card>
            </div>
          )}
        </div>
      )}
    </Draggable>
  );
}
