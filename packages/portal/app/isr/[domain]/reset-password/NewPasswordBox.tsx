"use client";

import { FirebaseError, initializeApp } from "firebase/app";
import {
  confirmPasswordReset,
  getAuth,
  signInWithEmailAndPassword,
  verifyPasswordResetCode,
} from "firebase/auth";
import { FC } from "react";
import { useForm } from "react-hook-form";
import { ErrorMessages } from "../../../../components/ErrorMessages";
import { AuthButton } from "../../../../components/AuthButton";
import { continueWithUser } from "../../../../components/req/continueWithUser";
import { PortalConfig } from "../../../../components/withConfigPage";

export const initFirebase = (serverConfig: NewPasswordBoxProps["config"]) => {
  const { firebase_config } = serverConfig;
  const app = initializeApp(firebase_config);
  const auth = getAuth(app);
  return { auth };
};

type NewPasswordBoxProps = {
  config: PortalConfig;
};

const NewPasswordBox: FC<NewPasswordBoxProps> = ({ config }) => {
  return (
    <div className="flex flex-col">
      <div className="mb-10">
        <h1 className="text-2xl mb-2 text-slate-900">Reset your password</h1>
        <p className="text-sm text-slate-500">Set up a new password.</p>
      </div>
      <AuthNewPassword config={config} />
    </div>
  );
};

const AuthNewPassword: FC<NewPasswordBoxProps> = ({ config }) => {
  const {
    register,
    watch,
    getValues,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    defaultValues: {
      password: "",
      passwordConfirmation: "",
    },
  });

  const handleNewPassword = async () => {
    // TODO get email from url earlier
    const oobCode = new URLSearchParams(window.location.search).get("oobCode");
    if (!oobCode) throw new Error("No oobCode found in url");

    try {
      const { auth } = initFirebase(config);
      const { password } = getValues();
      const email = await verifyPasswordResetCode(auth, oobCode);
      await confirmPasswordReset(auth, oobCode, password);
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
    }
  };

  return (
    <form
      onSubmit={handleSubmit(handleNewPassword)}
      className="flex flex-col gap-5"
    >
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
      <input
        className="border border-gray-400 p-2 rounded w-full"
        type="password"
        placeholder="Password Confirmation"
        {...register("passwordConfirmation", {
          required: true,
          validate: (val: string) => {
            if (watch("password") != val) {
              return "Your passwords do no match";
            }
          },
        })}
      />
      {errors.passwordConfirmation && (
        <p className="text-red-500 text-sm font-bold">
          {errors.passwordConfirmation.message}
        </p>
      )}
      <AuthButton type="submit" text="Update Password" />
    </form>
  );
};

export default NewPasswordBox;
