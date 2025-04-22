import { ILeave } from "../models/leave.model"; 
import { createLeaveRepo , getPagedLeaveRepo, findOneAndUpdateLeaveRepo} from "../data-access/leave.repo";

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

// export const findOneAndUpdateLeaveService = async (data: any, userId: string) => {
//     try {
        
//         return await findOneAndUpdateLeaveRepo({ _id: data.id }, data);
//     } catch (e) {
//         throw e;
//     }
// };

export const findOneAndUpdateLeaveService = async (id: string, status: string) => {
    try {
        // Ensure proper validation before passing data to the repo
        if (!id || !status) {
            throw new Error("Invalid data passed to the service.");
        }

        return await findOneAndUpdateLeaveRepo(id, status);
    } catch (e) {
        throw e;
    }
};
