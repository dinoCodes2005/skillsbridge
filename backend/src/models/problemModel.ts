import { Schema, model, Document } from "mongoose";
import { iWorker } from "./workerProfileModel";
import { iConsumer } from "./consumerProfileModel";
import { Location } from "../server";
import { iProfile, Profile } from "./profileModel";

export interface iProblem extends Document {
  owner: iProfile;
  service: string;
  problem: string;
  currentAddress: string;
  location: Location;
  createdAt: Date;
}

const ProblemSchema = new Schema<iProblem>(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "Profile",
    },
    service: String,
    problem: String,
    currentAddress: String,
    location: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
        default: "Point",
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
      },
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export const Problem = model<iProblem>("Problem", ProblemSchema);
