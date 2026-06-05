import { useState, useRef, useCallback, useEffect } from 'react';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useSearch, type SearchResult } from '@/hooks/useSearch';
import { SearchResultsOverlay } from './SearchResultsOverlay';

export function GlobalSearchBar() {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const { results, loading } = useSearch(query);

  // ⌘K / Ctrl+K keyboard shortcut — opens search per UI-SPEC
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        setOpen(true);
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Close overlay on click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [open]);

  const handleFocus = () => setOpen(true);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setOpen(false);
      inputRef.current?.blur();
    }
  };

  const handleSelect = useCallback(
    (result: SearchResult) => {
      setOpen(false);
      setQuery('');
      navigate(`/engagements/${result.id}`);
    },
    [navigate]
  );

  const showOverlay = open && (query.length > 0);

  return (
    <div ref={containerRef} className="relative flex-1 mx-6 max-w-[640px]">
      <div className="relative">
        {/* Search icon */}
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
          aria-hidden="true"
        />

        {/* Search input — 320px desktop, full-width on smaller viewports */}
        <input
          ref={inputRef}
          type="text"
          role="combobox"
          aria-expanded={showOverlay}
          aria-haspopup="listbox"
          aria-label="Search engagements"
          aria-controls="search-results"
          aria-autocomplete="list"
          aria-busy={loading}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (e.target.value.length > 0) setOpen(true);
          }}
          onFocus={handleFocus}
          onKeyDown={handleKeyDown}
          placeholder="Search engagements, requests..."
          className={cn(
            'w-full h-9 rounded-md border border-border pl-9 pr-16 text-sm text-foreground placeholder:text-muted-foreground',
            'bg-secondary focus:bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring transition-colors',
            'min-w-[280px] md:min-w-[320px]'
          )}
        />

        {/* ⌘K hint — desktop only */}
        <span
          className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hidden lg:block pointer-events-none"
          aria-hidden="true"
        >
          ⌘K
        </span>
      </div>

      {/* Results overlay */}
      <SearchResultsOverlay
        query={query}
        results={results}
        loading={loading}
        open={showOverlay}
        onSelect={handleSelect}
      />
    </div>
  );
}
