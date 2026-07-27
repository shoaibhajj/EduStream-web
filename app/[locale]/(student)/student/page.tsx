import { currentUser } from "@clerk/nextjs/server";

export default async function StudentPage() {
  const user = await currentUser();
  return (
    <main className="min-h-screen bg-background p-8">
      <p className="text-sm text-text-secondary">أكاديمية المعلم</p>
      <h1 className="mt-2 text-2xl font-semibold">
        مرحباً، {user?.firstName ?? "طالب"}
      </h1>
    </main>
  );
}
