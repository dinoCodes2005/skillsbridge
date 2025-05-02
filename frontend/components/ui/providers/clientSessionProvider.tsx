// components/ClientSessionWrapper.tsx

"use client"; // Make this a client component

import { SessionProvider } from "next-auth/react"; // Import SessionProvider
import { ReactNode } from "react";

export default function ClientSessionWrapper({
  children,
}: {
  children: ReactNode;
}) {
  return <SessionProvider>{children}</SessionProvider>;
}
