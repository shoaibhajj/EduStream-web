export default function HomePage() {
  return (
    <main className="min-h-screen bg-background text-text-primary">
      <section className="mx-auto flex min-h-screen max-w-5xl flex-col justify-center gap-6 px-6 py-16">
        <p className="text-sm text-text-secondary">Moallem Academy</p>
        <h1 className="text-3xl font-semibold">
          Real web foundation is active.
        </h1>
        <p className="max-w-2xl text-base text-text-secondary">
          Next.js App Router, Clerk authentication, and Supabase foundation are
          now connected for the web app.
        </p>
      </section>
    </main>
  );
}
