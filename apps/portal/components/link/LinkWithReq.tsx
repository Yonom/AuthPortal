import { FC, Suspense } from "react";
import Link from "next/link";
import LinkWithReqInner, { LinkWithReqProps } from "./LinkWithReqInner";

const LinkWithReq: FC<LinkWithReqProps> = (props) => {
  return (
    <Suspense fallback={<Link {...props} href="#" />}>
      <LinkWithReqInner {...props} />
    </Suspense>
  );
};

export default LinkWithReq;
