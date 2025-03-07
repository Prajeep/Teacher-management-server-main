const mime = require("mime-types");
export const getExtension = (type: any) => {
    const mimeType = mime.extension(type);
    return "." + mimeType;
};
