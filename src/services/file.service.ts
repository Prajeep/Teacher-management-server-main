import {getExtension} from "../util/files";
import { v4 as uuidv4 } from "uuid";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import * as _ from "lodash";
import config from "config"


const credentials: any = {
    accessKeyId: config.get("aws-s3.accessKeyId"),
    secretAccessKey: config.get("aws-s3.secretAccessKey")
};

const s3: any = new S3Client({ region: config.get("aws-s3.region"), credentials });

export const uploadFileService = async (data: any) => {
    if (!data || Object.keys(data).length === 0) {
        throw { message: "No files were uploaded." };
    }
    const { file, files } = data;

    if (file) {
        return await upload(file);
    } else if (files) {
        const uploadedFilesList = [];
        if (_.isArray(files)) {
            for (const singleFile of files) {
                const data = await upload(singleFile);
                uploadedFilesList.push(data);
            }
        } else {
            const data = await upload(files);
            uploadedFilesList.push(data);
        }
        return uploadedFilesList;
    }
};

const upload = async (file: any) => {
    const extension = getExtension(file.mimetype);
    const fileName = `${uuidv4()}${extension}`;
    const params: any = {
        Body: file.data,
        Bucket: config.get("aws-s3.bucketName"),
        Key: `${config.get("aws-s3.folder")}/${fileName}`, // File name you want to save as in S3
        ContentType: file.mimetype,
        ACL: "public-read",
    }
    const command: any = new PutObjectCommand(params);
    try {
        const data: any = await s3.send(command);
        return {
            uid: data.ETag,
            name: fileName,
            status: "done",
            url: `${config.get("aws-s3.baseUrl")}/${config.get("aws-s3.folder")}/${fileName}`,
        };
    } catch (e) {
        throw e;
    }
};
