
import {createDepartmentRefNo} from "../util/refferenceNumbers";
import {
    createDepartmentRepo,
    findAllDepartmentRepo, findOneAndUpdateDepartmentRepo,
    findOneDepartmentRepo,
    getPagedDepartmentsRepo
} from "../data-access/department.repo";

export const createDepartmentService = async (data: any) => {
    try {
        const depCheck: any = await findOneDepartmentRepo({ depName: data.depName });
        if (depCheck) {
            throw { message: "Department name is already existing!", depCheck: true };
        } else {
            data.refNo = await createDepartmentRefNo();
            const depart: any = await createDepartmentRepo(data);
            return depart;
        }
    } catch (e) {
        throw e;
    }
};

export const findAllActiveDepartmentService = async () => {
    try {
        return await findAllDepartmentRepo({active: true, archived: false});
    } catch (e) {
        throw e;
    }
};

export const getPagedDepartmentService = async (data: any) => {
    try {
          return await getPagedDepartmentsRepo(data);
    } catch (e) {
        throw e;
    }
};
export const findOneAndUpdateDepartmentService = async (data: any) => {
    try {
        return await findOneAndUpdateDepartmentRepo( {_id: data.id}, data);
    } catch (e) {
        throw e;
    }
};

export const findOneDepartmentByIdService = async (id: any) => {
    try {
        const result: any = await findOneDepartmentRepo({ _id: id });
        return result;
    } catch (e) {
        throw e;
    }
};
