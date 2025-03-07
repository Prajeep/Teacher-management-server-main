import { Types } from "mongoose";
import {Department} from "../models/department.model";
const ObjectId = Types.ObjectId;

export const findOneDepartmentRepo = (filters: any) => {
    return Department.findOne(filters).exec();
};

export const findLatestDepartmentRepo = async (filters? : any) => {
    return Department.find(filters).sort({ createdAt: -1 }).limit(1).exec();
};
export const createDepartmentRepo = (data: any) => {
    return new Department(data).save();
};

export const findAllDepartmentRepo = (filter?: any) => {
    return Department.find(filter).exec();
};
export const findOneAndUpdateDepartmentRepo = async (filters: any, data: any) => {
    return Department.findOneAndUpdate(
        filters,
        { $set: { ...data } },
        { new: true }
    ).exec();
};

export const getPagedDepartmentsRepo = async (data: any) => {
    const { pageIndex, pageSize, sortField, sortOrder, filters } = data;
    let filterFieldsStatus = {};
    let filterFields = {};
    let archiveFilter = {archived: false,};

    if (filters?.searchTerm) {
        filterFields = {
            text: {
                $regex: filters.searchTerm,
                $options: "i",
            },
        };
    }

    if (filters?.status === true || filters?.status === false) {
        filterFieldsStatus = {
            active: filters.status,
        };
    }
    return Department.aggregate([
        {
            $match: {
                ...archiveFilter,
            },
        },
        {
            $project: {
                _id: 1,
                depName: 1,
                description: 1,
                active: 1,
                createdAt: 1,
                refNo: 1,
                text: {
                    $concat: [
                        { $ifNull: ["$refNo", ""] },
                        " ",
                        { $ifNull: ["$depName", ""] }
                    ],
                },
            },
        },
        {
            $match: {
                ...filterFields,
                ...filterFieldsStatus,
            },
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
