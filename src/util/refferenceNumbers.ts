import {findLatestUserRepo} from "../data-access/admin.repo";
import {findLatestDepartmentRepo} from "../data-access/department.repo";
import {Employee} from "../models/employee.model";
import {findLatestEmployeeRepo} from "../data-access/employee.repo";


export const createUserRefNo = async () => {
    let users: any[] = [];
    let userNo: any;
    users = await findLatestUserRepo()
    if (users.length > 0) {
        userNo = String(Number(users[0]?.refNo?.toString().slice(3)) + 1).padStart(4, "0");
    } else {
        userNo = String(1).padStart(4, "0");
    }
    return `EUI${userNo}`;
};
export const createDepartmentRefNo = async () => {
    let deps: any[] = [];
    let depNo: any;
    deps = await findLatestDepartmentRepo()
    if (deps.length > 0) {
        depNo = String(Number(deps[0]?.refNo?.toString().slice(3)) + 1).padStart(4, "0");
    } else {
        depNo = String(1).padStart(4, "0");
    }
    return `EDI${depNo}`;
};

export const createEmployeeRefNo = async () => {
    let emps: any[] = [];
    let empNo: any;
    emps = await findLatestEmployeeRepo()
    if (emps.length > 0) {
        empNo = String(Number(emps[0]?.refNo?.toString().slice(3)) + 1).padStart(4, "0");
    } else {
        empNo = String(1).padStart(4, "0");
    }
    return `EEI${empNo}`;
};
