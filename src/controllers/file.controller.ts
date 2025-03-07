import { uploadFileService } from "../services/file.service";
import { log } from "../util/logger";

export const uploadFile = async (req: any, res: any) => {
    log.info("File uploading start");
    try {
        const fileData = await uploadFileService(req.files);
        log.info("File uploading start completed");
        res.send(fileData);
    } catch (e) {
        log.error(e);
        res.status(400).send(e);
    }
};
