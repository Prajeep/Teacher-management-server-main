import {
    findAllRolesForOptionsService,
} from "../services/role.service";
import { log } from "../util/logger";


export const getAllRolesForOptionsController = async (req: any, res: any) => {
    log.info("Finding role");
    try {
        const data = await findAllRolesForOptionsService();
        res.send(data);
    } catch (e) {
        log.info("Finding role completed");
        return res.status(403).send(e);
    }
};
