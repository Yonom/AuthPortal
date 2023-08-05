import { FC } from "react";

interface AuthButtonProps {
  type?: "submit";
  text: string;
  loading?: boolean;
  onClick?: () => void;
}
export const AuthButton: FC<AuthButtonProps> = ({
  type,
  text,
  loading,
  onClick,
}) => {
  return (
    <button
      type={type}
      disabled={loading}
      className="bg-blue-500 hover:bg-blue-700 disabled:bg-slate-300 text-white font-bold py-2 px-4 rounded"
      onClick={onClick}
    >
      {text}
    </button>
  );
};
