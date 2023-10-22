"use client";

import { Separator } from "@/components/ui/separator";
import ConfigNav from "./ConfigNav";
import { FC, useEffect, useState } from "react";
import { useProject } from "@/lib/useProject";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { DotsVerticalIcon } from "@radix-ui/react-icons";
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
import {
  DocumentReference,
  deleteDoc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Project } from "@/lib/firebase";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

type ProjectLayoutProps = {
  children: React.ReactNode;
  params: { projectId: string };
};

const ProjectLayout: FC<ProjectLayoutProps> = ({ params, children }) => {
  const { project, doctor, projectRef } = useProject(params.projectId);

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showRenameDialog, setShowRenameDialog] = useState(false);

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
            <DropdownMenuItem onSelect={() => setShowRenameDialog(true)}>
              Rename project
            </DropdownMenuItem>

            <DropdownMenuSeparator />
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
      <DeleteDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        projectRef={projectRef}
        project={project}
      />
      <RenameDialog
        open={showRenameDialog}
        onOpenChange={setShowRenameDialog}
        projectRef={projectRef}
        project={project}
      />
    </div>
  );
};

type DeleteDialogProps = {
  open: boolean;
  onOpenChange: (show: boolean) => void;
  projectRef: DocumentReference;
  project: Project;
};

const DeleteDialog: FC<DeleteDialogProps> = ({
  open,
  onOpenChange,
  projectRef,
  project,
}) => {
  const router = useRouter();
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
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
              onOpenChange(false);
              await deleteDoc(projectRef);
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
  );
};

type RenameDialogProps = {
  open: boolean;
  onOpenChange: (show: boolean) => void;
  projectRef: DocumentReference<Project>;
  project: Project;
};

const FormSchema = z.object({
  name: z
    .string()
    .min(4, { message: "Name must be at least 4 characters long." })
    .max(30, { message: "Name must be at most 30 characters long." })
    .regex(/^[a-zA-Z0-9 -_]+$/, {
      message: "Name must only contain letters, numbers, spaces and - or _.",
    }),
});

type FormSchema = z.infer<typeof FormSchema>;

const RenameDialog: FC<RenameDialogProps> = ({
  open,
  onOpenChange,
  project,
  projectRef,
}) => {
  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: project.admin_config.name,
    },
  });

  useEffect(() => {
    form.setValue("name", project.admin_config.name);
  }, [form, project.admin_config.name]);

  const handleSubmit = async (values: FormSchema) => {
    onOpenChange(false);
    console.log(projectRef);
    await setDoc(
      projectRef,
      {
        admin_config: {
          name: values.name,
        },
        updated_at: serverTimestamp(),
      },
      { merge: true },
    );
    toast({
      description: `Your project has been renamed to "${values.name}".`,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rename Project</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-8"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>
                    This is for your own records and will not be displayed to
                    your users.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectLayout;
