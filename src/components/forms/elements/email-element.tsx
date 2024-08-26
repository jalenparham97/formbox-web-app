import { useEffect, useState } from "react";
import { IconAt, IconTrash, IconCopy } from "@tabler/icons-react";
import { nanoid } from "@/libs/nanoid";
import { type FormField, type FormOutput } from "@/types/form.types";
import { FormFieldContainer } from "../form-field-container";
import { Input } from "@/components/ui/input";
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

export function EmailElement({
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
    e: React.SyntheticEvent<HTMLInputElement>,
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

  const updateIsRequired = () => {
    const updatedFields = form.fields.map((el) => {
      const newElement = { ...el };
      if (el.id === element.id) {
        newElement.required = !element.required;
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
              className="w-full border-none p-0 font-semibold focus:ring-0"
              autoFocus
              placeholder="Enter a question"
              name="label"
              defaultValue={element?.label}
              onChange={updateLabelOrDescription}
            />

            {element?.showDescription && (
              <input
                className="w-full border-none p-0 text-gray-600 focus:ring-0"
                autoFocus
                placeholder="Enter a description"
                name="description"
                defaultValue={element?.description}
                onChange={updateLabelOrDescription}
              />
            )}
            <Input placeholder="Recipient's answer goes here" disabled />
          </div>
          <Divider />
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="">{<IconAt size={16} />}</div>
              <p className="text-sm font-medium">Email input</p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="mr-4 flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <label className="block text-sm font-medium leading-6">
                    Required
                  </label>
                  <Switch
                    checked={element.required}
                    onCheckedChange={updateIsRequired}
                  />
                </div>
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
          <Input
            label={element?.label || "Email"}
            description={element?.description}
            placeholder="Recipient's answer goes here"
            required={element?.required}
            className="cursor-pointer"
            classNames={{ label: "cursor-pointer" }}
          />
        </div>
      )}
    </FormFieldContainer>
  );
}
