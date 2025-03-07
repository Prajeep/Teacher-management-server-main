import { Router } from "express";
import * as path from "path";

import { Shield } from "../middleware/auth/shield";
import {
    createEmployeeController,
    findOneAndUpdateEmployeeController, findOneEmployeeByIdController,
    getPagedEmployeesController
} from "../controllers/employee.controller";

const publicKey = path.join(__dirname, "../../config/public.pem");
const shield = new Shield(publicKey);

export const employeeRouter = Router();

employeeRouter.post("/create", shield.auth(), createEmployeeController);
employeeRouter.post("/get-paged", shield.auth(), getPagedEmployeesController);
employeeRouter.put("/update", shield.auth(), findOneAndUpdateEmployeeController);
employeeRouter.get("/emp/:id", shield.auth(), findOneEmployeeByIdController);
