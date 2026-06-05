import { AuditEvent } from '@/hooks/useAuditTrail';
import { ActionCodeBadge } from './ActionCodeBadge';
import { AuditObjectLink } from './AuditObjectLink';

interface AuditEventCardProps {
  event: AuditEvent;
}

function formatTimestamp(isoString: string): string {
  const d = new Date(isoString);
  const date = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const time = d.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
  return `${date}  ${time}`;
}

export function AuditEventCard({ event }: AuditEventCardProps) {
  const actorRoles = Array.isArray(event.actor_roles)
    ? event.actor_roles
    : typeof event.actor_roles === 'string'
      ? JSON.parse(event.actor_roles)
      : [];

  // Build object links from entity_type + entity_id if present
  const objectLinks: Array<{ label: string; href: string }> = [];
  if (event.engagement_id) {
    objectLinks.push({ label: 'Engagement', href: `/engagements/${event.engagement_id}` });
  }
  if (event.entity_type === 'gate_decision' && event.entity_id) {
    objectLinks.push({ label: 'Gate Decision', href: `/engagements/${event.engagement_id}` });
  }

  return (
    <div className="bg-background border border-border rounded-md p-4 mb-2">
      {/* Row 1: timestamp (left) + actor name + role badges (right) */}
      <div className="flex items-center justify-between mb-2">
        <span
          className="text-xs text-muted-foreground"
          style={{ fontFamily: "ui-monospace, 'Cascadia Code', 'Source Code Pro', monospace" }}
        >
          {formatTimestamp(event.created_at)}
        </span>
        <div className="flex items-center gap-1.5">
          <span className="text-sm text-foreground">{event.actor_name}</span>
          {actorRoles.map((role: string) => (
            <span
              key={role}
              className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-primary text-primary-foreground"
            >
              {role}
            </span>
          ))}
        </div>
      </div>

      {/* Row 2: action code badge */}
      <div className="mb-2">
        <ActionCodeBadge action={event.action} />
      </div>

      {/* Row 3: summary text (14px/400) */}
      <p className="text-sm text-foreground mb-2">{event.summary}</p>

      {/* Row 4: object links (12px/400 accent) */}
      {objectLinks.length > 0 && (
        <div className="flex flex-wrap">
          {objectLinks.map(({ label, href }) => (
            <AuditObjectLink key={label} label={label} href={href} />
          ))}
        </div>
      )}
    </div>
  );
}
