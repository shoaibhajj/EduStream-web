"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { UserButton } from "@clerk/nextjs";
import { cn } from "@/lib/utils";

type NavItem = {
  labelKey: string;
  href: string;
};

type Props = {
  role: "student" | "teacher" | "admin";
};

const studentNav: NavItem[] = [
  { labelKey: "browse", href: "/browse" },
  { labelKey: "payment", href: "/payment" },
  { labelKey: "student", href: "/student" },
];
const teacherNav: NavItem[] = [
  { labelKey: "dashboard", href: "/teacher" },
  { labelKey: "courses", href: "/teacher/courses" },
  { labelKey: "payment", href: "/teacher/payment" },
];

const adminNav: NavItem[] = [
  { labelKey: "dashboard", href: "/admin" },
  { labelKey: "teachers", href: "/admin/teachers" },
  { labelKey: "paymentConfig", href: "/admin/payment" },
  { labelKey: "paymentRequests", href: "/admin/payment/requests" },
  { labelKey: "teacherPayments", href: "/admin/payment/teachers" },
];

export function AppNav({ role }: Props) {
  const t = useTranslations("nav");
  const pathname = usePathname();

  const items =
    role === "teacher" ? teacherNav : role === "admin" ? adminNav : studentNav;

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-surface">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
        <p className="font-semibold text-text-primary">{t("brand")}</p>

        <nav className="flex items-center gap-1">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href as Parameters<typeof Link>[0]["href"]}
              className={cn(
                "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                pathname === item.href || pathname.startsWith(item.href + "/")
                  ? "bg-accent-light text-accent"
                  : "text-text-secondary hover:text-text-primary hover:bg-surface-secondary"
              )}
            >
              {t(item.labelKey)}
            </Link>
          ))}
        </nav>

        <UserButton />
      </div>
    </header>
  );
}
