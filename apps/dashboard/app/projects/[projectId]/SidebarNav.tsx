"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@authportal/common-ui/lib/utils";
import { buttonVariants } from "@authportal/common-ui/components/ui/button";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  items: {
    href: string;
    title: string;
    hasWarnings: boolean;
  }[];
}

export function SidebarNav({ className, items, ...props }: SidebarNavProps) {
  const pathname = usePathname();
  return (
    <nav
      className={cn(
        "flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1",
        className,
      )}
      {...props}
    >
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            buttonVariants({ variant: "ghost" }),
            pathname === item.href
              ? "bg-zinc-100 dark:bg-zinc-900"
              : "hover:bg-transparent hover:bg-zinc-100 hover:underline",
            "justify-between",
          )}
        >
          {item.title}
          {item.hasWarnings && (
            <ExclamationTriangleIcon className="ml-2 inline h-4 w-4 text-red-600 dark:text-red-600" />
          )}
        </Link>
      ))}
    </nav>
  );
}
