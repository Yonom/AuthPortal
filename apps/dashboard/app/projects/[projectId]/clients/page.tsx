"use client";

import withAuth from "@/components/withAuth";
import { useCollection } from "react-firebase-hooks/firestore";
import {
  limit,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";
import { firestoreCollections } from "@/lib/firebase";
import { FC, useEffect, useState } from "react";
import { withDoctorReport } from "@/components/withDoctorReport";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@authportal/common-ui/ui/alert";
import { ExclamationTriangleIcon, TrashIcon } from "@radix-ui/react-icons";
import { useProject } from "@/lib/useProject";
import { z } from "zod";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@authportal/common-ui/ui/form";
import { cn } from "@authportal/common-ui/lib/utils";
import { Input } from "@authportal/common-ui/ui/input";
import { Button } from "@authportal/common-ui/ui/button";

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

const FormSchema = z.object({
  redirect_uris: z.array(
    z.object({
      value: z
        .string()
        .url({ message: "Please enter a valid URL." })
        .regex(/^https?:\/\//, {
          message: "URL must start with http:// or https://",
        }),
    }),
  ),
});

type FormSchema = z.infer<typeof FormSchema>;

const ClientsPage = ({ params }: { params: { projectId: string } }) => {
  const { project, doctor, projectRef } = useProject(params.projectId);

  // TODO duplicate code
  const domainRef = query(
    firestoreCollections.domains,
    where("project_id", "==", params.projectId),
    limit(1),
  );
  const [domains] = useCollection(domainRef);

  const form = useForm<FormSchema>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      redirect_uris: [],
    },
  });
  const { fields, append, remove } = useFieldArray({
    name: "redirect_uris",
    control: form.control,
  });

  useEffect(() => {
    if (!project) return;

    const redirect_uris = Object.values(project.clients)[0].redirect_uris.map(
      (value) => ({
        value,
      }),
    );

    if (redirect_uris.length === 0) {
      redirect_uris.push({ value: "" });
    }

    form.setValue("redirect_uris", redirect_uris);
  }, [form, project]);

  const [isBusy, setIsBusy] = useState(false);
  if (!project || !domains || doctor === undefined) return <p>Loading...</p>;

  const handleSubmit = async (values: FormSchema) => {
    setIsBusy(true);

    try {
      const redirect_uris = Array.from(
        new Set(values.redirect_uris.map((uri) => uri.value)),
      );
      await setDoc(
        projectRef,
        {
          clients: {
            [Object.keys(project.clients)[0]]: {
              redirect_uris,
            },
          },
          updated_at: serverTimestamp(),
        },
        { merge: true },
      );
    } catch (ex) {
      alert(ex);
    } finally {
      // wait for the Verifying... indicator to show
      setTimeout(() => {
        setIsBusy(false);
      }, 500);
    }
  };

  return (
    <main className="flex flex-col gap-4">
      <h2 className="text-3xl font-bold tracking-tight">Your App</h2>

      <NoneConfigured report={doctor} />
      <NoRedirectUris report={doctor} />

      <div>
        <h3 className="mb-4 text-xl font-bold tracking-tight">Configuration</h3>
        <div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-8"
            >
              <div>
                {fields.map((field, index) => (
                  <FormField
                    control={form.control}
                    key={field.id}
                    name={`redirect_uris.${index}.value`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className={cn(index !== 0 && "sr-only")}>
                          Redirect URI Whitelist
                        </FormLabel>
                        <FormDescription
                          className={cn(index !== 0 && "sr-only")}
                        >
                          In order to prevent malicious apps from stealing your
                          users&apos; data, you must whitelist the redirect URIs
                          that your app will use.
                        </FormDescription>
                        <FormControl>
                          <div className="flex items-center gap-2">
                            <Input {...field} />
                            <Button
                              type="button"
                              variant="ghost"
                              className="text-red-500 dark:text-red-600"
                              disabled={fields.length === 1}
                              onClick={() => remove(index)}
                            >
                              <TrashIcon className="h-4 w-4" />
                            </Button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={() => append({ value: "" })}
                  disabled={fields.length >= 5}
                >
                  Add URL
                </Button>
              </div>

              <Button disabled={isBusy || !doctor} type="submit">
                {isBusy ? "Saving..." : !doctor ? "Validating..." : "Save"}
              </Button>
            </form>
          </Form>
        </div>
      </div>
      <div>
        <h3 className="mb-4 text-xl font-bold tracking-tight">Installation</h3>

        <p>First, install the AuthPortal SDK:</p>
        <CodeBlock>{"npm install @authportal/firebase"}</CodeBlock>
        <p>Then, initialize AuthPortal with the following code.</p>
        <CodeBlock>{`import { AuthPortal } from '@authportal/firebase';

const authportal = new AuthPortal({
  domain: '${domains.docs[0]?.id}',
  client_id: '${Object.keys(project.clients)[0]}',
  firebase_auth: getAuth(app),
});`}</CodeBlock>
      </div>
    </main>
  );
};

export default withAuth(ClientsPage);
