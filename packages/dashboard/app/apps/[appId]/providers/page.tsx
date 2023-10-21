"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import withAuth from "@/lib/withAuth";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { firestoreCollections } from "@/lib/firebase";
import { useEffect, useState } from "react";
import {
  EmailAuthProvider,
  FacebookAuthProvider,
  GithubAuthProvider,
  GoogleAuthProvider,
} from "firebase/auth";

const supportedProviders = {
  [GoogleAuthProvider.PROVIDER_ID]: "Google",
  [EmailAuthProvider.PROVIDER_ID]: "Email",
  // [FacebookAuthProvider.PROVIDER_ID]: "Facebook",
  // ["apple.com"]: "Apple",
  // [GithubAuthProvider.PROVIDER_ID]: "Github",
};

const FormSchema = z.object({
  providerIds: z.string().array(),
});

type FormSchema = z.infer<typeof FormSchema>;

const SetupPage = ({ params }: { params: { appId: string } }) => {
  const ref = doc(firestoreCollections.apps, params.appId);
  const [app, loadingApp] = useDocumentData(ref);

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
          <Button disabled={isBusy} type="submit">
            {isBusy ? "Saving..." : "Save"}
          </Button>
        </form>
      </Form>
    </main>
  );
};

export default withAuth(SetupPage);
