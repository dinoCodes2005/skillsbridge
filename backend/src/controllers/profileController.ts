import { Request, Response } from "express";
import { Profile } from "../models/profileModel";

export const createProfile = async (req: Request, res: Response) => {
  try {
    console.log(req.body);
    const { phone, email, first_name, last_name, language, type, gender } =
      req.body;
    if (
      (!phone && !email) ||
      !first_name ||
      !last_name ||
      !language ||
      !type ||
      !gender
    ) {
      res.status(400).json({ error: "Fill all the fields correctly !!!" });
      return;
    }

    const existingProfile = await Profile.findOne({
      $or: [{ phone: phone }, { email: email }],
    });
    if (existingProfile) {
      const updatedProfile = await Profile.findOneAndUpdate(
        { $or: [{ phone: phone }, { email: email }] },
        {
          first_name,
          last_name,
          language,
          type,
          gender,
        },
        {
          new: true,
        }
      );
      res.status(200).json({
        message: `Profile updated for  ${first_name}`,
        profile: updatedProfile,
      });
      return;
    }

    const newProfile = new Profile({
      phone: phone || "",
      email: email || "",
      first_name,
      last_name,
      language,
      type,
      gender,
    });

    const savedProfile = await newProfile.save();
    res.status(201).json({
      message: "Profile Created Successfully !! Redirecting to Profile Page .",
      profile: savedProfile,
    });
    return;
  } catch (error) {
    console.error("Error creating Profile:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

export const findProfile = async (req: Request, res: Response) => {
  const { phone, email, fetchType } = req.body;
  const existingProfile = await Profile.findOne({
    $or: [{ phone: phone }, { email: email }],
  });
  if (existingProfile) {
    if (fetchType === "finding") {
      res.status(409).json({
        message: "Profile found !! Redirecting to Home Page.",
      });
      return;
    }
    if (fetchType === "fetching") {
      res.status(200).json({
        phone: existingProfile.phone,
        email: existingProfile.email,
        first_name: existingProfile.first_name,
        last_name: existingProfile.last_name,
        language: existingProfile.language,
        type: existingProfile.type,
        gender: existingProfile.gender,
      });
      return;
    }
  }
  res
    .status(400)
    .json({ message: "Profile not Found !! Redirecting to Profile Page." });
};
