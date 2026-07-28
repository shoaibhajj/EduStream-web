import { cn } from "@/lib/utils";

interface EmptyStateProps {
  message?: string;
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  message,
  title,
  description,
  icon,
  action,
  className,
}: EmptyStateProps) {
  const resolvedTitle = title;
  const resolvedDescription = description ?? message;

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 py-12 text-center",
        className
      )}
    >
      {icon ? (
        <span className="text-text-muted [&>svg]:size-8">{icon}</span>
      ) : null}

      {resolvedTitle ? (
        <h3 className="text-base font-medium text-text-primary">
          {resolvedTitle}
        </h3>
      ) : null}

      {resolvedDescription ? (
        <p className="max-w-xs text-sm text-text-muted">
          {resolvedDescription}
        </p>
      ) : null}

      {action ? <div>{action}</div> : null}
    </div>
  );
}
