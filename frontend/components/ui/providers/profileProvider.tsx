"use client";

import axios from "axios";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { useAuth } from "./authProvider";
import { useSession } from "next-auth/react";
import { iProfile, Location } from "../types/modelTypes";
import { ProfileContextType } from "../types/contextTypes";
import { fetchProfile } from "../api/fetchProfile";

const ProfileContext = createContext<ProfileContextType>({
  profile: null,
  location: {
    type: "Point",
    coordinates: [80.15072331174775, 12.8391499027704],
  },
  setLocation: () => {},
  currentAddress: "",
  setCurrentAddress: () => {},
});

export default function ProfileProvider({ children }: { children: ReactNode }) {
  const { data: session } = useSession();
  const { user } = useAuth();

  const [profile, setProfile] = useState<iProfile | null>(null);
  const [location, setLocation] = useState<Location>({
    type: "Point",
    coordinates: [80.15072331174775, 12.839149902770407],
  });
  const [currentAddress, setCurrentAddress] = useState("");

  useEffect(() => {
    (async () => {
      if (
        !session ||
        !session.user ||
        !session.user.email ||
        !user?.phoneNumber
      )
        return;

      const profile = await fetchProfile(session.user.email);
      profile && setProfile(profile);
    })();
  }, [session?.user?.email, user?.phoneNumber]);

  return (
    <ProfileContext.Provider
      value={{
        profile,
        location,
        setLocation,
        currentAddress,
        setCurrentAddress,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
}

export const useProfile = () => useContext(ProfileContext);
