import { Command, CommandList, CommandGroup, CommandItem } from '@/components/ui/command';
import { Skeleton } from '@/components/ui/skeleton';
import type { SearchResult } from '@/hooks/useSearch';
import { SearchResultItem } from './SearchResultItem';

interface SearchResultsOverlayProps {
  query: string;
  results: SearchResult[];
  loading: boolean;
  open: boolean;
  onSelect: (result: SearchResult) => void;
}

export function SearchResultsOverlay({
  query,
  results,
  loading,
  open,
  onSelect,
}: SearchResultsOverlayProps) {
  if (!open) return null;

  return (
    <div
      className="absolute top-full left-0 right-0 mt-1 z-50 bg-background border border-border rounded-lg shadow-lg overflow-hidden"
      style={{ maxWidth: 640, maxHeight: 480 }}
      role="listbox"
      aria-label="Search results"
      aria-busy={loading}
      aria-live="polite"
    >
      {/* Min chars not met */}
      {query.length > 0 && query.length < 2 && (
        <div className="px-4 py-3 text-sm text-muted-foreground">
          Type at least 2 characters to search.
        </div>
      )}

      {/* Loading state — 3 skeleton rows per UI-SPEC */}
      {loading && query.length >= 2 && (
        <div className="py-2">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex items-start gap-3 px-4 py-3">
              <Skeleton className="w-4 h-4 rounded mt-0.5 shrink-0" />
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-4 w-3/4 rounded" />
                <Skeleton className="h-3 w-1/2 rounded" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Results */}
      {!loading && query.length >= 2 && results.length > 0 && (
        <Command shouldFilter={false}>
          <CommandList>
            <CommandGroup>
              {results.map((result) => (
                <CommandItem
                  key={result.id}
                  value={result.id}
                  onSelect={() => onSelect(result)}
                  className="p-0 cursor-pointer"
                >
                  <SearchResultItem result={result} query={query} onSelect={onSelect} />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      )}

      {/* No match state */}
      {!loading && query.length >= 2 && results.length === 0 && (
        <div className="px-4 py-6 text-center">
          <p className="text-sm font-semibold text-foreground mb-1">No engagements found.</p>
          <p className="text-sm text-muted-foreground">Try different keywords or check your spelling.</p>
        </div>
      )}
    </div>
  );
}
