import Link from "next/link";
import { Sidebar } from "./Sidebar";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col p-7">
      <h1 className="text-3xl font-bold">Projects</h1>
      <Link href="/new">New Project</Link>
      {/* TODO list projects here */}
    </div>
  );
}
