import {findAllRolesForOptionsRepo} from "../data-access/role.repo";


export const findAllRolesForOptionsService = async () => {
    try {
        return await findAllRolesForOptionsRepo();
    } catch (e) {
        throw e;
    }
};
