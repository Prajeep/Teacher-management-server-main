import { Log } from "../models/log.model";
import { Types } from "mongoose";
import ObjectId = Types.ObjectId;

export const createLoggerRepo = (data: any): any => {
    return new Log(data).save();
};

export const findLogsWithUsernameRepo = (data: any): any => {
    const { pageIndex, pageSize, sortField, sortOrder, filters } = data;

    return Log.aggregate([
        {
            $lookup: {
                from: "users",
                localField: "user",
                foreignField: "_id",
                as: "user",
            },
        },
        {
            $unwind: {
                path: "$user",
                preserveNullAndEmptyArrays: true,
            },
        },
        {
            $lookup: {
                from: "roles",
                localField: "user.role",
                foreignField: "_id",
                as: "user.role",
            },
        },
        {
            $unwind: {
                path: "$user.role",
                preserveNullAndEmptyArrays: false,
            },
        },
        {
            $group: {
                _id: "$_id",
                message: {
                    $first: "$message",
                },
                type: {
                    $first: "$type",
                },
                userRefNo: {
                    $first: "$user.refNo",
                },
                user: {
                    $first: {
                        $concat: ["$user.firstname", " ", "$user.lastname"],
                    },
                },
                role: {
                    $first: "$user.role.name",
                },
                createdAt: {
                    $first: "$createdAt",
                },
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
                    { $limit: pageSize || 10 },
                ],
            },
        },
    ]);
};
