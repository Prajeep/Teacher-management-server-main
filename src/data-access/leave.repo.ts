import { LeaveModel } from "../models/leave.model";

export const createLeaveRepo = (data: any) => {
    return new LeaveModel(data).save();
};

export const getPagedLeaveRepo = async (data: any) => {
  const { pageIndex, pageSize, sortField, sortOrder, filters } = data;

  let filterFields = {};
  let archiveFilter = { archived: false };
  let statusFilter = {};
  let categoryFilter = {};

  if (filters?.searchTerm) {
    filterFields = {
      text: {
        $regex: filters.searchTerm,
        $options: "i",
      },
    };
  }

  if (filters?.status) {
    statusFilter = {
      status: filters.status,
    };
  }

  if (filters?.category) {
    categoryFilter = {
      category: filters.category,
    };
  }

  return LeaveModel.aggregate([
    {
      $match: {
        ...archiveFilter,
      },
    },
    {
      $project: {
        _id: 1,
        teacherName: 1,
        category: 1,
        designation: 1,
        type: 1,
        fromDate: 1,
        toDate: 1,
        leaveDays: 1,
        reason: 1,
        reliefAssignee: 1,
        status: 1,
        createdBy: 1,
        createdAt: 1,
        updatedAt: 1,
        text: {
          $concat: [
            { $ifNull: ["$teacherName", ""] },
            " ",
            { $ifNull: ["$category", ""] },
            " ",
            { $ifNull: ["$type", ""] },
            " ",
            { $ifNull: ["$reason", ""] },
            " ",
            { $ifNull: ["$reliefAssignee", ""] },
          ],
        },
      },
    },
    {
      $match: {
        ...filterFields,
        ...statusFilter,
        ...categoryFilter,
      },
    },
    {
      $project: {
        text: 0,
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
