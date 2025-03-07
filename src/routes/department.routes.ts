import { Router } from "express";
import * as path from "path";

import { Shield } from "../middleware/auth/shield";
import {
    createDepartmentController,
    findOneAndUpdateDepartmentController,
    findOneDepartmentByIdController, getAllActiveDepartmentController,
    getPagedDepartmentsController
} from "../controllers/department.controller";

const publicKey = path.join(__dirname, "../../config/public.pem");
const shield = new Shield(publicKey);

export const departRouter = Router();

departRouter.post("/create", shield.auth(), createDepartmentController);
departRouter.post("/get-paged", shield.auth(), getPagedDepartmentsController);
departRouter.put("/update", shield.auth(), findOneAndUpdateDepartmentController);
departRouter.get("/depart/:id", shield.auth(), findOneDepartmentByIdController);
departRouter.get("/active", shield.auth(), getAllActiveDepartmentController);
