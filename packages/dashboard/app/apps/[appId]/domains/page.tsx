"use client";
import withAuth from "@/components/withAuth";
import { useCollection, useDocumentData } from "react-firebase-hooks/firestore";
import { doc, limit, query, where } from "firebase/firestore";
import { firestoreCollections } from "@/lib/firebase";
import { FC } from "react";
import { useApp } from "@/lib/useApp";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { withDoctorReport } from "@/components/withDoctorReport";

const NoneConfigured = withDoctorReport("domain/none-configured", () => {
  return (
    <Alert variant="destructive">
      <ExclamationTriangleIcon className="h-4 w-4" />
      <AlertTitle>No domains configured for this app yet.</AlertTitle>
      <AlertDescription>Add a domain to get started.</AlertDescription>
    </Alert>
  );
});

const HelperDomainMismatch = withDoctorReport(
  "domain/helper-domain-mismatch",
  ({ message }) => {
    return (
      <Alert variant="destructive">
        <ExclamationTriangleIcon className="h-4 w-4" />
        <AlertTitle>Helper domain mismatch</AlertTitle>
        <AlertDescription>
          The helper domain for {message.domain} is under a different top level
          domain. This causes issues with cookies and redirects in browsers such
          as Firefox or Safari. Please use a helper domain under the same top
          level domain.
        </AlertDescription>
      </Alert>
    );
  },
);

const NotWhitelistedForOauth = withDoctorReport(
  "domain/not-whitelisted-for-oauth",
  ({ message }) => {
    return (
      <Alert variant="destructive">
        <ExclamationTriangleIcon className="h-4 w-4" />
        <AlertTitle>Domain not whitelisted for OAuth</AlertTitle>
        <AlertDescription>
          Please add {message.domain} to the authorized domains in the Firebase
          Authentication settings.
        </AlertDescription>
      </Alert>
    );
  },
);

const DomainsPage = ({ params }: { params: { appId: string } }) => {
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
      <h2 className="text-3xl font-bold tracking-tight">Domains</h2>

      <NoneConfigured report={doctor} />
      <HelperDomainMismatch report={doctor} />
      <NotWhitelistedForOauth report={doctor} />

      {domains.docs.map((domain) => {
        return (
          <div key={domain.id}>
            <p>{domain.id}</p>
          </div>
        );
      })}
    </main>
  );
};

export default withAuth(DomainsPage);
