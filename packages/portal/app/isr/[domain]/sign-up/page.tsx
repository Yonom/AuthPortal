import { PortalConfig } from "@/services/db/types";
import LoginBox from "../components/LoginBox";
import { withConfigPage } from "../withConfigPage";
import { FC } from "react";

type SignupPageProps = {
  config: PortalConfig;
};

const SignupPage: FC<SignupPageProps> = async ({ config }) => {
  return <LoginBox config={config} signup />;
};

export default withConfigPage(SignupPage);
