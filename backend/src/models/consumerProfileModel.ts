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

type PaymentMethod = "cash" | "upi" | "credit_card" | "debit_card";

export interface iConsumer extends Document {
  address: string;
  preferred_services: Profession[];
  about: string;
  payment_method: PaymentMethod;
}

const ConsumerProfileSchema = new Schema<iConsumer>({
  address: {
    type: String,
    required: true,
  },

  preferred_services: {
    type: [String],
    required: false,
    default: [],
  },
  about: {
    type: String,
    required: false,
  },
  payment_method: {
    type: String,
    required: false,
    default: "cash",
    enum: ["cash", "upi", "credit_card", "debit_card"],
  },
});

export const Profile = model<iConsumer>(
  "Consumer_Profile",
  ConsumerProfileSchema
);
