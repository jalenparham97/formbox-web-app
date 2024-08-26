export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen flex-1 flex-col bg-gray-50 px-6 py-36 lg:px-8">
      {children}
    </div>
  );
}
