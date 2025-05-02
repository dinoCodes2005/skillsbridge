import { Request, Response } from "express";
import { Problem } from "../models/problemModel";

export const fetchProblem = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const problemId = req.body.problemId;
    console.log("Problem Id of the current problem : ", problemId);
    const problems = await Problem.find({ _id: problemId });
    res.status(200).json({ problems });
    return;
  } catch (error) {
    console.error("Could not find any problems !!!", error);
    res.status(500).json({ message: "Internal Server Error" });
    return;
  }
};
