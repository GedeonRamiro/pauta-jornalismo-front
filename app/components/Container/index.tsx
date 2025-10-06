import React, { ReactNode } from "react";

export function Container({ children }: { children: ReactNode }) {
  return <div className="max-w-screen-xl flex mx-auto">{children}</div>;
}
