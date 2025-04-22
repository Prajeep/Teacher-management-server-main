import { getWelcomeMessage } from '../controllers';
import { fileRouter } from './file.routes';
import { userAuthRouter } from './user.auth.routes';
import { roleRouter } from './role.routes';
import { departRouter } from './department.routes';
import { employeeRouter } from './employee.routes';
import { loggerRouter } from './logger.routes';
import { leaveRouter } from './leave.routes';
import dashboardRouter from './dashboard.routes';



export const routes = (app: any) => {
    app.get("/", getWelcomeMessage);
    app.use("/files", fileRouter);
    app.use("/user", userAuthRouter);
    app.use("/role", roleRouter);
    app.use("/department", departRouter);
    app.use("/employee", employeeRouter);
    app.use("/leave", leaveRouter);
    app.use("/log", loggerRouter);
    app.use("/dashboard", dashboardRouter);
};
