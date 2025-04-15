import { log } from "../util/logger";
import { createLeaveService, getPagedLeaveService } from "../services/leave.service";

export const createLeaveController = async (req: any, res: any) => {
    log.info("Creating leave request");

    try {
        if (!req.user || !req.user.userId) {
            return res.status(400).send("User not authenticated");
        }

        const data = await createLeaveService(req.body, req.user.userId);
        res.status(201).send(data);
        log.info("Leave request created successfully");
    } catch (e) {
        log.error(JSON.stringify(e));
        return res.status(400).send(e);
    }
};

export const getPagedLeaveController = async (req: any, res: any) => {
    log.info("Getting paged Leave");
    try {
        const data = await getPagedLeaveService(req.body);
        res.send(data);
        log.info("Getting paged Leave completed");
    } catch (e) {
        log.error(JSON.stringify(e));
        return res.status(400).send(e);
    }
};
