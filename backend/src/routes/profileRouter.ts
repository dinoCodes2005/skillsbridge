import { Router } from "express";
import { createProfile, findProfile } from "../controllers/profileController";
import multer from "multer";

const profileRouter = Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

profileRouter.post("/create-profile", upload.none(), createProfile);
profileRouter.post("/fetch-profile", findProfile);

export default profileRouter;
