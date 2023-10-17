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
import { FirebaseError, deleteApp, initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

const orderFields = <T extends Record<string, unknown>>(
  obj: T,
  fieldOrder: (keyof T)[],
) => {
  const newObj = {} as T;
  for (const field of fieldOrder) {
    if (field in obj) {
      newObj[field] = obj[field];
    }
  }
  for (const field of Object.keys(obj).filter((k) => !fieldOrder.includes(k))) {
    (newObj[field] as any) = obj[field];
  }
  return newObj;
};

const validateFirebaseConfig = async (config: Record<string, string>) => {
  const app = initializeApp(config, "validate");
  try {
    const auth = getAuth(app);
    await signInWithEmailAndPassword(
      auth,
      "authportal-test@example.com",
      Math.random().toString(),
    );
  } catch (ex: unknown) {
    if (!(ex instanceof FirebaseError)) throw ex;
    const errorWhitelist = [
      "auth/operation-not-allowed",
      "auth/app-not-authorized",
      "auth/user-disabled",
      "auth/user-not-found",
      "auth/wrong-password",
      "auth/invalid-login-credentials",
    ];
    if (errorWhitelist.includes(ex.code)) {
      // OK
    } else {
      throw ex;
    }
  } finally {
    deleteApp(app);
  }
};

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
    const dbConfig = app?.portal_config.firebase_config;
    if (!dbConfig || !Object.keys(dbConfig).length) {
      form.setValue("config", "");
      return;
    }

    const jsonToJsRegex = /(?<=^\s*)"([a-zA-Z]+)"(?=:)/gm;
    const config = orderFields(dbConfig, [
      "apiKey",
      "authDomain",
      "projectId",
      "storageBucket",
      "messagingSenderId",
      "appId",
    ]);
    const configJson = JSON.stringify(config, null, 2);
    const configJs = configJson.replace(jsonToJsRegex, "$1");
    form.setValue("config", `const firebaseConfig = ${configJs}`);
  }, [form, app?.portal_config.firebase_config]);

  const handleSubmit = async (values: FormSchema) => {
    setIsBusy(true);
    try {
      const regex = /firebaseConfig\s*=\s*(?<config>{(?:.|\s)+})/;
      const configJs = regex.exec(values.config)?.groups?.config;
      if (!configJs) throw new Error("Invalid config input");
      const jsToJsonRegex = /(?<=^\s*)([a-zA-Z]+)(?=:)/gm;
      const configJson = configJs?.replace(jsToJsonRegex, '"$1"');
      const configObj = JSON.parse(configJson);

      await validateFirebaseConfig(configObj);
      await setDoc(
        ref,
        {
          portal_config: { firebase_config: configObj },
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
