import Image from "next/image";
import logo from "./logo.svg";
import { HomeIcon } from "@heroicons/react/24/outline";

export const Sidebar = () => {
  return (
    <div className="flex h-full w-64 flex-col p-7 dark:bg-zinc-950">
      <Image src={logo} alt="Logo" />
      <nav className="flex flex-1 flex-col pt-12">
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          <ul role="list" className="-mx-2 space-y-1">
            <li>
              <a
                className="group flex items-center gap-x-3 rounded-md bg-zinc-900/5 p-2 text-sm font-semibold leading-5 dark:bg-zinc-800 dark:text-white"
                href="/"
              >
                <div className="flex flex-1 gap-4">
                  <HomeIcon width={20} />
                  Home
                </div>
              </a>
            </li>
            {/* <li>
              <a
                className="group flex items-center gap-x-3 rounded-md p-2 text-sm font-medium leading-5 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white"
                href="/settings"
              >
                <div className="flex flex-1 gap-4">
                  <AdjustmentsHorizontalIcon width={20} />
                  Settings
                </div>
              </a>
            </li> */}
          </ul>
        </ul>
      </nav>
    </div>
  );
};
