"use client";

import { FirebaseError, initializeApp } from "firebase/app";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { FC } from "react";
import { useForm } from "react-hook-form";
import { ErrorMessages } from "../components/ErrorMessages";
import { AuthButton } from "../components/AuthButton";
import { PortalConfig } from "@/services/db/types";
import { useRouter } from "next/navigation";
import { urlWithState } from "../urlWithState";

export const initFirebase = (serverConfig: ResetPasswordBoxProps["config"]) => {
  const { firebase_config } = serverConfig;
  const app = initializeApp(firebase_config);
  const auth = getAuth(app);
  return { auth };
};

type ResetPasswordBoxProps = {
  config: PortalConfig;
};

const ResetPasswordBox: FC<ResetPasswordBoxProps> = ({ config }) => {
  return (
    <div className="flex flex-col">
      <div className="mb-10">
        <h1 className="text-2xl mb-2 text-slate-900">Reset your password</h1>
        <p className="text-sm text-slate-500">
          Enter your email address and we will send you instructions to reset
          your password.
        </p>
      </div>
      <AuthEmailLogin config={config} />
    </div>
  );
};

const AuthEmailLogin: FC<ResetPasswordBoxProps> = ({ config }) => {
  const {
    register,
    getValues,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
    },
  });
  const router = useRouter();

  const handleEmailPasswordLogin = async () => {
    try {
      const { auth } = initFirebase(config);
      const { email } = getValues();
      await sendPasswordResetEmail(auth, email, {
        url: urlWithState("/sign-in").href,
      });
    } catch (ex) {
      if (ex instanceof FirebaseError) {
        const message =
          ErrorMessages[ex.code as keyof typeof ErrorMessages] || ex.message;
        setError("email", { message });
      } else {
        throw ex;
      }
    }
  };

  const handleSignIn = () => {
    router.push(urlWithState("/sign-in").href);
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
      <AuthButton type="submit" text="Send Reset Email" />
      <p className="text-xs">
        <a onClick={handleSignIn} className="text-blue-500">
          Back
        </a>
      </p>
    </form>
  );
};

export default ResetPasswordBox;
