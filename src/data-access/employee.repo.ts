import { Types } from "mongoose";
import {Employee} from "../models/employee.model";
const ObjectId = Types.ObjectId;

export const findOneEmployeeRepo = (filters: any) => {
    return Employee.findOne(filters).exec();
};

export const findLatestEmployeeRepo = async (filters? : any) => {
    return Employee.find(filters).sort({ createdAt: -1 }).limit(1).exec();
};
export const createEmployeeRepo = (data: any) => {
    return new Employee(data).save();
};

export const findOneAndUpdateEmployeeRepo = async (filters: any, data: any) => {
    return Employee.findOneAndUpdate(
        filters,
        { $set: { ...data } },
        { new: true }
    ).exec();
};

export const getPagedEmployeesRepo = async (data: any) => {
    const { pageIndex, pageSize, sortField, sortOrder, filters } = data;
    let filterFieldsStatus = {};
    let filterFields = {};
    let filterDepart = {};
    let archiveFilter = {archived: false,};

    if (filters?.searchTerm) {
        filterFields = {
            text: {
                $regex: filters.searchTerm,
                $options: "i",
            },
        };
    }
    if (filters?.depart) {
        filterDepart = {
            "department._id": new ObjectId(filters.depart),
        };
    }

    if (filters?.status === true || filters?.status === false) {
        filterFieldsStatus = {
            active: filters.status,
        };
    }
    return Employee.aggregate([
        {
            $match: {
                ...archiveFilter,
            },
        },
        {
            $lookup: {
                from: "departments",
                localField: "department",
                foreignField: "_id",
                as: "department",
            },
        },
        {
            $unwind: {
                path: "$department",
                preserveNullAndEmptyArrays: true,
            },
        },
        {
            $match: {
                ...filterFieldsStatus,
                ...filterDepart
            },
        },
        {
            $project: {
                _id: 1,
                firstname: 1,
                lastname: 1,
                jobTitle: 1,
                nic: 1,
                email: 1,
                mobile: 1,
                department: {
                    depName: 1
                },
                imageUrl: 1,
                active: 1,
                createdAt: 1,
                refNo: 1,
                text: {
                    $concat: [
                        { $ifNull: ["$refNo", ""] },
                        " ",
                        { $ifNull: ["$firstname", ""] },
                        " ",
                        { $ifNull: ["$lastname", ""] },
                        " ",
                        { $ifNull: ["$email", ""] },
                        " ",
                        { $ifNull: ["$jobTitle", ""] },
                        " ",
                        { $ifNull: ["$department.depName", ""] }
                    ],
                },
            },
        },
        {
            $match: {
                ...filterFields,
            },
        },
        {
            $project: {
                text: 0
            }
        },
        {
            $facet: {
                metadata: [
                    { $count: "total" },
                    { $addFields: { page: pageIndex } },
                ],
                data: [
                    {
                        $sort: {
                            [sortField || "createdAt"]: sortOrder || -1,
                        },
                    },
                    { $skip: pageSize * (pageIndex - 1) || 0 },
                    { $limit: pageSize },
                ],
            },
        },
    ]).exec();
};
