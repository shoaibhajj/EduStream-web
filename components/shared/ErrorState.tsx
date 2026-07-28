import { cn } from "@/lib/utils";

interface ErrorStateProps {
  message: string;
  className?: string;
}

export function ErrorState({ message, className }: ErrorStateProps) {
  return (
    <div
      className={cn(
        "rounded-lg border border-error/20 bg-error/5 px-4 py-3 text-sm text-error",
        className
      )}
    >
      {message}
    </div>
  );
}
