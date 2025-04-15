import { ILeave } from "../models/leave.model"; 
import { createLeaveRepo , getPagedLeaveRepo} from "../data-access/leave.repo";

export const createLeaveService = async (data: ILeave, userId: string): Promise<ILeave> => {
    try {
        data.createdBy = userId;
        const leave = await createLeaveRepo(data); 
        return leave;
    } catch (e) {
        throw e;  
    }

};

export const getPagedLeaveService = async (data: any) => {
    try {
        return await getPagedLeaveRepo(data);
    } catch (e) {
        throw e;
    }
};
