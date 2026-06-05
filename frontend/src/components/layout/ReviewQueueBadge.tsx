interface ReviewQueueBadgeProps {
  count: number;
}

export function ReviewQueueBadge({ count }: ReviewQueueBadgeProps) {
  if (count <= 0) return null;

  return (
    <span
      className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs font-medium leading-none"
      aria-label={`${count} items pending`}
    >
      {count > 99 ? '99+' : count}
    </span>
  );
}
