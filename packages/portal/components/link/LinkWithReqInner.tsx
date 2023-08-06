"use client";

import { FC } from "react";
import Link from "next/link";
import { useUrlWithReq } from "../req/urlWithReq";

export type LinkWithReqProps = {
  href: string;
  className?: string;
  children?: React.ReactNode;
};

const LinkWithReqInner: FC<LinkWithReqProps> = ({ href, ...rest }) => {
  const url = useUrlWithReq(href);
  return <Link href={url} {...rest} />;
};

export default LinkWithReqInner;
