import { Schema, model, Document } from "mongoose";

export interface iProfile extends Document {
  phone: string;
  email: string;
  first_name: string;
  last_name: string;
  language: string;
  type: "consumer" | "worker" | "";
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
});

export const Profile = model<iProfile>("Profile", ProfileSchema);
