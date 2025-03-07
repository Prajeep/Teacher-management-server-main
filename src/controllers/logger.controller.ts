import { findLoggerService } from "../services/logger.service";
import {log} from "../util/logger";

export const findLoggersController = async (req: any, res: any) => {
    log.info("Finding logs");
    try {
        const data = await findLoggerService(req.body);
        res.send(data);
        log.info("Finding logs completed")
    } catch (e) {
        return res.status(400).send(e);
    }
};
