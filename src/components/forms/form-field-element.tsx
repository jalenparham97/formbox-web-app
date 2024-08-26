interface FormFieldElementProps {
  icon?: React.ReactNode;
  name?: string;
  onClick?: () => void;
}

export function FormFieldElement({
  icon,
  name,
  onClick,
}: FormFieldElementProps) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full cursor-pointer items-center space-x-5 rounded-xl border border-gray-300 bg-card px-4 py-3 text-card-foreground shadow-sm transition-colors hover:border-gray-900`}
    >
      <span className="">{icon}</span>
      <p className="text-sm font-medium">{name}</p>
    </button>
  );
}
