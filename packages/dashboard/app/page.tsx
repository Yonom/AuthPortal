import Image from "next/image";
import logo from "./logo.svg";

const Sidebar = () => {
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
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    aria-hidden="true"
                    className="h-5 w-5 shrink-0"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
                    ></path>
                  </svg>
                  Home
                </div>
              </a>
            </li>
            <li>
              <a
                className="group flex items-center gap-x-3 rounded-md p-2 text-sm font-medium leading-5 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white"
                href="/settings"
              >
                <div className="flex flex-1 gap-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    aria-hidden="true"
                    className="h-5 w-5 shrink-0"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75"
                    ></path>
                  </svg>
                  Settings
                </div>
              </a>
            </li>
          </ul>
        </ul>
      </nav>
    </div>
  );
};

export default function Home() {
  return (
    <>
      <Sidebar />
    </>
  );
}
