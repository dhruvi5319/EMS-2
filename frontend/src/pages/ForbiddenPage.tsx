import { ShieldX } from 'lucide-react';
import { Link } from 'react-router-dom';

export function ForbiddenPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div className="max-w-[480px] w-full text-center px-6">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <ShieldX
            size={48}
            className="text-destructive"
            aria-hidden="true"
          />
        </div>

        {/* Heading — 20px/600 per UI-SPEC */}
        <h1 className="text-xl font-semibold text-foreground mb-3">
          Access Denied
        </h1>

        {/* Body — 14px/400 muted per UI-SPEC */}
        <p className="text-sm text-muted-foreground mb-6">
          You don&apos;t have permission to view this page. Contact your administrator if you believe this is an error.
        </p>

        {/* Back link — exact copywriting from UI-SPEC */}
        <Link
          to="/dashboard"
          className="text-sm text-primary hover:underline"
        >
          ← Go back to Dashboard
        </Link>
      </div>
    </div>
  );
}
