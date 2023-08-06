"use client";

import { FirebaseError, initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { FC, useState } from "react";
import { useForm } from "react-hook-form";
import { continueWithUser } from "./req/continueWithUser";
import { AuthButton } from "./AuthButton";
import { AuthGoogleLogin } from "./AuthGoogleLogin";
import { ErrorMessages } from "./ErrorMessages";
import { PortalConfig } from "@/components/withConfigPage";
import LinkWithReq from "./link/LinkWithReq";

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
  const EmailComponent = signup ? AuthEmailSignUp : AuthEmailLogin;

  return (
    <div className="flex flex-col">
      <div className="mb-10">
        <h1 className="text-2xl mb-2 text-slate-900">Welcome back</h1>
        <p className="text-sm text-slate-500">
          Log in to your AuthPortal account
        </p>
      </div>
      <div className="flex flex-col gap-5">
        <AuthGoogleLogin config={config} />
        <AuthDivider />
        <EmailComponent config={config} />
      </div>
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
        password
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
        className="border border-gray-400 p-2 rounded w-full"
        type="email"
        placeholder="Email"
        {...register("email", { required: true })}
      />
      {errors.email && (
        <p className="text-red-500 text-sm font-bold">{errors.email.message}</p>
      )}
      <input
        className="border border-gray-400 p-2 rounded w-full"
        type="password"
        placeholder="Password"
        {...register("password", { required: true })}
      />
      {errors.password && (
        <p className="text-red-500 text-sm font-bold">
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
        password
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
        className="border border-gray-400 p-2 rounded w-full"
        type="email"
        placeholder="Email"
        {...register("email", { required: true })}
      />
      {errors.email && (
        <p className="text-red-500 text-sm font-bold">{errors.email.message}</p>
      )}
      <input
        className="border border-gray-400 p-2 rounded w-full"
        type="password"
        placeholder="Password"
        {...register("password", { required: true })}
      />
      {errors.password && (
        <p className="text-red-500 text-sm font-bold">
          {errors.password.message}
        </p>
      )}
      <LinkWithReq
        href="/forgot-password"
        className="text-blue-500 font-bold text-xs"
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
