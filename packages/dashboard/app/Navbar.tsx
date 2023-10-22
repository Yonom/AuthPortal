import Image from "next/image";
import logo from "./logo.svg";
import Link from "next/link";
import { UserNav } from "./UserNav";

export const Navbar = () => {
  return (
    <div className="flex justify-between p-7">
      <Link href="/">
        <Image src={logo} alt="Logo" />
      </Link>
      <div className="flex gap-4">
        <UserNav />
      </div>
    </div>
  );
};
