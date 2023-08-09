"use client";

import { FC } from "react";
import Link from "next/link";
import { useURLWithReq } from "../req/urlWithReq";

export type LinkWithReqProps = {
  href: string;
  className?: string;
  children?: React.ReactNode;
};

const LinkWithReqInner: FC<LinkWithReqProps> = ({ href, ...rest }) => {
  const url = useURLWithReq(href);

  return <Link href={url} {...rest} />;
};

export default LinkWithReqInner;
