import { Router } from "express";
import * as path from "path";
import { Shield } from "../middleware/auth/shield";
import {
    createLeaveController,
} from "../controllers/leave.controller";

const publicKey = path.join(__dirname, "../../config/public.pem");
const shield = new Shield(publicKey);

export const leaveRouter = Router();

leaveRouter.post("/create", shield.auth(), createLeaveController);
