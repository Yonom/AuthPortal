"use client";

import { Separator } from "@/components/ui/separator";
import ConfigNav from "./ConfigNav";
import { FC } from "react";
import { firestore, firestoreCollections } from "@/app/firebase";
import { doc } from "firebase/firestore";
import { useDocumentData } from "react-firebase-hooks/firestore";

type AppLayoutProps = {
  children: React.ReactNode;
  params: { appId: string };
};

const AppLayout: FC<AppLayoutProps> = ({ params, children }) => {
  const [app, loading] = useDocumentData(
    doc(firestoreCollections.apps, params.appId),
  );

  if (!app) return <p>Loading...</p>;

  return (
    <div className="hidden space-y-6 p-10 pb-16 md:block">
      <div className="space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">
          {app.admin_config.name}
        </h2>
      </div>
      <Separator className="my-6" />
      <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
        <aside className="-mx-4 lg:w-1/5">
          <ConfigNav
            appId={params.appId}
            setupComplete={
              !!Object.keys(app.portal_config.firebase_config).length
            }
          />
        </aside>
        <div className="flex-1 lg:max-w-2xl">{children}</div>
      </div>
    </div>
  );
};

export default AppLayout;
