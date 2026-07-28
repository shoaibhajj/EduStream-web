import { cn } from "@/lib/utils";

type BadgeVariant =
  | "preview"
  | "accessible"
  | "locked"
  | "pending"
  | "confirmed"
  | "rejected"
  | "success"
  | "secondary";

interface StatusBadgeProps {
  variant: BadgeVariant;
  label: string;
  icon?: React.ReactNode;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  preview: "bg-success-light text-success",
  accessible: "bg-accent-light text-accent",
  locked: "bg-surface-secondary text-locked",
  pending: "bg-warning/10 text-warning",
  confirmed: "bg-success-light text-success",
  rejected: "bg-error/10 text-error",
  success: "bg-success-light text-success",
  secondary: "bg-surface-secondary text-text-secondary",
};

export function StatusBadge({
  variant,
  label,
  icon,
  className,
}: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
        variantStyles[variant],
        className
      )}
    >
      {icon}
      {label}
    </span>
  );
}
