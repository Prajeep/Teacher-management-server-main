import { Router } from "express";

import * as path from "path";
import { Shield } from "../middleware/auth/shield";
import {getAllRolesForOptionsController} from "../controllers/role.controller";

const publicKey = path.join(__dirname, "../../config/public.pem");
const shield = new Shield(publicKey);

export const roleRouter = Router();

roleRouter.get("/get", shield.auth(), getAllRolesForOptionsController);
