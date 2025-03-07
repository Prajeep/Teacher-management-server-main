
import { log } from "../util/logger";
import {
    createDepartmentService, findAllActiveDepartmentService,
    findOneAndUpdateDepartmentService, findOneDepartmentByIdService,
    getPagedDepartmentService
} from "../services/department.service";

export const createDepartmentController = async (req: any, res: any) => {
    log.info("Creating department");
    try {
        const data = await createDepartmentService(req.body);
        res.send(data);
        log.info("Creating department completed");
    } catch (e) {
        log.error(JSON.stringify(e));
        return res.status(400).send(e);
    }
};

export const getAllActiveDepartmentController = async (req: any, res: any) => {
    log.info("Finding active department");
    try {
        const data = await findAllActiveDepartmentService();
        res.send(data);
        log.info("Finding active department completed");
    } catch (e) {
        log.error(JSON.stringify(e));
        return res.status(403).send(e);
    }
};

export const getPagedDepartmentsController = async (req: any, res: any) => {
    log.info("Getting paged departments");
    try {
        const data = await getPagedDepartmentService(req.body);
        res.send(data);
        log.info("Getting paged departments completed");
    } catch (e) {
        log.error(JSON.stringify(e));
        return res.status(400).send(e);
    }
};

export const findOneAndUpdateDepartmentController = async (req: any, res: any) => {
    log.info("Updating departments");
    try {
        const result = await findOneAndUpdateDepartmentService(req.body);
        res.send(result);
        log.info("Updating departments completed");
    } catch (e) {
        log.error(JSON.stringify(e));
        res.status(400).send(e);
    }
};
export const findOneDepartmentByIdController = async (req: any, res: any) => {
    log.info("Finding department by id");
    try {
        const result = await findOneDepartmentByIdService(req.params.id);
        res.send(result);
        log.info("Finding department by id completed");
    } catch (e) {
        log.error(JSON.stringify(e));
        res.status(400).send(e);
    }
};
