interface Props {
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  actionButton?: React.ReactNode;
}

export function EmptyState({ title, subtitle, icon, actionButton }: Props) {
  return (
    <div className="flex flex-col items-center">
      {icon}
      <h3 className="mt-4 text-lg font-semibold text-gray-900">{title}</h3>
      <p className="mt-3 text-gray-600">{subtitle}</p>
      <div className="mt-6">{actionButton}</div>
    </div>
  );
}
