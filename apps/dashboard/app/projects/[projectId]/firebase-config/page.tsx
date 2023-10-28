"use client";

import * as z from "zod";
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
import { Button } from "@authportal/common-ui/ui/button";
import { useForm } from "react-hook-form";
import { Textarea } from "@authportal/common-ui/ui/textarea";
import Link from "next/link";
import withAuth from "@/components/withAuth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { firestoreCollections } from "@/lib/firebase";
import { FC, useEffect, useState } from "react";
import { configToConfigStr, configStrToConfig } from "./configStrParser";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@authportal/common-ui/ui/alert";
import { ExclamationTriangleIcon, RocketIcon } from "@radix-ui/react-icons";
import { withDoctorReport } from "../../../../components/withDoctorReport";
import { useProject } from "../../../../lib/useProject";

const MissingConfig = withDoctorReport("config/missing", () => {
  return (
    <Alert variant="destructive">
      <ExclamationTriangleIcon className="h-4 w-4" />
      <AlertTitle>Missing Configuration</AlertTitle>
      <AlertDescription>
        Add the Firebase configuration snippet to get started.
      </AlertDescription>
    </Alert>
  );
});

const MalformedConfig = withDoctorReport("config/malformed", () => {
  return (
    <Alert variant="destructive">
      <ExclamationTriangleIcon className="h-4 w-4" />
      <AlertTitle>Malformatted Configuration</AlertTitle>
      <AlertDescription>
        The Firebase configuration snippet is malformed. Make sure you copy and
        paste the snippet exactly as presented in the Firebase console.
      </AlertDescription>
    </Alert>
  );
});

const InvalidAPIKey = withDoctorReport("config/invalid-api-key", () => {
  return (
    <Alert variant="destructive">
      <ExclamationTriangleIcon className="h-4 w-4" />
      <AlertTitle>Invalid API Key</AlertTitle>
      <AlertDescription>
        Your API key seems to have expired. Check the Firebase console for an
        updated configuration snippet.
      </AlertDescription>
    </Alert>
  );
});

const AuthNotEnabled = withDoctorReport("config/auth-not-enabled", () => {
  return (
    <Alert variant="destructive">
      <ExclamationTriangleIcon className="h-4 w-4" />
      <AlertTitle>Firebase Authentication is not enabled</AlertTitle>
      <AlertDescription>
        AuthPortal requires Firebase Authentication to be enabled. Please enable
        Firebase Authentication in the Firebase console.
      </AlertDescription>
    </Alert>
  );
});

const InternalError = withDoctorReport("internal-error", ({ message }) => {
  return (
    <Alert variant="destructive">
      <ExclamationTriangleIcon className="h-4 w-4" />
      <AlertTitle>
        An internal error has occured while validating your configuration
      </AlertTitle>
      <AlertDescription>
        Please try again later or contact support. <br />
        Error message: {message.message}
      </AlertDescription>
    </Alert>
  );
});

const FormSchema = z.object({
  config: z.string().refine(
    (s) => {
      try {
        configStrToConfig(s);
        return true;
      } catch {
        return false;
      }
    },
    (val) => ({
      message: `Unable to parse Firebase configuration snippet, make sure you copy and paste the snippet exactly as presented in the Firebase console.`,
    }),
  ),
});

type FormSchema = z.infer<typeof FormSchema>;

const SetupPage = ({ params }: { params: { projectId: string } }) => {
  const { project, doctor, projectRef } = useProject(params.projectId);

  const form = useForm<FormSchema>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      config: "",
    },
  });

  useEffect(() => {
    if (!project) return;

    form.setValue(
      "config",
      configToConfigStr(project.portal_config.firebase_config),
    );
  }, [form, project]);

  const [isBusy, setIsBusy] = useState(false);
  const handleSubmit = async (values: FormSchema) => {
    setIsBusy(true);
    try {
      await setDoc(
        projectRef,
        {
          portal_config: { firebase_config: configStrToConfig(values.config) },
          updated_at: serverTimestamp(),
        },
        { mergeFields: ["portal_config.firebase_config", "updated_at"] },
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

  if (!project || doctor === undefined) return <p>Loading...</p>;

  return (
    <main className="flex flex-col gap-4">
      <h2 className="text-3xl font-bold tracking-tight">Setup</h2>

      <MissingConfig report={doctor} />
      <MalformedConfig report={doctor} />
      <InvalidAPIKey report={doctor} />
      <AuthNotEnabled report={doctor} />
      <InternalError report={doctor} />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="config"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Firebase Configruation Snippet</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="const firebaseConfig = { ..."
                    className="h-48 font-mono"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Under{" "}
                  <Link
                    href="https://console.firebase.google.com/project/_/settings/general"
                    className="hover:text-primary underline underline-offset-4"
                    target="_blank"
                  >
                    project general settings
                  </Link>
                  , select one of your web apps and copy the initialization
                  code.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button disabled={isBusy || !doctor} type="submit">
            {isBusy ? "Saving..." : !doctor ? "Validating..." : "Save"}
          </Button>
        </form>
      </Form>
    </main>
  );
};

export default withAuth(SetupPage);
