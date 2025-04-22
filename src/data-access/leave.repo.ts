// import { LeaveModel } from "../models/leave.model";
// import { createLeaveRefNo } from "../util/refferenceNumbers";
// import { Types } from "mongoose";
// const ObjectId = Types.ObjectId;

// export const createLeaveRepo = async (data: any) => {
//   if (!data.refNo) {
//     data.refNo = await createLeaveRefNo();
//   }

//   return new LeaveModel(data).save();
// };

// // export const findOneAndUpdateLeaveRepo = async (filters: any, data: any) => {
  
// //   if (filters._id && typeof filters._id === 'string') {
// //     filters._id = new Types.ObjectId(filters._id); 
// //   }

// //   return LeaveModel.findOneAndUpdate(
// //     filters,
// //     { $set: { status: data.status } }, 
// //     { new: true } 
// //   ).exec();
// // };
// export const findOneAndUpdateLeaveRepo = async (id: string, status: string) => {
//   try {
//       if (typeof id === 'string') {
//           id = new Types.ObjectId(id); // Convert id to ObjectId if it is a string
//       }

//       // Update only the status field, ensure filters and data are correct
//       return await LeaveModel.findOneAndUpdate(
//           { _id: id }, // Filter by _id
//           { $set: { status } }, // Update only the status field
//           { new: true } // Return the updated document
//       ).exec();
//   } catch (e) {
//       throw e;
//   }
// };


// export const getPagedLeaveRepo = async (data: any) => {
//   const { pageIndex, pageSize, sortField, sortOrder, filters } = data;

//   let filterFields = {};
//   let archiveFilter = { archived: false };
//   let statusFilter = {};
//   let categoryFilter = {};

//   if (filters?.searchTerm) {
//     filterFields = {
//       text: {
//         $regex: filters.searchTerm,
//         $options: "i",
//       },
//     };
//   }

//   if (filters?.status) {
//     statusFilter = {
//       status: filters.status,
//     };
//   }

//   if (filters?.category) {
//     categoryFilter = {
//       category: filters.category,
//     };
//   }

//   return LeaveModel.aggregate([
//     {
//       $match: {
//         ...archiveFilter,
//       },
//     },
//     {
//       $project: {
//         _id: 1,
//         refNo: 1,
//         teacherName: 1,
//         category: 1,
//         designation: 1,
//         type: 1,
//         fromDate: 1,
//         toDate: 1,
//         leaveDays: 1,
//         reason: 1,
//         reliefAssignee: 1,
//         status: 1,
//         createdBy: 1,
//         createdAt: 1,
//         updatedAt: 1,
//         text: {
//           $concat: [
//             { $ifNull: ["$refNo", ""] },
//             " ",
//             { $ifNull: ["$teacherName", ""] },
//             " ",
//             { $ifNull: ["$category", ""] },
//             " ",
//             { $ifNull: ["$type", ""] },
//             " ",
//             { $ifNull: ["$reason", ""] },
//             " ",
//             { $ifNull: ["$reliefAssignee", ""] },
//           ],
//         },
//       },
//     },
//     {
//       $match: {
//         ...filterFields,
//         ...statusFilter,
//         ...categoryFilter,
//       },
//     },
//     {
//       $project: {
//         text: 0,
//       },
//     },
//     {
//       $facet: {
//         metadata: [
//           { $count: "total" },
//           { $addFields: { page: pageIndex } },
//         ],
//         data: [
//           {
//             $sort: {
//               [sortField || "createdAt"]: sortOrder || -1,
//             },
//           },
//           { $skip: pageSize * (pageIndex - 1) || 0 },
//           { $limit: pageSize },
//         ],
//       },
//     },
//   ]).exec();
// };

import { LeaveModel } from "../models/leave.model";
import { createLeaveRefNo } from "../util/refferenceNumbers";
import { Types } from "mongoose";
const ObjectId = Types.ObjectId;

export const createLeaveRepo = async (data: any) => {
 
  if (!data.refNo) {
    data.refNo = await createLeaveRefNo();
  }

 
  if (data.createdBy && typeof data.createdBy === 'string') {
    data.createdBy = new ObjectId(data.createdBy);
  }

  return new LeaveModel(data).save();
};


export const findOneAndUpdateLeaveRepo = async (id: string | Types.ObjectId, status: string) => {
  try {
     
      if (typeof id === 'string') {
          id = new ObjectId(id); 
      }

    
      return await LeaveModel.findOneAndUpdate(
          { _id: id }, 
          { $set: { status } }, 
          { new: true }
      ).exec();
  } catch (e) {
      throw e;
  }
};


// Updated function to handle paginated leave data
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
        refNo: 1,
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
            { $ifNull: ["$refNo", ""] },
            " ",
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
