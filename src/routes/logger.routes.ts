import { Router } from "express";
import path from "path";
import { findLoggersController } from "../controllers/logger.controller";
import { Shield } from "../middleware/auth/shield";

const publicKey = path.join(__dirname, "../../config/public.pem");
const shield = new Shield(publicKey);

export const loggerRouter = Router();

loggerRouter.post("/get-paged", shield.auth(), findLoggersController);
