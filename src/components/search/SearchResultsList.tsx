
"use client";

import type { BusSearchResult } from '@/lib/types';
import { SearchResultCard } from './SearchResultCard';

interface SearchResultsListProps {
  results: BusSearchResult[];
}

export function SearchResultsList({ results }: SearchResultsListProps) {
  if (!results || results.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-lg font-semibold">No buses found matching your criteria.</p>
        <p className="text-muted-foreground">Please try a different search.</p>
      </div>
    );
  }

  return (
    <section className="py-8">
      <h2 className="text-2xl font-semibold mb-6 text-center md:text-left">Available Buses</h2>
      <div className="space-y-6">
        {results.map((result) => (
          <SearchResultCard key={result.busId + result.routeId} result={result} />
        ))}
      </div>
    </section>
  );
}
