import { cn } from "@/lib/utils";

interface EmptyStateProps {
  message: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  message,
  icon,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 py-12 text-center",
        className
      )}
    >
      {icon && <span className="text-text-muted [&>svg]:size-8">{icon}</span>}
      <p className="text-sm text-text-muted max-w-xs">{message}</p>
      {action && <div>{action}</div>}
    </div>
  );
}
