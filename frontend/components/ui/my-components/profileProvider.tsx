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

export type Location = {
  type: "Point";
  coordinates: [number, number]; // [lng, lat]
};

export interface iProfile {
  _id: string;
  phone: string;
  first_name: string;
  last_name: string;
  language: string;
  type: "consumer" | "worker" | "";
  gender: "male" | "female" | "";
}

type ProfileContextType = {
  profile: iProfile | null;
  location: Location;
  setLocation: React.Dispatch<React.SetStateAction<Location>>;
  currentAddress: string;
  setCurrentAddress: React.Dispatch<React.SetStateAction<string>>;
};

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
    if (!session?.user?.email && !user?.phoneNumber) return;

    const fetchProfile = async () => {
      try {
        const res = await axios.post(
          process.env.NEXT_PUBLIC_FETCH_PROFILE as string,
          {
            phone: user?.phoneNumber,
            email: session?.user?.email,
            fetchType: "fetching",
          }
        );
        if (res.status === 200) {
          const data = res.data;
          setProfile({
            _id: data._id,
            phone: user?.phoneNumber || "",
            first_name: data.first_name,
            last_name: data.last_name,
            language: data.language,
            type: data.type,
            gender: data.gender,
          });
        }
      } catch (err) {
        console.log("Fetch Profile Error:", err);
      }
    };

    fetchProfile();
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
