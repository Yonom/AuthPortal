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
import { auth, firestoreCollections } from "../../lib/firebase";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { useState } from "react";
import { useRouter } from "next/navigation";
import withAuth from "../../components/withAuth";
import { _generateRandomString } from "@authportal/core/signIn/utils/crypto";

const FormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  domain: z
    .string()
    .min(6, {
      message: "Domain must be at least 6 characters.",
    })
    .max(63, {
      message: "Domain must be at most 60 characters.",
    })
    .regex(/[a-z0-9]$/, {
      message: "Domain must end with a letter or number.",
    })
    .regex(/^[a-z]/, {
      message: "Domain must start with a letter.",
    })
    .regex(/^[a-z][a-z0-9-]{4,60}[a-z0-9]$/, {
      message: "Domain must only contain letters, numbers, and dashes.",
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

  const addProject = async (name: string, userId: string) => {
    const newProjectRef = doc(firestoreCollections.projects);

    await setDoc(newProjectRef, {
      admin_config: {
        name,
        members: [userId],
      },
      clients: {
        ["pk_" + _generateRandomString().substring(0, 24)]: {
          name: "Default",
          redirect_uris: ["http://localhost/signin-authportal"],
        },
      },
      portal_config: {
        firebase_config: {},
        providers: [],
      },
      created_at: serverTimestamp(),
      updated_at: serverTimestamp(),
    });

    const domain =
      _generateRandomString()
        .replace("-", "")
        .replace("_", "")
        .substring(0, 16)
        .toLowerCase() + ".authportal.site";
    const domainRef = doc(firestoreCollections.domains, domain);
    await setDoc(domainRef, {
      project_id: newProjectRef.id,
      helper_domain: domain,
      created_at: serverTimestamp(),
      updated_at: serverTimestamp(),
    });

    return newProjectRef.id;
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
      const newProjectId = await addProject(name, userId);
      router.push(`/projects/${newProjectId}/setup`); // Redirect to the new project's config page
    } catch (error) {
      console.error("Error adding new project: ", error);
      setLoading(false);
    }
  };

  return (
    <main>
      <h2 className="mb-4 text-3xl font-bold tracking-tight">
        Create a New Project
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
                  <Input placeholder="My Project" {...field} />
                </FormControl>
                <FormDescription>
                  This is for your own records and will not be displayed to your
                  users.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="domain"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Domain</FormLabel>
                <FormControl>
                  <div>
                    <Input placeholder="my-project" {...field} />
                    .authportal.site
                  </div>
                </FormControl>
                <FormDescription>
                  This is the domain that your users will see while they sign
                  in. You can setup a custom domain later.
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
