"use client";

import { FirebaseError, initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  EmailAuthProvider,
  GoogleAuthProvider,
} from "firebase/auth";
import { FC, useState } from "react";
import { useForm } from "react-hook-form";
import { continueWithUser } from "./req/continueWithUser";
import { AuthButton } from "./AuthButton";
import { AuthGoogleLogin } from "./AuthGoogleLogin";
import { ErrorMessages } from "./ErrorMessages";
import { PortalConfig } from "@/components/withConfigPage";
import LinkWithReq from "./link/LinkWithReq";
import { redirect, useRouter } from "next/navigation";
import { getHasEmailLogin } from "./getHasEmailLogin";

export const initFirebase = (serverConfig: LoginBoxProps["config"]) => {
  const { firebase_config } = serverConfig;
  const app = initializeApp(firebase_config);
  const auth = getAuth(app);
  return { auth };
};

interface LoginBoxProps {
  config: PortalConfig;
  signup?: boolean;
}

const AuthDivider: FC = () => {
  return (
    <div className="flex flex-row items-center justify-center">
      <div className="flex-grow border-t border-slate-500" />
      <div className="px-2 text-slate-500">or</div>
      <div className="flex-grow border-t border-slate-500" />
    </div>
  );
};

const LoginBox: FC<LoginBoxProps> = ({ config, signup }) => {
  const hasEmailLogin = getHasEmailLogin(config);
  if (!hasEmailLogin && signup && typeof window !== "undefined") {
    // redirect to sign in
    const url = new URL(window.location.href);
    url.pathname = "/sign-in";
    redirect(url.href);
  }

  if (config.providers.length === 0) {
    throw new Error("No providers available");
  }

  const loginElements = [] as JSX.Element[];
  config.providers.forEach(({ provider_id }, index) => {
    switch (provider_id) {
      case EmailAuthProvider.PROVIDER_ID: {
        if (index > 0)
          loginElements.push(<AuthDivider key="pre-email-divider" />);
        const EmailComponent = signup ? AuthEmailSignUp : AuthEmailLogin;
        loginElements.push(
          <EmailComponent key={provider_id} config={config} />,
        );
        if (index < config.providers.length - 1)
          loginElements.push(<AuthDivider key="post-email-divider" />);
        break;
      }
      case GoogleAuthProvider.PROVIDER_ID: {
        loginElements.push(
          <AuthGoogleLogin key={provider_id} config={config} />,
        );
        break;
      }
      default:
        throw new Error("Unknown provider: " + provider_id);
    }
  });

  return (
    <div className="flex flex-col">
      <div className="mb-10">
        <h1 className="mb-2 text-2xl text-slate-900">Welcome back</h1>
        <p className="text-sm text-slate-500">
          Log in to your AuthPortal account
        </p>
      </div>
      <div className="flex flex-col gap-5">{loginElements}</div>
    </div>
  );
};

const AuthEmailSignUp: FC<LoginBoxProps> = ({ config }) => {
  const [loading, setLoading] = useState(false);
  const {
    register,
    getValues,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleEmailPasswordSignup = async () => {
    try {
      setLoading(true);
      const { auth } = initFirebase(config);
      const { email, password } = getValues();
      const credential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      continueWithUser(credential.user);
    } catch (ex) {
      if (ex instanceof FirebaseError) {
        const message =
          ErrorMessages[ex.code as keyof typeof ErrorMessages] || ex.message;
        setError("password", { message });
      } else {
        throw ex;
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(handleEmailPasswordSignup)}
      className="flex flex-col gap-5"
    >
      <input
        className="w-full rounded border border-gray-400 p-2"
        type="email"
        placeholder="Email"
        {...register("email", { required: true })}
      />
      {errors.email && (
        <p className="text-sm font-bold text-red-500">{errors.email.message}</p>
      )}
      <input
        className="w-full rounded border border-gray-400 p-2"
        type="password"
        placeholder="Password"
        {...register("password", { required: true })}
      />
      {errors.password && (
        <p className="text-sm font-bold text-red-500">
          {errors.password.message}
        </p>
      )}
      <AuthButton type="submit" text="Sign up" loading={loading} />
      <p className="text-xs">
        Have an account?{" "}
        <LinkWithReq href="/sign-in" className="text-blue-500">
          Log in
        </LinkWithReq>
      </p>
    </form>
  );
};

const AuthEmailLogin: FC<LoginBoxProps> = ({ config }) => {
  const [loading, setLoading] = useState(false);
  const {
    register,
    getValues,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleEmailPasswordLogin = async () => {
    try {
      setLoading(true);
      const { auth } = initFirebase(config);
      const { email, password } = getValues();
      const credential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );
      continueWithUser(credential.user);
    } catch (ex) {
      if (ex instanceof FirebaseError) {
        const message =
          ErrorMessages[ex.code as keyof typeof ErrorMessages] || ex.message;
        setError("password", { message });
      } else {
        throw ex;
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(handleEmailPasswordLogin)}
      className="flex flex-col gap-5"
    >
      <input
        className="w-full rounded border border-gray-400 p-2"
        type="email"
        placeholder="Email"
        {...register("email", { required: true })}
      />
      {errors.email && (
        <p className="text-sm font-bold text-red-500">{errors.email.message}</p>
      )}
      <input
        className="w-full rounded border border-gray-400 p-2"
        type="password"
        placeholder="Password"
        {...register("password", { required: true })}
      />
      {errors.password && (
        <p className="text-sm font-bold text-red-500">
          {errors.password.message}
        </p>
      )}
      <LinkWithReq
        href="/forgot-password"
        className="text-xs font-bold text-blue-500"
      >
        Forgot password?
      </LinkWithReq>
      <AuthButton type="submit" text="Log in" loading={loading} />
      <p className="text-xs">
        Don&apos;t have an account?{" "}
        <LinkWithReq href="/sign-up" className="text-blue-500">
          Sign up
        </LinkWithReq>
      </p>
    </form>
  );
};

export default LoginBox;
