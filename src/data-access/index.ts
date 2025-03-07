import * as mongoose from "mongoose";
import config from "config";
import { log } from "../util/logger";

export const initDatabase = async () => {
    try {
        await mongoose.connect(config.get("db.path"), {});
        log.info("MongoDB Atlas connected");
    } catch (e) {
        log.error(`Database connection failed - ${JSON.stringify(e)}`);
    }
};
