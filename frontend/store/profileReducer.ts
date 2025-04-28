import { Languages } from "lucide-react";
import React, { act } from "react";

export const DEFAULT_PROFILE = {
  phone: "",
  email: "",
  first_name: "",
  last_name: "",
  language: "",
  type: "",
};

export interface iProfile {
  phone: string;
  email: string;
  first_name: string;
  last_name: string;
  language: string;
  type: "consumer" | "worker" | "";
}

type Action = {
  type:
    | "CHANGE_INPUT"
    | "CHANGE_SELECT"
    | "CHANGE_PHONE"
    | "CHANGE_EMAIL"
    | "CHANGE_TYPE";
  payload: {
    name: string;
    value: string;
  };
};

export const profileReducer = (state: iProfile, action: Action) => {
  switch (action.type) {
    case "CHANGE_INPUT":
      return {
        ...state,
        [action.payload.name]: action.payload.value,
      };
    case "CHANGE_SELECT":
      return {
        ...state,
        [action.payload.name]: action.payload.value,
      };

    case "CHANGE_PHONE":
      return {
        ...state,
        [action.payload.name]: action.payload.value,
      };
    case "CHANGE_EMAIL":
      return {
        ...state,
        [action.payload.name]: action.payload.value,
      };
    case "CHANGE_TYPE":
      return {
        ...state,
        [action.payload.name]: action.payload.value,
      };
    default:
      return state;
  }
};
