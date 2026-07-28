import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

type AuthShellProps = {
  children: React.ReactNode;
  title: string;
  description: string;
  brand: string;
  tagline: string;
};

export function AuthShell({
  children,
  title,
  description,
  brand,
  tagline,
}: AuthShellProps) {
  return (
    <main className="min-h-screen bg-background text-text-primary">
      <div className="grid min-h-screen lg:grid-cols-2">
        {/* Left panel — decorative, hidden on mobile */}
        <section className="hidden bg-surface-secondary px-10 py-12 lg:flex lg:flex-col lg:justify-between border-e border-border">
          <div>
            <p className="text-sm font-semibold text-accent">{brand}</p>
          </div>

          <div className="max-w-lg space-y-5">
            <h1 className="text-4xl font-semibold leading-tight text-text-primary">
              {title}
            </h1>
            <Separator className="bg-border" />
            <p className="text-base leading-7 text-text-secondary">
              {description}
            </p>
          </div>

          <div className="text-sm text-text-muted">{tagline}</div>
        </section>

        {/* Right panel — form */}
        <section className="flex items-center justify-center px-4 py-10 sm:px-6 lg:px-10">
          <div className="w-full max-w-md">
            {/* Mobile-only header */}
            <div className="mb-6 space-y-2 text-center lg:hidden">
              <p className="text-sm font-semibold text-accent">{brand}</p>
              <h1 className="text-2xl font-semibold text-text-primary">
                {title}
              </h1>
              <p className="text-sm text-text-secondary">{description}</p>
            </div>

            {children}
          </div>
        </section>
      </div>
    </main>
  );
}
