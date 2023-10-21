"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormItem, FormLabel } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import withAuth from "@/components/withAuth";
import { serverTimestamp, setDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { EmailAuthProvider, GoogleAuthProvider } from "firebase/auth";
import { useApp } from "@/lib/useApp";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { withDoctorReport } from "@/components/withDoctorReport";

const supportedProviders = {
  [GoogleAuthProvider.PROVIDER_ID]: "Google",
  [EmailAuthProvider.PROVIDER_ID]: "Email",
  // [FacebookAuthProvider.PROVIDER_ID]: "Facebook",
  // ["apple.com"]: "Apple",
  // [GithubAuthProvider.PROVIDER_ID]: "Github",
};

const NoneConfigured = withDoctorReport("provider/none-configured", () => {
  return (
    <Alert variant="destructive">
      <ExclamationTriangleIcon className="h-4 w-4" />
      <AlertTitle>No providers configured for this app yet.</AlertTitle>
      <AlertDescription>Add a provider to get started.</AlertDescription>
    </Alert>
  );
});

const NotEnabled = withDoctorReport("provider/not-enabled", ({ message }) => {
  const providerName =
    supportedProviders[
      message.provider_id as keyof typeof supportedProviders
    ] ?? message.provider_id;
  return (
    <Alert variant="destructive">
      <ExclamationTriangleIcon className="h-4 w-4" />
      <AlertTitle>
        The provider {providerName} is not enabled for this app.
      </AlertTitle>
      <AlertDescription>
        You must enable the provider {providerName} in the Firebase console
        first.
      </AlertDescription>
    </Alert>
  );
});

const RedirectUriNotWhitelisted = withDoctorReport(
  "provider/redirect-uri-not-whitelisted",
  ({ message }) => {
    const providerName =
      supportedProviders[
        message.provider_id as keyof typeof supportedProviders
      ] ?? message.provider_id;

    return (
      <Alert variant="destructive">
        <ExclamationTriangleIcon className="h-4 w-4" />
        <AlertTitle>
          AuthPortal is not whitelisted for {providerName}.
        </AlertTitle>
        <AlertDescription>
          In the provider settings for {providerName}, add the following
          redirect URL:{" "}
          <code>https://{message.helper_domain}/__/auth/handler</code>
        </AlertDescription>
      </Alert>
    );
  },
);

const FormSchema = z.object({
  providerIds: z.string().array(),
});

type FormSchema = z.infer<typeof FormSchema>;

const ProvidersPage = ({ params }: { params: { appId: string } }) => {
  const { app, doctor, ref } = useApp(params.appId);

  const form = useForm<FormSchema>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      providerIds: [],
    },
  });

  useEffect(() => {
    form.setValue(
      "providerIds",
      app?.portal_config.providers?.map((p) => p.provider_id) ?? [],
    );
  }, [form, app?.portal_config.providers]);

  const [isBusy, setIsBusy] = useState(false);
  const handleSubmit = async (values: FormSchema) => {
    setIsBusy(true);
    try {
      const providers = values.providerIds.map((p) => ({ provider_id: p }));
      await setDoc(
        ref,
        { portal_config: { providers }, updated_at: serverTimestamp() },
        { merge: true },
      );
    } catch (ex: unknown) {
      console.error(ex);
    } finally {
      // wait for the Verifying... indicator to show
      setTimeout(() => {
        setIsBusy(false);
      }, 500);
    }
  };

  if (!app || doctor === undefined) return <p>Loading...</p>;

  return (
    <main className="flex flex-col gap-4">
      <h2 className="text-3xl font-bold tracking-tight">Setup</h2>

      <NoneConfigured report={doctor} />
      <NotEnabled report={doctor} />
      <RedirectUriNotWhitelisted report={doctor} />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
          {Object.entries(supportedProviders).map(([p, label]) => (
            <FormItem key={p}>
              <FormControl className="mb-0.5 mr-2">
                <input
                  {...form.register("providerIds")}
                  type="checkbox"
                  value={p}
                  checked={form.watch("providerIds").includes(p)}
                />
              </FormControl>
              <FormLabel>{label}</FormLabel>
            </FormItem>
          ))}
          <Button disabled={isBusy || !doctor} type="submit">
            {isBusy ? "Saving..." : !doctor ? "Validating..." : "Save"}
          </Button>
        </form>
      </Form>
    </main>
  );
};

export default withAuth(ProvidersPage);
