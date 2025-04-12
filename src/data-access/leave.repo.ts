import { LeaveModel } from "../models/leave.model"; 

export const createLeaveRepo = (data: any) => {
    return new LeaveModel(data).save();
};
