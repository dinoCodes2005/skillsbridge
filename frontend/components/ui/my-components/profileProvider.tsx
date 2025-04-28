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

export interface iProfile {
  phone: string;
  first_name: string;
  last_name: string;
  language: string;
  type: "consumer" | "worker" | "";
}

type ProfileContextType = {
  profile: iProfile | null;
};

const ProfileContext = createContext<ProfileContextType>({ profile: null });
export default function ProfileProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [language, setLanguage] = useState<string>("");
  const [userType, setUserType] = useState<"worker" | "consumer" | "">("");

  useEffect(() => {
    const handleFetch = async () => {
      const response = await axios.post(
        "http://localhost:8000/api/fetch-profile",
        {
          phone: phoneNumber,
          fetchType: "fetching",
        }
      );
      if (response.status === 200) {
        setFirstName(response?.data.first_name);
        setLastName(response?.data.last_name);
        setLanguage(response?.data.language);
        setUserType(response?.data.type);
      }
    };

    phoneNumber && handleFetch();
  }, [phoneNumber]);

  useEffect(() => {
    user?.phoneNumber && setPhoneNumber(user?.phoneNumber);
  }, [user]);

  const profile: iProfile = {
    phone: phoneNumber,
    first_name: firstName,
    last_name: lastName,
    language: language,
    type: userType,
  };

  return (
    <ProfileContext.Provider value={{ profile }}>
      {children}
    </ProfileContext.Provider>
  );
}

export const useProfile = () => useContext(ProfileContext);
