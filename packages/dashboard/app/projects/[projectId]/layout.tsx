"use client";

import { Separator } from "@/components/ui/separator";
import ConfigNav from "./ConfigNav";
import { FC } from "react";
import { firestore, firestoreCollections } from "@/lib/firebase";
import { doc } from "firebase/firestore";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { useProject } from "@/lib/useProject";

type ProjectLayoutProps = {
  children: React.ReactNode;
  params: { projectId: string };
};

const ProjectLayout: FC<ProjectLayoutProps> = ({ params, children }) => {
  const { project } = useProject(params.projectId);

  if (!project) return <p>Loading...</p>;

  return (
    <div className="space-y-6 p-10 pb-16">
      <div className="space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">
          {project.admin_config.name}
        </h2>
      </div>
      <Separator className="my-6" />
      <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
        <aside className="-mx-4 lg:w-1/5">
          <ConfigNav
            projectId={params.projectId}
            setupComplete={
              !!Object.keys(project.portal_config.firebase_config).length
            }
          />
        </aside>
        <div className="flex-1 lg:max-w-2xl">{children}</div>
      </div>
    </div>
  );
};

export default ProjectLayout;
