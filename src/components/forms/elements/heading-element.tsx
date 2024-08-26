import React, { useEffect, useState } from "react";
import { IconHeading, IconTrash, IconCopy } from "@tabler/icons-react";
import { nanoid } from "@/libs/nanoid";
import { type FormField, type FormOutput } from "@/types/form.types";
import { FormFieldContainer } from "../form-field-container";
import { Divider } from "@/components/ui/divider";
import { ToolTip } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

interface Props {
  form: FormOutput;
  element: FormField;
  index?: number;
  selectedId?: string;
  setSelectedId: (fieldId: string) => void;
  setForm: (form: FormOutput) => void;
}

export function HeadingElement({
  element,
  index,
  selectedId,
  setSelectedId,
  form,
  setForm,
}: Props) {
  const [newId, setNewId] = useState(selectedId);

  const isSelected = element.id === selectedId;

  const updateLabelOrDescription = (
    e: React.SyntheticEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { value, name } = e.currentTarget;
    const fieldName = name as keyof FormField;

    const updatedFields = form.fields.map((el) => {
      const newElement = { ...el };
      if (el.id === element.id) {
        if (fieldName === "label" || fieldName === "description") {
          newElement[fieldName] = value;
        }
      }
      return newElement;
    });
    setForm({ ...form, fields: updatedFields });
  };

  const updateShowDescription = () => {
    const updatedFields = form.fields.map((el) => {
      const newElement = { ...el };
      if (el.id === element.id) {
        newElement.showDescription = !element.showDescription;
      }
      return newElement;
    });
    setForm({ ...form, fields: updatedFields });
  };

  const duplicateElement = () => {
    const elementId = nanoid(8);
    const newFields = [...form.fields];
    const newElement = { ...element, id: elementId };

    if (selectedId) {
      newFields.splice(
        newFields.findIndex((el) => el.id === selectedId) + 1,
        0,
        newElement,
      );
    } else {
      newFields.push(newElement);
    }

    setForm({ ...form, fields: newFields });

    setNewId(elementId);
  };

  useEffect(() => {
    setSelectedId(newId as string);
  }, [newId]);

  const deleteElement = () => {
    const updatedFields = form.fields.filter((el) => el.id !== element.id);
    setForm({ ...form, fields: updatedFields });
  };

  return (
    <FormFieldContainer
      fieldId={element.id}
      index={index}
      selectedId={selectedId}
      setSelectedId={setSelectedId}
    >
      {isSelected && (
        <div className="space-y-4">
          <div className="space-y-3">
            <input
              className="w-full border-none p-0 text-xl font-semibold focus:ring-0"
              autoFocus
              placeholder="Use this as a heading between sections of questions"
              name="label"
              defaultValue={
                element?.label ||
                "Use this as a heading between sections of questions"
              }
              onChange={updateLabelOrDescription}
            />
            {element.showDescription && (
              <textarea
                className="w-full border-none p-0 focus:ring-0"
                placeholder="Enter a description"
                name="description"
                defaultValue={element?.description}
                onChange={updateLabelOrDescription}
              />
            )}
          </div>
          <Divider />
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="">{<IconHeading size={16} />}</div>
              <p className="text-sm font-medium">Heading</p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="mr-4 flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <label className="block text-sm font-medium leading-6">
                    Show description
                  </label>
                  <Switch
                    checked={element.showDescription}
                    onCheckedChange={updateShowDescription}
                  />
                </div>
              </div>
              <ToolTip message="Duplicate">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={duplicateElement}
                >
                  <IconCopy size={16} />
                </Button>
              </ToolTip>
              <ToolTip message="Delete">
                <Button variant="outline" size="icon" onClick={deleteElement}>
                  <IconTrash size={16} className="text-red-500" />
                </Button>
              </ToolTip>
            </div>
          </div>
        </div>
      )}
      {!isSelected && (
        <div className="space-y-2">
          <div className="space-y-2">
            <h2 className="text-xl font-semibold">
              {element?.label || "Section heading"}
            </h2>
            {element.showDescription && <p>{element?.description}</p>}
          </div>
        </div>
      )}
    </FormFieldContainer>
  );
}
