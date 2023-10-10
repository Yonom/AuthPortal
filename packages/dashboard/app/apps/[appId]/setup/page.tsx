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
import withAuth from "@/app/withAuth";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { doc, setDoc } from "firebase/firestore";
import { firestore } from "@/app/firebase";
import { useEffect } from "react";

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

const FormSchema = z.object({
  config: z.string(),
});

type FormSchema = z.infer<typeof FormSchema>;

const SetupPage = ({ params }: { params: { appId: string } }) => {
  const ref = doc(firestore, "apps", params.appId);
  const [app, loading] = useDocumentData(ref);

  const form = useForm<FormSchema>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      config: "",
    },
  });

  useEffect(() => {
    if (!app?.firebaseConfig) {
      form.setValue("config", "");
      return;
    }

    const jsonToJsRegex = /(?<=^\s*)"([a-zA-Z]+)"(?=:)/gm;
    const config = orderFields(app.firebaseConfig, [
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
  }, [form, app?.firebaseConfig]);

  const onSubmit = (values: FormSchema) => {
    try {
      const regex = /firebaseConfig\s*=\s*(?<config>{(?:.|\s)+})/;
      const configJs = regex.exec(values.config)?.groups?.config;
      if (!configJs) throw new Error("Invalid config input");
      const jsToJsonRegex = /(?<=^\s*)([a-zA-Z]+)(?=:)/gm;
      const configJson = configJs?.replace(jsToJsonRegex, '"$1"');
      const configObj = JSON.parse(configJson);

      setDoc(
        ref,
        { firebaseConfig: configObj },
        { mergeFields: ["firebaseConfig"] },
      );
    } catch (ex) {
      alert(ex);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <main>
      <h2 className="mb-4 text-3xl font-bold tracking-tight">Setup</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
          <Button type="submit">Save</Button>
        </form>
      </Form>
    </main>
  );
};

export default withAuth(SetupPage);
