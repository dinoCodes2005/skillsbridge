"use client";

import React, {
  ChangeEvent,
  ReactElement,
  useEffect,
  useState,
  useTransition,
} from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AlertCircle, Check } from "lucide-react";
import ToggleTheme from "@/components/ui/my-components/toggle-theme";
import { useAuth } from "@/components/ui/my-components/authProvider";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/ui/Navbar";
import { useSession } from "next-auth/react";
import { Commet } from "react-loading-indicators";
import { IconGenderMale, IconGenderFemale } from "@tabler/icons-react";

export default function page() {
  const { data: session } = useSession();
  const { user } = useAuth();
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [language, setLanguage] = useState<string>("");
  const [userType, setUserType] = useState<"worker" | "consumer" | "">("");
  const [gender, setGender] = useState<"male" | "female" | "">("");
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const router = useRouter();
  const [newUser, setNewUser] = useState(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    user?.phoneNumber && setPhoneNumber(user?.phoneNumber);
    session?.user?.email && setEmail(session?.user?.email);
  }, [session, user]);

  const handleFirstName = (e: ChangeEvent<HTMLInputElement>) => {
    setFirstName(e.target.value);
  };

  const handleLastName = (e: ChangeEvent<HTMLInputElement>) => {
    setLastName(e.target.value);
  };

  const handleSelect = (value: string) => {
    setLanguage(value);
  };

  const clearValues = () => {
    setFirstName("");
    setLastName("");
    setLanguage("");
    setUserType("");
  };

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
        console.log(response?.data);
        if (response.status === 200) {
          setNewUser(false);
          setFirstName(response?.data.first_name);
          setLastName(response?.data.last_name);
          setLanguage(response?.data.language);
          setUserType(response?.data.type);
          setGender(response?.data.gender);
        }
        if (response.status === 400) {
          setNewUser(true);
        }
      }
    };

    (phoneNumber || email) &&
      startTransition(async () => {
        await handleFetch();
      });
  }, [phoneNumber, email]);

  const handleSubmit = async () => {
    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.append("phone", phoneNumber);
        formData.append("email", email);
        formData.append("first_name", firstName);
        formData.append("last_name", lastName);
        formData.append("language", language);
        formData.append("type", userType);
        formData.append("gender", gender);

        const response = await axios.post(
          process.env.NEXT_PUBLIC_CREATE_PROFILE as string,
          formData
        );
        if (response.status === 201 || response.status === 200)
          setSuccess("Successfully updated your Profile !!");
        setTimeout(() => {
          router.push("/home");
        }, 1000);
        if (response.status === 400) setError("Fill the fields correctly !!");
      } catch (error: any) {
        console.log(error.response?.data || error.message);
        setError("Error occurred while updating/creating profile !");
      }
    });
  };

  return (
    <>
      {!newUser && <Navbar className="" />}
      <ToggleTheme className="fixed right-0 top-0" />
      <Card className="w-[350px] m-auto absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%]">
        <CardHeader>
          <CardTitle>Create Your Profile</CardTitle>
          <CardDescription>Personalise Your Profile</CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="first_name">First Name</Label>
                <Input
                  id="first_name"
                  value={firstName}
                  onChange={handleFirstName}
                  placeholder="John"
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="last_name">Last Name</Label>
                <Input
                  id="last_name"
                  value={lastName}
                  onChange={handleLastName}
                  placeholder="Doe"
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="language">Language</Label>
                <Select onValueChange={handleSelect} value={language}>
                  <SelectTrigger id="language">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    <SelectItem value="hindi">Hindi</SelectItem>
                    <SelectItem value="english">English</SelectItem>
                    <SelectItem value="marathi">Marathi</SelectItem>
                    <SelectItem value="tamil">Tamil</SelectItem>
                    <SelectItem value="bengali">Bengali</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-between space-x-2">
                <Button
                  variant={gender === "male" ? "default" : "outline"}
                  className={`w-1/2 relative transition-all duration-300 ${
                    gender === "male"
                      ? "bg-blue-950 hover:bg-blue-900 text-white shadow-md scale-105"
                      : ""
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    setGender("male");
                  }}
                >
                  {gender === "male" && (
                    <Check className="w-4 h-4 absolute left-2 animate-pulse" />
                  )}
                  <IconGenderMale stroke={2} className="text-blue-600" />
                  <span className={gender === "male" ? "ml-2" : ""}>Male</span>
                </Button>

                <Button
                  variant={gender === "female" ? "default" : "outline"}
                  className={`w-1/2 relative transition-all duration-300 ${
                    gender === "female"
                      ? "bg-pink-950 hover:bg-pink-900 text-white shadow-md scale-105"
                      : ""
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    setGender("female");
                  }}
                >
                  {gender === "female" && (
                    <Check className="w-4 h-4 absolute left-2 animate-pulse" />
                  )}
                  <IconGenderFemale stroke={2} className="text-pink-400" />
                  <span className={gender === "female" ? "ml-2" : ""}>
                    Female
                  </span>
                </Button>
              </div>
              <div className="flex justify-between space-x-2">
                <Button
                  variant={userType === "worker" ? "default" : "outline"}
                  className={`w-1/2 relative transition-all duration-300 ${
                    userType === "worker"
                      ? "bg-green-800 hover:bg-green-700 text-white shadow-md scale-105"
                      : ""
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    setUserType("worker");
                  }}
                >
                  {userType === "worker" && (
                    <Check className="w-4 h-4 absolute left-2 animate-pulse" />
                  )}
                  <span className={userType === "worker" ? "ml-2" : ""}>
                    Worker
                  </span>
                </Button>

                <Button
                  variant={userType === "consumer" ? "default" : "outline"}
                  className={`w-1/2 relative transition-all duration-300 ${
                    userType === "consumer"
                      ? "bg-green-800 hover:bg-green-700 text-white shadow-md scale-105"
                      : ""
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    setUserType("consumer");
                  }}
                >
                  {userType === "consumer" && (
                    <Check className="w-4 h-4 absolute left-2 animate-pulse" />
                  )}
                  <span className={userType === "consumer" ? "ml-2" : ""}>
                    Consumer
                  </span>
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col">
          <div className="flex justify-between w-full mb-2">
            <Button variant="outline" onClick={clearValues}>
              Clear
            </Button>
            <Button onClick={handleSubmit}>Save</Button>
          </div>
          {error && (
            <Alert variant="destructive" className="">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success.length > 0 && (
            <Alert variant="default" className="">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>{success}</AlertTitle>
            </Alert>
          )}
        </CardFooter>
      </Card>

      {isPending && (
        <div className="fixed bottom-10 left-1/2 translate-x-[-50%]">
          <Commet color="#1447e6" size="small" text="" textColor="" />
        </div>
      )}
    </>
  );
}
