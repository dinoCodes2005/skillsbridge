import { Schema, model, Document } from "mongoose";
import { iProfile } from "./profileModel";

type Profession = [
  | "electrician"
  | "plumber"
  | "carpenter"
  | "mechanic"
  | "mobile_engineer"
  | "laptop_engineer"
  | "designer"
  | "painter"
];

type WorkingTime = {
  start: string;
  end: string;
};

type Location = {
  lat: number;
  lon: number;
};

export interface iWorker extends Document {
  profession: Profession;
  address: string;
  location: Location;
  about: string;
  isAvailable: boolean;
  working_time: WorkingTime;
  experience: number;
}

const WorkerProfileSchema = new Schema<iWorker>({
  profession: {
    type: [String],
    required: true,
    enum: [
      "electrician",
      "plumber",
      "carpenter",
      "mechanic",
      "mobile_engineer",
      "laptop_engineer",
      "designer",
      "painter",
    ],
  },
  address: {
    type: String,
    required: true,
  },
  location: {
    type: {
      lat: { type: Number },
      lon: { type: Number },
    },
    required: false,
  },
  about: {
    type: String,
    required: false,
  },
  isAvailable: {
    type: Boolean,
    default: true,
  },
  working_time: {
    type: {
      start: { type: String },
      end: { type: String },
    },
    required: false,
  },
  experience: {
    type: Number,
    required: false,
  },
});

export const Profile = model<iWorker>("Worker_Profile", WorkerProfileSchema);
