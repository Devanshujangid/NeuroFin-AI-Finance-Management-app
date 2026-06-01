export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-[calc(100vh-64px)] bg-gradient-to-b from-white to-blue-50/30">
      {children}
    </div>
  );
}
