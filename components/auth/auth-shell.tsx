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
        <section className="hidden bg-surface-offset px-10 py-12 lg:flex lg:flex-col lg:justify-between">
          <div>
            <p className="text-sm font-medium text-text-secondary">{brand}</p>
          </div>

          <div className="max-w-lg space-y-5">
            <h1 className="text-4xl font-semibold leading-tight text-text-primary">
              {title}
            </h1>
            <p className="text-base leading-7 text-text-secondary">
              {description}
            </p>
          </div>

          <div className="text-sm text-text-secondary">{tagline}</div>
        </section>

        <section className="flex items-center justify-center px-4 py-10 sm:px-6 lg:px-10">
          <div className="w-full max-w-md">
            <div className="mb-6 space-y-2 text-center lg:hidden">
              <p className="text-sm text-text-secondary">{brand}</p>
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
