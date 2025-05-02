"use client";
import React, { useState, useTransition } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { MapPin } from "lucide-react";
import { Button } from "../button";
import { MapProvider } from "../providers/mapProvider";
import { MapComponent } from "./map";
import { useProfile } from "../providers/profileProvider";
import axios from "axios";

export default function MapDialog() {
  const { profile, location, setLocation, currentAddress, setCurrentAddress } =
    useProfile();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const saveLocation = async () => {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json`,
      {
        params: {
          latlng: `${location.coordinates[1]},${location.coordinates[0]}`,
          key: process.env.NEXT_PUBLIC_GOOGLE_MAP_API,
        },
      }
    );
    if (
      response.data.status === "OK" &&
      response.data.results &&
      response.data.results.length > 0
    )
      startTransition(() => {
        setCurrentAddress(response.data.results[0].formatted_address);
        setOpen(false);
      });
  };

  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button type="button" size="icon">
            <MapPin className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="mb-4">Select Your Location</DialogTitle>
            <MapProvider>
              <div>
                <MapComponent />
              </div>
            </MapProvider>
            <Button onClick={saveLocation} className="w-[100px] mt-4">
              Save Location
            </Button>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}
