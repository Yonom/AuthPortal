import authportalIcon from "./logo.svg";
import Image from "next/image";
import { WebsiteSection } from "./WebsiteSection";
import Link from "next/link";

export const Navbar = () => {
  return (
    <WebsiteSection className="border-b border-b-black">
      <nav className="flex flex-wrap justify-between py-5">
        <div className="mr-6 flex flex-shrink-0 items-center">
          <Link
            href="/"
            className="flex items-baseline text-3xl font-semibold tracking-tight"
          >
            <Image
              src={authportalIcon}
              alt="Firebase"
              height={24}
              className="mr-2"
            />
            <div>AuthPortal</div>
          </Link>
        </div>
        <div className="block lg:hidden">
          <button className="flex items-center rounded border px-3 py-2  hover:border-white hover:text-white">
            <svg
              className="h-3 w-3 fill-current"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <title>Menu</title>
              <path d="M0 0h20v20H0z" fill="none" />
              <path
                d="M0 4h20v1.5H0zM0 9.5h20V11H0zM0 15h20v1.5H0z"
                fillRule="evenodd"
              />
            </svg>
          </button>
        </div>
        <div className="block w-full flex-grow gap-3 lg:flex lg:w-auto lg:items-center">
          {/* <div className="text-sm lg:flex-grow">
            <Link
              href="https://docs.authportal.dev"
              className="mr-4 mt-4 block hover:text-white  lg:mt-0 lg:inline-block"
            >
              Docs
            </Link>
            <Link
              href="/pricing"
              className="mr-4 mt-4 block hover:text-white  lg:mt-0 lg:inline-block"
            >
              Pricing
            </Link>
          </div> */}
          {/* <div>
            <a
              href="#"
              className="mt-4 inline-block rounded border px-4 py-2 text-sm   leading-none lg:mt-0"
            >
              Sign In
            </a>
          </div>
          <div>
            <a
              href="#"
              className="mt-4 inline-block rounded border bg-black px-4 py-2 text-sm leading-none text-white lg:mt-0"
            >
              Sign Up
            </a>
          </div> */}
        </div>
      </nav>
    </WebsiteSection>
  );
};
