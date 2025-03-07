import bunyan from "bunyan";

export const log = bunyan.createLogger({
    name: "teacher-management-connect-backend",
});
