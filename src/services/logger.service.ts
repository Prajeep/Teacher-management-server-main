import {
    createLoggerRepo,
    findLogsWithUsernameRepo,
} from "../data-access/logger.repo";
import { ILog } from "../models/log.model";

export const createLoggerService = async (type: string, user: any, message: string) => {
    try {
        const log: ILog = await createLoggerRepo({
            type,
            user,
            message,
        });
        return log;
    } catch (e) {
        throw e;
    }
};

export const findLoggerService = async (data: any) => {
    try {
        const logs: ILog[] = await findLogsWithUsernameRepo(data);
        return logs;
    } catch (e) {
        throw e;
    }
};
