import * as React from "react";

import { cn } from "@/lib/utils";

export interface InputWithTextProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  suffix: string;
}

const InputWithText = React.forwardRef<HTMLInputElement, InputWithTextProps>(
  ({ className, type, suffix, ...props }, ref) => {
    return (
      <div className="flex w-full items-baseline rounded-md border border-zinc-200 focus-visible:ring-1 focus-visible:ring-zinc-950 dark:border-zinc-800 dark:focus-visible:ring-zinc-300">
        <input
          type={type}
          className={cn(
            "h-9 w-full bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-zinc-500 focus-visible:outline-none   disabled:cursor-not-allowed disabled:opacity-50 dark:placeholder:text-zinc-400",
            className,
          )}
          ref={ref}
          {...props}
        />
        <span className="inline border-l border-zinc-200 px-3 dark:border-zinc-800">
          {suffix}
        </span>
      </div>
    );
  },
);
InputWithText.displayName = "InputWithText";

export { InputWithText };
