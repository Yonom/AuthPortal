"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const handleNew = () => {
    router.push("/new");
  };

  return (
    <div className="flex flex-1 flex-col gap-6">
      <h2 className="text-3xl font-bold tracking-tight">Projects</h2>
      <div>
        <Button onClick={handleNew}>New Project</Button>
      </div>
      <div className="flex flex-row gap-4">
        <Link href="/apps/test/setup">
          <Card className="w-80 cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-900">
            <CardHeader>
              <CardTitle>App 1</CardTitle>
              <CardDescription className="text-red-700 dark:text-red-500">
                Development
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>
        <Card className="w-80 cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-900">
          <CardHeader>
            <CardTitle>App 1</CardTitle>
            <CardDescription className="text-green-700 dark:text-green-500">
              Production
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
      {/* TODO list projects here */}
    </div>
  );
}
