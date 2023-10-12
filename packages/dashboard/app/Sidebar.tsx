import Image from "next/image";
import logo from "./logo.svg";
import { ModeToggle } from "@/components/mode-toggle";
import Link from "next/link";

export const Sidebar = () => {
  return (
    <div className="flex justify-between p-7">
      <Link href="/">
        <Image src={logo} alt="Logo" />
      </Link>
      <ModeToggle />
    </div>
  );
};
