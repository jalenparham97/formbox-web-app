export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen flex-1 flex-col px-6 py-36 lg:px-8">
      {children}
    </div>
  );
}
