import { cn } from "@/lib/utils";

interface SectionCardProps {
  children: React.ReactNode;
  className?: string;
}

export function SectionCard({ children, className }: SectionCardProps) {
  return (
    <div
      className={cn(
        "bg-surface border border-border rounded-xl p-6",
        className
      )}
    >
      {children}
    </div>
  );
}
