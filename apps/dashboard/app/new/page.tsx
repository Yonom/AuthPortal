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
} from "@authportal/common-ui/components/ui/form";
import { Button } from "@authportal/common-ui/components/ui/button";
import { Input } from "@authportal/common-ui/components/ui/input";
import { InputWithText } from "@authportal/common-ui/components/ui/input-with-text";
import { useForm } from "react-hook-form";
import { auth, firestore, firestoreCollections } from "../../lib/firebase";
import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import withAuth from "../../components/withAuth";
import { _generateRandomString } from "@authportal/core/signIn/utils/crypto";
import { FirebaseError } from "firebase/app";

const FormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  domain: z
    .string()
    .min(6, {
      message: "Domain must be at least 6 characters.",
    })
    .max(30, {
      message: "Domain must be at most 30 characters.",
    })
    .regex(/^[a-z]/, {
      message: "Domain must start with a letter.",
    })
    .regex(/[a-z0-9]$/, {
      message: "Domain must end with a letter or number.",
    })
    .regex(/^[a-z][a-z0-9-]{4,28}[a-z0-9]$/, {
      message: "Domain must only contain letters, numbers, and dashes.",
    })
    .regex(/^(?:[a-z0-9]-?)+$/, {
      message: "Domain cannot have two dashes in a row.",
    })
    .refine(
      async (d) => {
        try {
          // updating a non-existing document will fail with not-found, otherwise permission-denied
          await updateDoc(
            doc(firestoreCollections.domains, d + ".authportal.site"),
            {},
          );

          // unexpected success, but it implies that the domain is taken
          return false;
        } catch (ex: unknown) {
          if (!(ex instanceof FirebaseError)) throw ex;
          if (ex.code === "not-found") return true;
          if (ex.code === "permission-denied") return false;
          throw ex;
        }
      },
      {
        message: "Domain is already taken.",
      },
    ),
});

type FormSchema = z.infer<typeof FormSchema>;

const NewPage = () => {
  const form = useForm<FormSchema>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      domain: "",
    },
  });

  const addProject = async (name: string, domain: string, userId: string) => {
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
    const { name, domain } = values;
    const userId = auth.currentUser?.uid;

    if (!userId) {
      throw new Error("User not logged in");
    }

    setLoading(true);

    try {
      const newProjectId = await addProject(
        name,
        domain + ".authportal.site",
        userId,
      );
      router.push(`/projects/${newProjectId}/firebase-config`); // Redirect to the new project's config page
    } catch (error) {
      console.error("Error adding new project: ", error);
      setLoading(false);
    }
  };

  const name = form.watch("name");
  const domainOverride = useRef(false);
  useEffect(() => {
    if (domainOverride.current) return;

    let validDomain = name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "")
      .replace(/-$/g, "")
      .replace(/^([^a-z])/g, "project-$1")
      .substring(0, 30);

    if (name && validDomain.length < 6) {
      validDomain =
        validDomain +
        "-" +
        _generateRandomString()
          .toLowerCase()
          .replace(/[^a-z0-9]/g, "")
          .substring(0, 5);
    }

    form.setValue("domain", validDomain);
  }, [form, name]);

  return (
    <main>
      <h2 className="mb-4 text-3xl font-bold tracking-tight">
        Create a New Project
      </h2>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="max-w-lg space-y-8"
        >
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
                  <InputWithText
                    placeholder="my-project"
                    {...field}
                    onChange={(...e) => {
                      domainOverride.current = true;
                      field.onChange(...e);
                    }}
                    suffix=".authportal.site"
                  />
                </FormControl>
                <FormDescription>
                  This is the domain that your users will see while they sign
                  in.
                  <br />
                  You can setup a custom domain later.
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
