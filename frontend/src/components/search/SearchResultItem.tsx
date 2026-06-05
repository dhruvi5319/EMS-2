import { Briefcase } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { SearchResult } from '@/hooks/useSearch';

interface SearchResultItemProps {
  result: SearchResult;
  query: string;
  onSelect: (result: SearchResult) => void;
}

// Highlight matching substring in blue-100/blue-800
function HighlightMatch({ text, query }: { text: string; query: string }) {
  if (!query || query.length < 2) return <>{text}</>;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="bg-blue-100 text-blue-800 not-italic">{text.slice(idx, idx + query.length)}</mark>
      {text.slice(idx + query.length)}
    </>
  );
}

// Phase badge color map (from UI-SPEC status colors)
const PHASE_COLORS: Record<string, string> = {
  planning: 'bg-blue-100 text-blue-800',
  evidence: 'bg-teal-100 text-teal-800',
  draft: 'bg-purple-100 text-purple-800',
  readiness: 'bg-orange-100 text-orange-800',
  ready_for_issuance: 'bg-green-100 text-green-800',
  closed: 'bg-gray-100 text-gray-600',
};

export function SearchResultItem({ result, query, onSelect }: SearchResultItemProps) {
  const phaseColor = PHASE_COLORS[result.phase?.toLowerCase()] ?? 'bg-gray-100 text-gray-600';

  return (
    <div
      className="flex items-start gap-3 px-4 py-3 cursor-pointer hover:bg-muted transition-colors"
      onClick={() => onSelect(result)}
      role="option"
    >
      <Briefcase size={16} className="text-muted-foreground mt-0.5 shrink-0" aria-hidden="true" />
      <div className="flex-1 min-w-0">
        {/* Primary: title with match highlight — 14px/600 */}
        <p className="text-sm font-semibold text-foreground truncate">
          <HighlightMatch text={result.title ?? result.job_code} query={query} />
        </p>
        {/* Secondary: ID + phase badge + owner — 12px/400 muted */}
        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
          <span className="text-xs text-muted-foreground font-mono">{result.job_code}</span>
          {result.phase && (
            <span className={cn('text-xs px-1.5 py-0.5 rounded font-medium', phaseColor)}>
              {result.phase.charAt(0).toUpperCase() + result.phase.slice(1)}
            </span>
          )}
          {result.owner_name && (
            <span className="text-xs text-muted-foreground">{result.owner_name}</span>
          )}
        </div>
      </div>
    </div>
  );
}
