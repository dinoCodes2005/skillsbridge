"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/components/ui/my-components/authProvider";
import MapDialog from "@/components/ui/my-components/map-dialog";
import { useProfile } from "@/components/ui/my-components/profileProvider";
import { Navbar } from "@/components/ui/Navbar";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import { MapPin, Search } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { start } from "repl";
import { io } from "socket.io-client";

const socket = io(process.env.NEXT_PUBLIC_BACKEND_WEBSOCKET_URL); // Adjust the URL if needed
export default function Page() {
  const { user } = useAuth();
  const router = useRouter();
  const { profile, location, setLocation, currentAddress, setCurrentAddress } =
    useProfile();
  const { data: session } = useSession();

  const [service, setService] = useState("");
  const [problem, setProblem] = useState("");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  useEffect(() => {
    if (session?.user?.email) {
      console.log("SESSION DATA: ", session);
    }
  }, [session]);

  useEffect(() => {
    if (profile) {
      console.log("PROFILE DATA: ", profile);
    }
  }, [profile]);

  useEffect(() => {
    console.log(service, problem, currentAddress, location);
  }, [currentAddress, service, problem]);

  // Setup socket connection
  useEffect(() => {
    // On component mount, establish the WebSocket connection
    socket.on("connect", () => {
      console.log("Frontend message : Connected to server with ID:", socket.id);
    });

    socket.on("problem", (data) => {
      console.log(data);
    });

    // Clean up the socket connection when the component unmounts
    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    (async () => {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json`,
        {
          params: {
            latlng: `${location.coordinates[0]},${location.coordinates[1]}`,
            key: process.env.NEXT_PUBLIC_GOOGLE_MAP_API,
          },
        }
      );
      console.log(response.data);
    })();
    console.log(
      `Current Location: Lng-${location.coordinates[0]}, Lat-${location.coordinates[1]}  `
    );
  }, [location]);

  const handleSearch = () => {
    socket.emit("problem", {
      owner: profile?._id,
      service,
      problem,
      currentAddress,
      location: {
        type: "Point",
        coordinates: [location?.coordinates[0], location?.coordinates[1]],
      },
    });
  };

  return (
    <>
      <Navbar />

      <main className="flex-1">
        <section className="py-8 md:py-16 px-4 md:px-6 lg:px-8">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-center">
              <div className="flex flex-col gap-4 md:gap-6 max-w-xl mx-auto md:mx-0">
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                  Find Trusted Professionals Fast
                </h1>
                <p className="text-muted-foreground text-base md:text-lg">
                  Connect with verified experts for all your home and technical
                  service needs.
                </p>

                <Card className="border shadow-sm w-full">
                  <CardContent className="p-4 md:p-6 space-y-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="service-type"
                        className="text-sm md:text-base font-medium"
                      >
                        Select Type of Service
                      </Label>
                      <Select
                        value={service}
                        onValueChange={(value) => setService(value)}
                      >
                        <SelectTrigger id="service-type" className="w-full">
                          <SelectValue placeholder="Select Service" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Services</SelectLabel>
                            <SelectItem value="electrician">
                              Electrician
                            </SelectItem>
                            <SelectItem value="plumber">Plumber</SelectItem>
                            <SelectItem value="carpenter">Carpenter</SelectItem>
                            <SelectItem value="mechanic">Mechanic</SelectItem>
                            <SelectItem value="mobile_engineer">
                              Mobile Engineer
                            </SelectItem>
                            <SelectItem value="laptop_engineer">
                              Laptop Engineer
                            </SelectItem>
                            <SelectItem value="designer">Designer</SelectItem>
                            <SelectItem value="painter">Painter</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="problem"
                        className="text-sm md:text-base font-medium"
                      >
                        Describe Your Problem
                      </Label>
                      <Textarea
                        value={problem}
                        onChange={(e) => {
                          setProblem(e.target.value);
                        }}
                        id="problem"
                        className="min-h-[80px] md:min-h-[100px] resize-none"
                        placeholder="Please describe the issue you're facing..."
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="location"
                        className="text-sm md:text-base font-medium flex items-center gap-2"
                      >
                        <MapPin className="h-4 w-4" /> Your Location
                      </Label>
                      <div className="flex gap-2">
                        <Input
                          id="location"
                          className="flex-1"
                          placeholder="Enter your address"
                          value={currentAddress}
                          onChange={(e) => setCurrentAddress(e.target.value)}
                        />
                        <MapDialog />
                      </div>
                    </div>

                    <Button
                      onClick={handleSearch}
                      className="w-full mt-2"
                      size="lg"
                    >
                      <Search className="mr-2 h-4 w-4" /> Find Professionals
                    </Button>
                  </CardContent>
                </Card>
              </div>
              <div className="relative block">
                <div className="aspect-square relative overflow-hidden rounded-3xl">
                  <Image
                    src="/hero.png"
                    alt="Professional service provider"
                    fill
                    className="object-cover object-center"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
