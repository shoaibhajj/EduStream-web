import Link from "next/link";

export default function ForbiddenPage() {
  return (
    <main className="mx-auto flex min-h-[70vh] max-w-xl flex-col items-center justify-center px-6 text-center">
      <h1 className="text-2xl font-semibold">403</h1>
      <p className="mt-3 text-sm text-muted-foreground">
        You do not have permission to access this page.
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex h-10 items-center justify-center rounded-md border px-4 text-sm font-medium"
      >
        Back to home
      </Link>
    </main>
  );
}
