export type Location = {
  type: "Point";
  coordinates: [number, number]; // [lng, lat]
};

export interface iProblem {
  owner: iProfile;
  service: string;
  problem: string;
  currentAddress: string;
  location: Location;
  createdAt: Date;
}

export interface iProfile {
  _id: string;
  phone: string;
  first_name: string;
  last_name: string;
  language: string;
  type: "consumer" | "worker" | "";
  gender: "male" | "female" | "";
}
