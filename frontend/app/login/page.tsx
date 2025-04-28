"use client";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import {
  type ChangeEvent,
  type FormEvent,
  useEffect,
  useState,
  useTransition,
} from "react";
import ToggleTheme from "@/components/ui/my-components/toggle-theme";

import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { ConfirmationResult } from "firebase/auth";
import { auth } from "@/firebase";
import { Commet } from "react-loading-indicators";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { verify } from "crypto";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/ui/my-components/authProvider";
import { Facebook, Twitter } from "lucide-react";
import axios from "axios";

export default function LoginPage() {
  // Define the possible login steps

  const router = useRouter();

  // State for the login process
  const [mobileNumber, setMobileNumber] = useState<string>("");
  const [otp, setOtp] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string | null>(null);
  const [resendCountdown, setResendCountdown] = useState<number>(0);
  const [recaptchaVerifier, setRecaptchaVerifier] =
    useState<RecaptchaVerifier | null>(null);
  const [confirmationResult, setConfirmationResult] =
    useState<ConfirmationResult | null>(null);
  const [isPending, startTransition] = useTransition();

  const { user } = useAuth();

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resendCountdown > 0) {
      timer = setTimeout(() => {
        setResendCountdown(resendCountdown - 1), 1000;
      });
    }
    return () => clearTimeout(timer);
  }, [resendCountdown]);

  useEffect(() => {
    const recaptchaVerifier = new RecaptchaVerifier(
      auth,
      "recaptcha-container",
      {
        size: "invisible",
      }
    );

    setRecaptchaVerifier(recaptchaVerifier);
    return () => {
      recaptchaVerifier.clear();
    };
  }, [auth]);

  // Handle mobile number input change
  const handleMobileChange = (e: ChangeEvent<HTMLInputElement>) => {
    // Only allow numbers
    const value = e.target.value;
    setMobileNumber(value);
  };

  const requestOtp = async (e?: FormEvent<HTMLFormElement>) => {
    e?.preventDefault();
    setResendCountdown(60);
    startTransition(async () => {
      setError("");
      if (!recaptchaVerifier) {
        setError("RecaptchaVerifier is not initialized !!");
      }

      try {
        const confirmResult = await signInWithPhoneNumber(
          auth,
          mobileNumber,
          recaptchaVerifier
        );

        setConfirmationResult(confirmResult);
        setSuccess("OTP sent successfully.");
      } catch (error: any) {
        console.log(error);
        setResendCountdown(0);

        switch (error.code) {
          case "auth/invalid-phone-number":
            setError("Invalid phone number format");
            break;
          case "auth/too-many-requests":
            setError("Too many attempts. Please try later.");
            break;
          case "auth/quota-exceeded":
            setError("Quota exceeded. Contact support.");
            break;
          default:
            setError("Failed to send OTP: " + error.message);
        }
      }
    });
  };

  const verifyOtp = async () => {
    startTransition(async () => {
      setError("");
      if (!confirmationResult) {
        setError("Please request the OTP first.");
        return;
      }

      try {
        const result = await confirmationResult?.confirm(otp);
        console.log("Verification successful, user:", result.user);
        const loggedInUser = result.user;
        const token = await loggedInUser?.getIdToken();
        document.cookie = `authToken=${token}`;
        const response = await axios.post(
          "http://localhost:8000/api/fetch-profile",
          { phone: mobileNumber, fetchType: "finding" }
        );
        if (response.status === 201) {
          router.replace("/profile/");
        }
        if (response.status === 409) {
          router.replace("/home/");
        }
      } catch (error) {
        console.log(error);
        setError("Failed to verify the OTP. Please check the OTP.");
      }
    });
  };

  useEffect(() => {
    const hasEnteredAllDigits = otp.length === 6;
    if (hasEnteredAllDigits) verifyOtp();
  }, [otp]);

  return (
    <div className="min-h-screen flex items-center justify-center ">
      <ToggleTheme className="fixed top-0 right-0"></ToggleTheme>

      <Card className="w-full max-w-2xl  shadow-lg m-4">
        <div className="grid grid-cols-1 md:grid-cols-[2fr_100px_1fr]">
          <div>
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-2xl font-bold ">Login</CardTitle>
              <CardDescription className="text-sm ">
                Sign in with your Number
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!confirmationResult && (
                <>
                  <form className="space-y-4" onSubmit={requestOtp}>
                    <div className="space-y-2">
                      <Label htmlFor="mobile" className="text-sm ">
                        Mobile Number
                      </Label>

                      <Input
                        id="mobile"
                        type="tel"
                        value={mobileNumber}
                        onChange={handleMobileChange}
                        required
                        maxLength={13}
                        className="rounded-l-none  h-10 px-3"
                        placeholder="Enter your mobile number"
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={
                        !mobileNumber || isPending || resendCountdown > 0
                      }
                      className="w-24 mx-auto h-10 "
                    >
                      {resendCountdown > 0
                        ? `Resend OTP in ${resendCountdown}`
                        : isPending
                        ? "Sending OTP"
                        : "Send OTP"}
                    </Button>
                  </form>
                  <CardDescription className="text-sm mt-2 ">
                    Enter a phone number with the country code (i.e +91 for
                    India)
                  </CardDescription>
                </>
              )}

              {confirmationResult && (
                <InputOTP
                  maxLength={6}
                  value={otp}
                  onChange={(value) => setOtp(value)}
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                  </InputOTPGroup>
                  <InputOTPSeparator />
                  <InputOTPGroup>
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              )}

              {error && (
                <div className="bg-red-700 text-white my-4 rounded-md p-2 text-center text-sm">
                  {error}
                </div>
              )}

              {success && (
                <div className="bg-green-600 text-white my-4 rounded-md p-2 text-center text-sm">
                  {success}
                </div>
              )}
            </CardContent>
          </div>
          <div className="hidden md:flex items-center justify-center">
            <div className="flex flex-col items-center h-full">
              <div className="h-full w-px bg-gray-200 dark:bg-gray-700"></div>
              <span className="bg-white dark:bg-gray-900 px-2 py-1 text-xs text-gray-500 dark:text-gray-400">
                OR
              </span>
              <div className="h-full w-px bg-gray-200 dark:bg-gray-700"></div>
            </div>
          </div>

          {!confirmationResult && (
            <>
              <div className="flex md:hidden mx-4 my-4 items-center space-x-4 py-2">
                <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700"></div>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  OR
                </span>
                <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700"></div>
              </div>
              <div className="flex flex-col justify-evenly">
                <CardHeader className="text-center pb-2">
                  <CardTitle className="text-lg font-bold ">
                    Login with
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {!confirmationResult && (
                    <div className="flex flex-col gap-4 justify-center">
                      <Button
                        variant={"outline"}
                        onClick={() => signIn("google")}
                      >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                          <path
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            fill="#4285F4"
                          />
                          <path
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            fill="#34A853"
                          />
                          <path
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            fill="#FBBC05"
                          />
                          <path
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            fill="#EA4335"
                          />
                          <path d="M1 1h22v22H1z" fill="none" />
                        </svg>
                        Google
                      </Button>
                      <Button variant={"outline"}>
                        <Facebook className="w-5 h-5 text-blue-600" />
                        Facebook
                      </Button>
                      <Button variant={"outline"}>
                        <Twitter className="text-blue-400" /> Twitter
                      </Button>
                    </div>
                  )}

                  {error && (
                    <div className="bg-red-700 text-white my-4 rounded-md p-2 text-center text-sm">
                      {error}
                    </div>
                  )}

                  {success && (
                    <div className="bg-green-600 text-white my-4 rounded-md p-2 text-center text-sm">
                      {success}
                    </div>
                  )}
                </CardContent>
              </div>
            </>
          )}
        </div>
      </Card>
      <div id="recaptcha-container" />
      {isPending && (
        <div className="fixed bottom-10">
          <Commet color="#1447e6" size="small" text="" textColor="" />
        </div>
      )}
    </div>
  );
}
