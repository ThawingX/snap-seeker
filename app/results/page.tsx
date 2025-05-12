"use client";

import React, { useEffect, useState, Suspense } from "react";
import SeekTable from "@/components/seek-table";
import { useSearchParams } from "next/navigation";

function ResultsContent() {
  const [query, setQuery] = useState<string>("");
  const [searchId, setSearchId] = useState<string>("");
  const searchParams = useSearchParams();
  
  useEffect(() => {
    // Get query from localStorage based on URL id parameter
    const id = searchParams.get("id");
    if (id && typeof window !== "undefined") {
      const storedQuery = localStorage.getItem(id);
      if (storedQuery) {
        setQuery(JSON.parse(storedQuery).query);
        setSearchId(id);
      }
    }
  }, [searchParams]);

  return (
    <>
      {query ? (
        <SeekTable query={query} searchId={searchId} />
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