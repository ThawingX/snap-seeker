export default function AnalysisLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // This layout doesn't include the sidebar
  return (
    <div className="flex min-h-screen flex-col bg-black">
      <main className="flex-1">{children}</main>
    </div>
  );
} 