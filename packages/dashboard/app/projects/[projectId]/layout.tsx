"use client";

import { Separator } from "@/components/ui/separator";
import ConfigNav from "./ConfigNav";
import { FC, useState } from "react";
import { useProject } from "@/lib/useProject";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { DotsHorizontalIcon, DotsVerticalIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { deleteDoc } from "firebase/firestore";
import { toast } from "@/components/ui/use-toast";
import { redirect, useRouter } from "next/navigation";

type ProjectLayoutProps = {
  children: React.ReactNode;
  params: { projectId: string };
};

const ProjectLayout: FC<ProjectLayoutProps> = ({ params, children }) => {
  const { project, doctor, ref } = useProject(params.projectId);

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const router = useRouter();

  if (!project || doctor === undefined) return <p>Loading...</p>;

  return (
    <div className="space-y-6 p-10 pb-16">
      <div className="flex justify-between space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">
          {project.admin_config.name}
        </h2>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost">
              <span className="sr-only">Actions</span>
              <DotsVerticalIcon className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onSelect={() => setShowDeleteDialog(true)}
              className="text-red-600"
            >
              Delete project
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <Separator className="my-6" />
      <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
        <aside className="-mx-4 lg:w-1/5">
          <ConfigNav
            projectId={params.projectId}
            setupComplete={
              !!Object.keys(project.portal_config.firebase_config).length
            }
            report={doctor}
          />
        </aside>
        <div className="flex-1 lg:max-w-2xl">{children}</div>
      </div>
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will delete all data associated
              with this project. If you have any apps using this project, they
              will stop working.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button
              variant="destructive"
              onClick={async () => {
                setShowDeleteDialog(false);
                await deleteDoc(ref);
                toast({
                  description: `Your project "${project.admin_config.name}" has been deleted.`,
                });
                router.push("/");
              }}
            >
              Delete
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ProjectLayout;
