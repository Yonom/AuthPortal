import firebaseIcon from "./firebase.svg";
import Image from "next/image";
import SignInButton from "./SignInButton";
import { WebsiteSection } from "./components/WebsiteSection";

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
              {`const { signInWithPopup } = new AuthPortal({
  domain: 'auth.yourapp.com',
  client_id: 'your-client-id',
  firebase_auth: getAuth(app),
});

<button onClick={signInWithPopup}>Sign In</button>`}
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
            <SignInButton />
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
      <Jumbotron />
      <CodeExample />
      {/* <Customization /> */}
    </>
  );
};

export default Home;
