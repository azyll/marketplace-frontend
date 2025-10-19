import { ReactNode } from "react";

interface Props {
  children: ReactNode;
  state?: "edit" | "view";
  value?: any;
  label?: string;
}

export const EditableWrapper = ({
  children,
  state = "view",
  label,
  value,
}: Props) => {
  if (state === "edit" && children) {
    return children;
  }

  return (
    <div className="mt-4">
      <p className="text-xs font-bold leading-3 text-neutral-700">{label}</p>
      <p className="text-lg">{value}</p>
    </div>
  );
};
