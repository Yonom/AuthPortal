"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import { auth, firestore } from "./firebase";
import { collection, query, where } from "firebase/firestore";
import withAuth from "./withAuth";
import { AppCard } from "./AppCard";

function Home() {
  const router = useRouter();

  const handleNew = () => {
    router.push("/new");
  };

  const [user] = useAuthState(auth);
  const [values] = useCollection(
    !user
      ? null
      : query(
          collection(firestore, "apps"),
          where("members", "array-contains", user.uid),
        ),
  );

  return (
    <div className="flex flex-1 flex-col gap-6">
      <h2 className="text-3xl font-bold tracking-tight">Projects</h2>
      <div>
        <Button onClick={handleNew}>New Project</Button>
      </div>
      <div className="flex flex-row gap-4">
        {values?.docs.map((v) => (
          <AppCard
            key={v.id}
            appId={v.id}
            name={v.data().name}
            type="development"
          />
        ))}
        {values?.docs.length === 0 && <p>No projects yet.</p>}
        {values == null && <p>Loading...</p>}
      </div>
      {/* TODO list projects here */}
    </div>
  );
}

export default withAuth(Home);
