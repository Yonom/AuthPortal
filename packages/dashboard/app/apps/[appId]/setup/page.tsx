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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";

const FormSchema = z.object({
  config: z.string(),
});

type FormSchema = z.infer<typeof FormSchema>;

const NewPage = () => {
  const form = useForm<FormSchema>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      config: "",
    },
  });

  const onSubmit = (values: FormSchema) => {
    console.log(values);
  };

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

export default NewPage;
