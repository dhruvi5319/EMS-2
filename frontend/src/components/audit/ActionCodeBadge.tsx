interface ActionCodeBadgeProps {
  action: string;
}

// Action code badge — monospace 12px/400, gray-100 bg, gray-600 text, 4px radius
export function ActionCodeBadge({ action }: ActionCodeBadgeProps) {
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-600"
      style={{ fontFamily: "ui-monospace, 'Cascadia Code', 'Source Code Pro', monospace" }}
    >
      {action}
    </span>
  );
}
