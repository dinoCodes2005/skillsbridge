import { Schema, model, Document } from "mongoose";
import { iWorker } from "./workerProfileModel";
import { iConsumer } from "./consumerProfileModel";

export interface iProfile extends Document {
  phone: string;
  email: string;
  first_name: string;
  last_name: string;
  language: string;
  type: "consumer" | "worker" | "";
  gender: "male" | "female";
  worker: iWorker;
  consumer: iConsumer;
  location: Location;
}

const ProfileSchema = new Schema<iProfile>({
  phone: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: true,
  },
  first_name: {
    type: String,
    required: false,
  },
  last_name: {
    type: String,
    required: false,
  },
  language: {
    type: String,
    required: false,
  },
  type: {
    type: String,
    required: false,
  },
  gender: {
    type: String,
    required: false,
  },
  worker: {
    type: Schema.Types.ObjectId,
    ref: "Worker_Profile",
    required: false,
  },
  consumer: {
    type: Schema.Types.ObjectId,
    ref: "Consumer_Profile",
    required: false,
  },
});

export const Profile = model<iProfile>("Profile", ProfileSchema);
