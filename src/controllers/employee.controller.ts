
import { log } from "../util/logger";
import {
    createEmployeeService,
    findOneAndUpdateEmployeeService, findOneEmployeeByIdService,
    getPagedEmployeeService,getPagedEmployeeTeachersService
} from "../services/employee.service";

export const createEmployeeController = async (req: any, res: any) => {
    log.info("Creating Teacher");
    try {
        const data = await createEmployeeService(req.body, req.user.userId);
        res.send(data);
        log.info("Creating Teacher completed");
    } catch (e) {
        log.error(JSON.stringify(e));
        return res.status(400).send(e);
    }
};

export const getPagedEmployeesController = async (req: any, res: any) => {
    log.info("Getting paged Teachers");
    try {
        const data = await getPagedEmployeeService(req.body);
        res.send(data);
        log.info("Getting paged Teachers completed");
    } catch (e) {
        log.error(JSON.stringify(e));
        return res.status(400).send(e);
    }
};
export const getPagedEmployeesTeachersController = async (req: any, res: any) => {
    log.info("Getting paged Teachers");
    try {
        const data = await getPagedEmployeeTeachersService(req.body);
        res.send(data);
        log.info("Getting paged Teachers completed");
    } catch (e) {
        log.error(JSON.stringify(e));
        return res.status(400).send(e);
    }
};

export const findOneAndUpdateEmployeeController = async (req: any, res: any) => {
    log.info("Updating Teachers");
    try {
        const result = await findOneAndUpdateEmployeeService(req.body, req.user.userId);
        res.send(result);
        log.info("Updating Teachers completed");
    } catch (e) {
        log.error(JSON.stringify(e));
        res.status(400).send(e);
    }
};
export const findOneEmployeeByIdController = async (req: any, res: any) => {
    log.info("Finding Teachers by id");
    try {
        const result = await findOneEmployeeByIdService(req.params.id);
        res.send(result);
        log.info("Finding Teachers by id completed");
    } catch (e) {
        log.error(JSON.stringify(e));
        res.status(400).send(e);
    }
};
