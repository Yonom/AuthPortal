"use client";

import * as z from "zod";
import withAuth from "@/lib/withAuth";
import { useCollection, useDocumentData } from "react-firebase-hooks/firestore";
import { doc, limit, query, where } from "firebase/firestore";
import { firestoreCollections } from "@/lib/firebase";
import { FC } from "react";

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

const InstallationPage = ({ params }: { params: { appId: string } }) => {
  const appRef = doc(firestoreCollections.apps, params.appId);
  const domainRef = query(
    firestoreCollections.domains,
    where("app_id", "==", params.appId),
    limit(1),
  );
  const [app] = useDocumentData(appRef);
  const [domains] = useCollection(domainRef);
  if (!app || !domains) return <p>Loading...</p>;

  return (
    <main>
      <h2 className="mb-4 text-3xl font-bold tracking-tight">Installation</h2>
      <p>First, install the AuthPortal SDK:</p>
      <CodeBlock>{"npm install @authportal/firebase"}</CodeBlock>
      <p>Then, initialize AuthPortal with the following code.</p>
      <CodeBlock>{`import { AuthPortal } from '@authportal/firebase';

const authportal = new AuthPortal({
  domain: '${domains.docs[0]?.id}',
  client_id: '${Object.keys(app.clients)[0]}',
  firebase_auth: getAuth(app),
});`}</CodeBlock>
    </main>
  );
};

export default withAuth(InstallationPage);
