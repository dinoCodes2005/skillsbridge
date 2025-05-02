"use client";

import MapDialog from "@/components/ui/my-components/map-dialog";
import { MapProvider } from "@/components/ui/providers/mapProvider";
import ProblemProvider, {
  useProblem,
} from "@/components/ui/providers/problemProvider";
import { RealtimeMapComponent } from "@/components/ui/my-components/realtime-map";
import { Navbar } from "@/components/ui/Navbar";
import { useParams } from "next/navigation";
import React from "react";

export default function page() {
  return (
    <>
      <Navbar />
      <main>
        <MapProvider>
          <div>
            <ProblemProvider>
              <RealtimeMapComponent />
            </ProblemProvider>
          </div>
        </MapProvider>
      </main>
    </>
  );
}
