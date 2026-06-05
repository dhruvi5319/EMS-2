import { Link } from 'react-router-dom';

interface AuditObjectLinkProps {
  label: string;
  href: string;
}

// 12px/400 accent color with → suffix, per UI-SPEC
export function AuditObjectLink({ label, href }: AuditObjectLinkProps) {
  return (
    <Link
      to={href}
      className="text-xs text-primary hover:underline mr-3"
    >
      {label} →
    </Link>
  );
}
