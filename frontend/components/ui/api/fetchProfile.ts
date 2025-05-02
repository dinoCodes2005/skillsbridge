import axios from "axios";
import { useSession } from "next-auth/react";
import { useAuth } from "../providers/authProvider";

export const fetchProfile = async (email: string | "") => {
  try {
    const res = await axios.post(
      process.env.NEXT_PUBLIC_FETCH_PROFILE as string,
      {
        email,
        fetchType: "fetching",
      }
    );
    if (res.status === 200) {
      const data = res.data;
      return data;
    } else if (res.status === 400) {
      console.log("Profile nahi mila ");
      return null;
    }
  } catch (err) {
    console.log("Fetch Profile Error:", err);
    return null;
  }
};
