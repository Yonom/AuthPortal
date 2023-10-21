"use client";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { FC } from "react";

type ProjectCardProps = {
  projectId: string;
  name: string;
  type: "development" | "production";
};
export const ProjectCard: FC<ProjectCardProps> = ({
  projectId,
  name,
  type,
}) => {
  return (
    <Link href={`/projects/${projectId}/setup`}>
      <Card className="w-80 cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-900">
        <CardHeader>
          <CardTitle>{name}</CardTitle>
          {type === "development" && (
            <CardDescription className="text-red-700 dark:text-red-500">
              Development
            </CardDescription>
          )}
          {type === "production" && (
            <CardDescription className="text-green-700 dark:text-green-500">
              Production
            </CardDescription>
          )}
        </CardHeader>
      </Card>
    </Link>
  );
};
