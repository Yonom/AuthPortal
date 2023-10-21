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
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import withAuth from "@/lib/withAuth";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { firestoreCollections } from "@/lib/firebase";
import { useEffect, useState } from "react";
import { configToConfigStr, configStrToConfig } from "./configStrParser";

const FormSchema = z.object({
  config: z.string(),
});

type FormSchema = z.infer<typeof FormSchema>;

const SetupPage = ({ params }: { params: { appId: string } }) => {
  const ref = doc(firestoreCollections.apps, params.appId);
  const [app, loadingApp] = useDocumentData(ref);

  const form = useForm<FormSchema>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      config: "",
    },
  });

  useEffect(() => {
    if (!app) return;

    form.setValue(
      "config",
      configToConfigStr(app.portal_config.firebase_config),
    );
  }, [form, app]);

  const handleSubmit = async (values: FormSchema) => {
    setIsBusy(true);
    try {
      await setDoc(
        ref,
        {
          portal_config: { firebase_config: configStrToConfig(values.config) },
          updated_at: serverTimestamp(),
        },
        { mergeFields: ["portal_config.firebase_config", "updated_at"] },
      );
    } catch (ex) {
      alert(ex);
    } finally {
      setIsBusy(false);
    }
  };

  const [isBusy, setIsBusy] = useState(false);
  if (loadingApp) return <p>Loading...</p>;

  return (
    <main>
      <h2 className="mb-4 text-3xl font-bold tracking-tight">Setup</h2>
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
          <Button disabled={isBusy} type="submit">
            {isBusy ? "Saving..." : "Save"}
          </Button>
        </form>
      </Form>
    </main>
  );
};

export default withAuth(SetupPage);
