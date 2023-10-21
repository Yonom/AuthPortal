"use client";

import withAuth from "@/components/withAuth";
import { useCollection, useDocumentData } from "react-firebase-hooks/firestore";
import { doc, limit, query, where } from "firebase/firestore";
import { firestoreCollections } from "@/lib/firebase";
import { FC } from "react";
import { withDoctorReport } from "@/components/withDoctorReport";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { useApp } from "@/lib/useApp";

type CodeBlockParams = {
  children: React.ReactNode;
};

const CodeBlock: FC<CodeBlockParams> = ({ children }) => {
  return (
    <pre className="mb-4 mt-6 max-h-[650px] overflow-x-auto rounded-lg border bg-zinc-50 px-4 py-4 dark:bg-zinc-900">
      {children}
    </pre>
  );
};

const NoneConfigured = withDoctorReport("client/none-configured", () => {
  return (
    <Alert variant="destructive">
      <ExclamationTriangleIcon className="h-4 w-4" />
      <AlertTitle>No apps configured for this project yet.</AlertTitle>
      <AlertDescription>Add an app to get started.</AlertDescription>
    </Alert>
  );
});

const NoRedirectUris = withDoctorReport("client/no-redirect-uris", () => {
  return (
    <Alert variant="destructive">
      <ExclamationTriangleIcon className="h-4 w-4" />
      <AlertTitle>App has no redirect_uris whitelisted</AlertTitle>
      <AlertDescription>
        Please add a redirect_uri to the app configuration.
      </AlertDescription>
    </Alert>
  );
});

const ClientsPage = ({ params }: { params: { appId: string } }) => {
  const { app, doctor } = useApp(params.appId);
  const domainRef = query(
    firestoreCollections.domains,
    where("app_id", "==", params.appId),
    limit(1),
  );
  const [domains] = useCollection(domainRef);
  if (!app || !domains || doctor === undefined) return <p>Loading...</p>;

  return (
    <main className="flex flex-col gap-4">
      <h2 className="text-3xl font-bold tracking-tight">Apps</h2>

      <NoneConfigured report={doctor} />
      <NoRedirectUris report={doctor} />

      <div>
        <h3 className="mb-4 text-xl font-bold tracking-tight">Installation</h3>

        <p>First, install the AuthPortal SDK:</p>
        <CodeBlock>{"npm install @authportal/firebase"}</CodeBlock>
        <p>Then, initialize AuthPortal with the following code.</p>
        <CodeBlock>{`import { AuthPortal } from '@authportal/firebase';

const authportal = new AuthPortal({
  domain: '${domains.docs[0]?.id}',
  client_id: '${Object.keys(app.clients)[0]}',
  firebase_auth: getAuth(app),
});`}</CodeBlock>
      </div>
    </main>
  );
};

export default withAuth(ClientsPage);
