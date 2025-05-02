import { iProblem, iProfile, Location } from "./modelTypes";

export type ProfileContextType = {
  profile: iProfile | null;
  location: Location;
  setLocation: React.Dispatch<React.SetStateAction<Location>>;
  currentAddress: string;
  setCurrentAddress: React.Dispatch<React.SetStateAction<string>>;
};

export type ProblemContextType = {
  problem: iProblem[] | null;
};
