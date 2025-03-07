import { Router } from "express";
import { uploadFile } from "../controllers/file.controller";

export const fileRouter = Router();

fileRouter.post("/upload", uploadFile);
