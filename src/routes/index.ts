import {getWelcomeMessage} from "../controllers";
import {fileRouter} from "./file.routes";
import {userAuthRouter} from "./user.auth.routes";
import {roleRouter} from "./role.routes";
import {departRouter} from "./department.routes";
import {employeeRouter} from "./employee.routes";
import {loggerRouter} from "./logger.routes";


export const routes = (app: any) => {
    app.get("/", getWelcomeMessage);
    app.use("/files", fileRouter);
    app.use("/user", userAuthRouter);
    app.use("/role", roleRouter);
    app.use("/department", departRouter);
    app.use("/employee", employeeRouter);
    app.use("/log", loggerRouter);
};
