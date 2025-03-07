import ejs from "ejs";
import fs from "fs";
import nodemailer from "nodemailer";
import path from "path";
import config from "config";


export const sendEmailService = async (type: any, data: any, to: any, subject: any, file?: any) => {
    try {
        const filePath = path.join(__dirname, `../html-templates/${type}`);
        const html = fs.readFileSync(filePath, "utf8");
        const parsed = ejs.render(html, data);
        const transporter = nodemailer.createTransport({
            service: "gmail",
            secure: false,
            requireTLS: true,
            auth: {
                user: config.get("email.user"),
                pass: config.get("email.password"),
            },
        });
        const attachments = [];
        if (file) {
            attachments.push({
                filename: file.fileName,
                content: file.stream,
            });
        }
        await transporter.sendMail({
            from: config.get("email.user"),
            to, // list of receivers
            subject, // Subject line
            html: parsed,
            attachments,
        });
    } catch (e) {
        throw e;
    }
};
