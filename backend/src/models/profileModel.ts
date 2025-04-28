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
}

const ProfileSchema = new Schema<iProfile>({
  phone: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: false,
  },
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
  },
  language: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
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
