"use client";

import { usePathname } from "next/navigation";

export default function FooterWrapper({children}) {
  const pathname = usePathname();

  const hideFooterPaths = ["/login"];

  if (hideFooterPaths.includes(pathname)) {
    return null;
  }

  return (
    <>
      {children}
    </>
  );
}
