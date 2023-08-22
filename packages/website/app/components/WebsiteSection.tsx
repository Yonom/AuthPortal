import { FC } from "react";

type WebsiteSectionProps = {
  className?: string;
  children: React.ReactNode;
};
export const WebsiteSection: FC<WebsiteSectionProps> = ({
  children,
  className,
}) => {
  return (
    <div className={"w-full " + className}>
      <div className="mx-auto flex max-w-screen-lg flex-col px-6">
        {children}
      </div>
    </div>
  );
};
