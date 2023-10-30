"use client";

import { Button } from "@authportal/common-ui/components/ui/button";
import { useRouter } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import { auth, firestoreCollections } from "../lib/firebase";
import { query, where } from "firebase/firestore";
import withAuth from "../components/withAuth";
import { ProjectCard } from "./ProjectCard";

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
          firestoreCollections.projects,
          where("admin_config.members", "array-contains", user.uid),
        ),
  );

  return (
    <div className="flex flex-1 flex-col gap-6">
      <h2 className="text-3xl font-bold tracking-tight">Projects</h2>
      <div>
        <Button onClick={handleNew}>New Project</Button>
      </div>
      <div className="flex flex-row flex-wrap gap-4">
        {values?.docs.map((v) => (
          <ProjectCard
            key={v.id}
            projectId={v.id}
            name={v.data().admin_config.name}
            type="development"
          />
        ))}
        {values?.docs.length === 0 && <p>No projects yet.</p>}
        {values == null && <p>Loading...</p>}
      </div>
    </div>
  );
}

export default withAuth(Home);
