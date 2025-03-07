import { Role } from "../models/role.model";

export const findAllRolesForOptionsRepo = () => {
    return Role.find().exec();
};
