import { Sidebar } from "@/components/layout/sidebar";

export default function LibraryPage() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 pl-64">
        <div className="container mx-auto p-8">
          <h1 className="text-4xl font-bold">Hello from Library</h1>
        </div>
      </main>
    </div>
  );
} 