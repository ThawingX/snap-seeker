"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import SeekTable from "@/components/seek-table";

function ResultsContent() {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState<string>("");
  
  useEffect(() => {
    // Get query from URL or sessionStorage
    const urlQuery = searchParams.get("query");
    const storedQuery = typeof window !== "undefined" ? sessionStorage.getItem("searchQuery") : null;
    
    if (urlQuery) {
      setQuery(urlQuery);
    } else if (storedQuery) {
      setQuery(storedQuery);
    }
  }, [searchParams]);

  return (
    <>
      {query ? (
        <SeekTable query={query} />
      ) : (
        <div className="flex items-center justify-center h-32 text-neutral-400">
          <span>Loading...</span>
        </div>
      )}
    </>
  );
}

export default function ResultsPage() {
  return (
    <main className="flex min-h-screen flex-col items-center bg-neutral-950 py-8">
      <Suspense fallback={
        <div className="flex items-center justify-center h-32 text-neutral-400">
          <span>Loading results...</span>
        </div>
      }>
        <ResultsContent />
      </Suspense>
    </main>
  );
} 