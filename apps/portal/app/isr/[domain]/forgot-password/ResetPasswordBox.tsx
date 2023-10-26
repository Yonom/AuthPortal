"use client";

import { FirebaseError, initializeApp } from "firebase/app";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { FC } from "react";
import { useForm } from "react-hook-form";
import { ErrorMessages } from "../../../../components/ErrorMessages";
import { AuthButton } from "../../../../components/AuthButton";
import { getURLWithReq } from "../../../../components/req/urlWithReq";
import { PortalConfig } from "../../../../components/withConfigPage";
import LinkWithReq from "@/components/link/LinkWithReq";
import { getHasEmailLogin } from "@/components/getHasEmailLogin";
import { notFound } from "next/navigation";

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
  if (!getHasEmailLogin(config)) notFound();

  return (
    <div className="flex flex-col">
      <div className="mb-10">
        <h1 className="mb-2 text-2xl text-slate-900">Reset your password</h1>
        <p className="text-sm text-slate-500">
          Enter your email address and we will send you instructions to reset
          your password.
        </p>
      </div>
      <AuthEmailReset config={config} />
    </div>
  );
};

const AuthEmailReset: FC<ResetPasswordBoxProps> = ({ config }) => {
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

  const handleSetPasswordResetEmail = async () => {
    try {
      const { auth } = initFirebase(config);
      const { email } = getValues();
      await sendPasswordResetEmail(auth, email, {
        url: await getURLWithReq("/sign-in"),
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

  return (
    <form
      onSubmit={handleSubmit(handleSetPasswordResetEmail)}
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
      <AuthButton type="submit" text="Send Reset Email" />
      <p className="text-xs">
        <LinkWithReq href="/sign-in" className="text-blue-500">
          Back
        </LinkWithReq>
      </p>
    </form>
  );
};

export default ResetPasswordBox;
