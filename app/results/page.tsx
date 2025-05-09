"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import SeekTable from "@/components/seek-table";

export default function ResultsPage() {
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
    <main className="flex min-h-screen flex-col items-center bg-neutral-950 py-8">
      {query ? (
        <SeekTable query={query} />
      ) : (
        <div className="flex items-center justify-center h-32 text-neutral-400">
          <span>Loading...</span>
        </div>
      )}
    </main>
  );
} 