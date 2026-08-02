import { auth } from "@clerk/nextjs/server";
import { redirect } from "@/i18n/navigation";
import { AppNav } from "@/components/shared/app-nav";
import { prisma } from "@/lib/prisma";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function StudentLayout({ children, params }: Props) {
  const { locale } = await params;
  const { userId } = await auth();

  if (!userId) {
    redirect({ href: "/sign-in", locale });
  }

  const profile = await prisma.profile.findUnique({
    where: { clerkUserId: userId! },
    select: { role: true },
  });

//   if (profile?.role !== "student") {
//     redirect({ href: "/", locale });
//   }

  return (
    <div className="min-h-screen bg-background">
      <AppNav role="student" />
      <main className="mx-auto max-w-6xl px-6 py-8">{children}</main>
    </div>
  );
}
