import { FC } from "react";
import firebaseIcon from "./firebase.svg";
import authportalIcon from "./logo.svg";
import Image from "next/image";

type WebsiteSectionProps = {
  className?: string;
  children: React.ReactNode;
};

const WebsiteSection: FC<WebsiteSectionProps> = ({ children, className }) => {
  return (
    <div className={"w-full " + className}>
      <div className="mx-auto max-w-screen-lg px-6">{children}</div>
    </div>
  );
};

const Navbar = () => {
  return (
    <WebsiteSection className="border-b border-b-black">
      <nav className="flex flex-wrap justify-between py-5">
        <div className="mr-6 flex flex-shrink-0 items-center">
          <div className="flex items-baseline text-3xl font-semibold tracking-tight">
            <Image
              src={authportalIcon}
              alt="Firebase"
              height={24}
              className="mr-2"
            />
            <div>AuthPortal</div>
          </div>
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
          <div className="text-sm lg:flex-grow">
            <a
              href="#responsive-header"
              className="mr-4 mt-4 block hover:text-white  lg:mt-0 lg:inline-block"
            >
              Docs
            </a>
            <a
              href="#responsive-header"
              className="mr-4 mt-4 block hover:text-white  lg:mt-0 lg:inline-block"
            >
              Pricing
            </a>
            <a
              href="#responsive-header"
              className="mt-4 block hover:text-white lg:mt-0  lg:inline-block"
            >
              Blog
            </a>
          </div>
          <div>
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
          </div>
        </div>
      </nav>
    </WebsiteSection>
  );
};

const Jumbotron = () => {
  return (
    <WebsiteSection>
      <main className="flex flex-1 flex-col items-center justify-center px-20 text-center">
        <div className="py-40">
          <span className="text-6xl">Low-code authentication</span>
          <br />
          <br />
          <span className="text-4xl text-black text-opacity-[54%]">
            for your{" "}
            <Image
              src={firebaseIcon}
              alt="Firebase"
              width={195}
              className="inline pb-[9px]"
            />{" "}
            app.
          </span>
          <br />
          <br />
        </div>
      </main>
    </WebsiteSection>
  );
};

const CodeExample = () => {
  return (
    <WebsiteSection className="border-y border-black py-14">
      <div className="pb-10 text-center text-2xl">
        Add Authentication in 7 lines of code:
      </div>
      <div className="flex flex-1 items-center gap-10">
        <div className="rounded-lg border border-black text-sm">
          <div className="inline-block border-r border-black px-4 py-2 font-bold">
            <pre>page.tsx</pre>
          </div>
          <div className="border-t border-black"></div>
          <pre className="p-4">
            <code>
              {`const authPortal = new AuthPortal({
  domain: 'auth.yourapp.com',
  clientId: 'your-client-id',
  firebaseAuth: getAuth(app),
});

const signIn = () => authPortal.signInWithPopup();
return <button onClick={signIn}>Sign In</button>`}
            </code>
          </pre>
        </div>
        <div>-&gt;</div>
        <div className="flex-grow rounded-lg border border-black text-sm">
          <div className="inline-block w-full px-4 py-2 font-bold">
            <pre>https://yourapp.com/</pre>
          </div>
          <div className="border-t border-black"></div>
          <div className="p-4">
            <button className="rounded bg-blue-600 px-4 py-2 text-white">
              Sign In
            </button>
            <pre className="pt-4">^ Try it! :)</pre>
          </div>
        </div>
      </div>
      <div className="pt-10 text-center text-lg text-gray-700">
        AuthPortal takes care of your Authentication UI so you don&apos;t have
        to.
      </div>
    </WebsiteSection>
  );
};

const Customization = () => {
  return (
    <WebsiteSection className="py-14">
      <div className="pb-10 text-center text-2xl">
        Customize your Authentication UIs:
      </div>
    </WebsiteSection>
  );
};

const Home = () => {
  return (
    <>
      <Navbar />
      <Jumbotron />
      <CodeExample />
      <Customization />
    </>
  );
};

export default Home;
