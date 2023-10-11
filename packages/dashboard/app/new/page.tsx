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
import { useForm } from "react-hook-form";
import { auth, firestoreCollections } from "../firebase";
import { doc, setDoc } from "firebase/firestore";
import { useState } from "react";
import { useRouter } from "next/navigation";
import withAuth from "../withAuth";
import { _generateRandomString } from "@authportal/core/signIn/utils/crypto";

const FormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
});

type FormSchema = z.infer<typeof FormSchema>;

const NewPage = () => {
  const form = useForm<FormSchema>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
    },
  });

  const addApp = async (name: string, userId: string) => {
    const newAppRef = doc(firestoreCollections.apps);

    await setDoc(newAppRef, {
      admin_config: {
        name,
        members: [userId],
      },
      clients: {
        ["pk_" + _generateRandomString()]: {
          redirect_uris: ["http://localhost:3000/signin-authportal"],
        },
      },
      portal_config: {
        firebase_config: {},
        providers: [],
      },
    });

    const domainRef = doc(
      firestoreCollections.domains,
      newAppRef.id + ".authportal.site",
    );
    await setDoc(domainRef, {
      appId: newAppRef.id,
    });

    return newAppRef.id;
  };

  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (values: FormSchema) => {
    const { name } = values;
    const userId = auth.currentUser?.uid;

    if (!userId) {
      throw new Error("User not logged in");
    }

    setLoading(true);

    try {
      const newAppId = await addApp(name, userId);
      router.push(`/apps/${newAppId}/setup`); // Redirect to the new app's config page
    } catch (error) {
      console.error("Error adding new app: ", error);
      setLoading(false);
    }
  };

  return (
    <main>
      <h2 className="mb-4 text-3xl font-bold tracking-tight">
        Create a New App
      </h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="My App" {...field} />
                </FormControl>
                <FormDescription>
                  This is for your own records and will not be displayed to your
                  users.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create"}
          </Button>
        </form>
      </Form>
    </main>
  );
};

export default withAuth(NewPage);
