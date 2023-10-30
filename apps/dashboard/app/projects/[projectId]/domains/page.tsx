"use client";

import withAuth from "@/components/withAuth";
import { useProject } from "@/lib/useProject";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@authportal/common-ui/components/ui/alert";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { withDoctorReport } from "@/components/withDoctorReport";
import { Button } from "@authportal/common-ui/components/ui/button";

const NoneConfigured = withDoctorReport("domain/none-configured", () => {
  return (
    <Alert variant="destructive">
      <ExclamationTriangleIcon className="h-4 w-4" />
      <AlertTitle>No domains configured for this project yet.</AlertTitle>
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
          <p>
            Please add {message.domain} to the authorized domains in the
            Firebase Authentication settings.
          </p>
          <div className="text-end">
            <Button variant="outline" onClick={() => {}}>
              Check again
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    );
  },
);

const DomainsPage = ({ params }: { params: { projectId: string } }) => {
  const data = useProject(params.projectId);
  if (data.loading) return <p>Loading...</p>;
  const { doctor, domains } = data;

  return (
    <main className="flex flex-col gap-4">
      <h2 className="text-3xl font-bold tracking-tight">Domains</h2>

      <NoneConfigured report={doctor} />
      <HelperDomainMismatch report={doctor} />
      <NotWhitelistedForOauth report={doctor} />

      {domains.map(({ domain }) => {
        return (
          <div key={domain}>
            <p>{domain}</p>
          </div>
        );
      })}
    </main>
  );
};

export default withAuth(DomainsPage);
