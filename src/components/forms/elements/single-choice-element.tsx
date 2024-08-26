import { useEffect, useState } from "react";
import {
  IconPlus,
  IconX,
  IconTrash,
  IconCircleCheck,
  IconCopy,
} from "@tabler/icons-react";
import { nanoid } from "@/libs/nanoid";
import { type FormField, type FormOutput } from "@/types/form.types";
import { FormFieldContainer } from "../form-field-container";
import { Input } from "@/components/ui/input";
import { Divider } from "@/components/ui/divider";
import { ToolTip } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface Props {
  form: FormOutput;
  element: FormField;
  index?: number;
  selectedId?: string;
  setSelectedId: (fieldId: string) => void;
  setForm: (form: FormOutput) => void;
}

export function SingleChoiceElement({
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

  const addOption = () => {
    const updatedElement = { ...element };

    if (element.options) {
      updatedElement.options = [
        ...element.options,
        { id: nanoid(), value: `Option ${element.options.length + 1}` },
      ];
    }

    setForm({
      ...form,
      fields: form.fields.map((element) => {
        if (element.id === updatedElement.id) {
          return updatedElement;
        }
        return element;
      }),
    });
  };

  const updateOption = (e: React.SyntheticEvent<HTMLInputElement>) => {
    const { id, value } = e.currentTarget;
    const updatedElement = { ...element };

    const updatedOptions = updatedElement.options?.map((option) => {
      if (id === option.id) {
        return { ...option, value: value.trim() };
      }
      return option;
    });

    updatedElement.options = updatedOptions;

    setForm({
      ...form,
      fields: form.fields.map((element) => {
        if (element.id === updatedElement.id) {
          return { ...updatedElement };
        }
        return { ...element };
      }),
    });
  };

  const deleteOption = (id: string) => {
    const updatedElement = { ...element };

    updatedElement.options = element.options?.filter(
      (option) => option.id !== id,
    );

    setForm({
      ...form,
      fields: form.fields.map((element) => {
        if (element.id === updatedElement.id) {
          return updatedElement;
        }
        return element;
      }),
    });
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
              defaultValue={element?.label || "Single choice selection"}
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

            <div className="space-y-2">
              {element.options?.map((option) => (
                <div className="flex w-full items-center" key={option.id}>
                  <input type="radio" value="" disabled />
                  <div className="ml-3 w-full">
                    <Input
                      id={option.id}
                      placeholder="Enter and option"
                      defaultValue={option.value}
                      onChange={updateOption}
                    />
                  </div>
                  <Button
                    className="ml-3 h-9 w-10"
                    variant="outline"
                    onClick={() => deleteOption(option.id)}
                    size="icon"
                  >
                    <IconX size={16} />
                  </Button>
                </div>
              ))}
            </div>

            <Button
              variant="outline"
              leftIcon={<IconPlus size={14} />}
              onClick={addOption}
              size="sm"
            >
              Add option
            </Button>
          </div>
          <Divider />
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="">{<IconCircleCheck size={18} />}</div>
              <p className="text-sm font-medium">Single choice</p>
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
          <RadioGroup label={element?.label} description={element?.description}>
            {element.options?.map((option) => (
              <div className="flex items-center space-x-2" key={option.id}>
                <RadioGroupItem value="default" id={option.id} disabled />
                <label className="text-sm" htmlFor={option.id}>
                  {option.value}
                </label>
              </div>
            ))}
          </RadioGroup>
        </div>
      )}
    </FormFieldContainer>
  );
}
