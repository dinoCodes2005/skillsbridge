import { Router } from "express";
import { createProfile, findProfile } from "../controllers/profileController";
import multer from "multer";
import { fetchProblem } from "../controllers/problemController";

const problemRouter = Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// problemRouter.post("/create-problem", upload.none(), createProblem);
problemRouter.post("/fetch-problem", upload.none(), fetchProblem);

export default problemRouter;
