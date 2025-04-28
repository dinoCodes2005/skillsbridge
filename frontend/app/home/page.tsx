"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/ui/my-components/authProvider";
import { useProfile } from "@/components/ui/my-components/profileProvider";
import { Navbar } from "@/components/ui/Navbar";
import { auth } from "@/firebase";
import { signOut } from "firebase/auth";
import { useSession } from "next-auth/react";
import React from "react";

export default function page() {
  const { user } = useAuth();
  const { profile } = useProfile();
  const { data: session } = useSession();
  console.log("Ye mera session hai", session?.user);
  // console.log(profile);

  return (
    <>
      <Navbar className="" />
    </>
  );
}
