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

export interface iProfile {
  phone: string;
  first_name: string;
  last_name: string;
  language: string;
  type: "consumer" | "worker" | "";
  gender: "male" | "female" | "";
}

type ProfileContextType = {
  profile: iProfile | null;
};

const ProfileContext = createContext<ProfileContextType>({ profile: null });
export default function ProfileProvider({ children }: { children: ReactNode }) {
  const { data: session } = useSession();
  const { user } = useAuth();
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [language, setLanguage] = useState<string>("");
  const [userType, setUserType] = useState<"worker" | "consumer" | "">("");
  const [gender, setGender] = useState<"male" | "female" | "">("");

  useEffect(() => {
    user?.phoneNumber && setPhoneNumber(user?.phoneNumber);
    session?.user?.email && setEmail(session?.user?.email);
  }, [session, user]);

  useEffect(() => {
    const handleFetch = async () => {
      if (phoneNumber || email) {
        const response = await axios.post(
          process.env.NEXT_PUBLIC_FETCH_PROFILE as string,
          {
            phone: phoneNumber,
            email: email,
            fetchType: "fetching",
          }
        );
        if (response.status === 200) {
          setFirstName(response?.data.first_name);
          setLastName(response?.data.last_name);
          setLanguage(response?.data.language);
          setUserType(response?.data.type);
          setGender(response?.data.gender);
        }
      }
    };

    (user?.phoneNumber || session?.user?.email) && handleFetch();
  }, [user, session]);

  useEffect(() => {
    user?.phoneNumber && setPhoneNumber(user?.phoneNumber);
  }, [user]);

  const profile: iProfile = {
    phone: phoneNumber,
    first_name: firstName,
    last_name: lastName,
    language: language,
    type: userType,
    gender: gender,
  };

  return (
    <ProfileContext.Provider value={{ profile }}>
      {children}
    </ProfileContext.Provider>
  );
}

export const useProfile = () => useContext(ProfileContext);
