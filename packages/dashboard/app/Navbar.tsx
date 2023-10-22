import Image from "next/image";
import logo from "./logo.svg";
import { ModeToggle } from "@/components/mode-toggle";
import Link from "next/link";
import { LogoutButton } from "./LogoutButton";
import { AvatarImage } from "@/components/ui/avatar";
import { UserNav } from "./UserNav";

export const Navbar = () => {
  return (
    <div className="flex justify-between p-7">
      <Link href="/">
        <Image src={logo} alt="Logo" />
      </Link>
      <div className="flex gap-4">
        <UserNav />
        {/* <ModeToggle />
        <LogoutButton /> */}
      </div>
    </div>
  );
};
