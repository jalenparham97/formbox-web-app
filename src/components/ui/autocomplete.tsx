import { nanoid } from "@/libs/nanoid";
import { cn } from "@/utils/tailwind-helpers";
import { IconCheck, IconChevronDown, IconX } from "@tabler/icons-react";
import Select, {
  type ClearIndicatorProps,
  type DropdownIndicatorProps,
  type MultiValueRemoveProps,
  type OptionProps,
  type Props as ReactSelectProps,
  components,
} from "react-select";

const DropdownIndicator = (props: DropdownIndicatorProps) => {
  return (
    <components.DropdownIndicator {...props}>
      <IconChevronDown size={18} />
    </components.DropdownIndicator>
  );
};

const Option = ({ children, isSelected, ...props }: OptionProps) => {
  return (
    <components.Option isSelected={isSelected} {...props}>
      <div className="flex items-center justify-between">
        <span className="text-sm">{children}</span>
        {isSelected && <IconCheck size={16} />}
      </div>
    </components.Option>
  );
};

const ClearIndicator = (props: ClearIndicatorProps) => {
  return (
    <components.ClearIndicator {...props}>
      <IconX size={16} />
    </components.ClearIndicator>
  );
};

const MultiValueRemove = (props: MultiValueRemoveProps) => {
  return (
    <components.MultiValueRemove {...props}>
      <IconX size={16} />
    </components.MultiValueRemove>
  );
};

const controlStyles = {
  base: "border rounded-lg bg-white hover:cursor-pointer shadow-sm ",
  focus: "border-primary ring-1 ring-primary",
  nonFocus: "border-gray-300",
};
const placeholderStyles = "text-gray-500 pl-1.5";
const selectInputStyles = "pl-1.5";
const valueContainerStyles = "pl-1 sm:text-sm";
const singleValueStyles = "leading-7 ml-1.5";
const multiValueStyles =
  "bg-gray-100 rounded items-center py-0.5 pl-2 pr-1 gap-1.5";
const multiValueLabelStyles = "leading-6 py-0.5";
const multiValueRemoveStyles =
  "border border-gray-200 bg-white hover:bg-red-50 hover:text-red-800 text-gray-500 hover:border-red-300 rounded-lg";
const indicatorsContainerStyles = "p-1 gap-1";
const clearIndicatorStyles =
  "text-gray-500 p-1 rounded-lg hover:bg-red-50 hover:text-red-800";
const dropdownIndicatorStyles =
  "p-1 hover:bg-gray-100 text-gray-500 rounded-lg hover:text-black";
const menuStyles = "p-1 mt-2 border border-gray-200 bg-white rounded-lg";
const groupHeadingStyles = "ml-3 mt-2 mb-1 text-gray-500 text-sm";
const optionStyles = {
  base: "hover:cursor-pointer px-3 py-2 rounded-lg",
  focus: "bg-gray-100 active:bg-gray-200",
  selected: "",
};
const noOptionsMessageStyles =
  "text-gray-500 p-2 bg-gray-50 border border-dashed border-gray-200 rounded-sm";
const loadingMessageStyles =
  "text-gray-500 p-2 bg-gray-50 border border-dashed border-gray-200 rounded-sm";

type Props = ReactSelectProps & {
  label?: string;
  id?: string;
  error?: boolean;
  errorMessage?: string;
  ref?: any;
  description?: string;
};

export function Autocomplete({
  label,
  id = nanoid(),
  error,
  errorMessage,
  ref,
  description,
  ...props
}: Props) {
  return (
    <div>
      {label && (
        <label id={id} className="mb-[4px] block text-sm font-medium leading-6">
          {label}
        </label>
      )}
      {description && (
        <p className="mb-2 block text-sm text-gray-500">{description}</p>
      )}
      <Select
        inputId={id}
        isSearchable
        unstyled
        styles={{
          input: (base) => ({
            ...base,
            "input:focus": {
              boxShadow: "none",
            },
          }),
          // On mobile, the label will truncate automatically, so we want to
          // override that behaviour.
          multiValueLabel: (base) => ({
            ...base,
            whiteSpace: "normal",
            overflow: "visible",
          }),
          control: (base) => ({
            ...base,
            transition: "none",
          }),
        }}
        components={{
          DropdownIndicator,
          ClearIndicator,
          MultiValueRemove,
          Option,
        }}
        classNames={{
          control: ({ isFocused }) =>
            cn(
              isFocused ? controlStyles.focus : controlStyles.nonFocus,
              controlStyles.base,
              error && "ring-red-500 border-red-500 hover:border-red-500",
              isFocused && error && "ring-red-500",
            ),
          placeholder: () => placeholderStyles,
          input: () => selectInputStyles,
          valueContainer: () => valueContainerStyles,
          singleValue: () => singleValueStyles,
          multiValue: () => multiValueStyles,
          multiValueLabel: () => multiValueLabelStyles,
          multiValueRemove: () => multiValueRemoveStyles,
          indicatorsContainer: () => indicatorsContainerStyles,
          clearIndicator: () => clearIndicatorStyles,
          dropdownIndicator: () => dropdownIndicatorStyles,
          menu: () => menuStyles,
          groupHeading: () => groupHeadingStyles,
          option: ({ isFocused, isSelected }) =>
            cn(
              isFocused && optionStyles.focus,
              isSelected && optionStyles.selected,
              optionStyles.base,
              "text-sm",
            ),
          noOptionsMessage: () => noOptionsMessageStyles,
          loadingMessage: () => loadingMessageStyles,
        }}
        ref={ref}
        placeholder={props.placeholder || ""}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-red-500">{errorMessage}</p>}
    </div>
  );
}
