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
import { io } from "socket.io-client";
import { useParams } from "next/navigation";
import { iProblem } from "../types/modelTypes";
import { ProblemContextType } from "../types/contextTypes";
import { fetchProblem } from "../api/fetchProblem";

const ProblemContext = createContext<ProblemContextType>({
  problem: null,
});

export default function ProblemProvider({ children }: { children: ReactNode }) {
  const { data: session } = useSession();
  const { user } = useAuth();
  const socket = io(process.env.NEXT_PUBLIC_BACKEND_WEBSOCKET_URL);
  const [problem, setProblem] = useState<iProblem[] | null>(null);
  const params = useParams();
  const problemId = params.problemId as string;

  useEffect(() => {
    const loadProblems = async () => {
      try {
        const problems = await fetchProblem(problemId);
        problems && setProblem(problems);
      } catch (error) {
        console.error("Error fetching problems:", error);
      }
    };

    loadProblems();

    socket.on("connect", () => {
      console.log("Frontend message : Connected to server with ID:", socket.id);
    });

    socket.on("problem", (data) => {
      console.log(data);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <ProblemContext.Provider value={{ problem }}>
      {children}
    </ProblemContext.Provider>
  );
}

export const useProblem = () => useContext(ProblemContext);
