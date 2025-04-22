// import { Document, model, Schema, Types} from "mongoose";
// import { isDate } from "validator";

// // Leave Interface
// export interface ILeave extends Document {
//   _id: string;
//   refNo: string;
//   teacherName: string;
//   category: string;
//   designation:string;
//   type: string;
//   fromDate: Date;
//   toDate: Date;
//   leaveDays: number;
//   reason: string;
//   status: string;
//   archived: boolean;
//   createdBy: string;
//   createdAt: Date;
//   updatedAt: Date;
// }

// export const LeaveSchema = new Schema<ILeave>(
//   {
//     refNo: {
//       type: String,
//       required: [true, "Reference number is required"],
//     },
//     teacherName: {
//       type: String,
//       required: true,
//     },
//     category: {
//       type: String,
//       required: true,
//     },
//     designation: {
//       type: String,
//       required: true,
//     },
//     type: {
//       type: String,
//       required: true,
//     },
//     fromDate: {
//       type: Date,
//       required: true,
//       validate: [isDate, "Invalid date format for fromDate"],
//     },
//     toDate: {
//       type: Date,
//       required: true,
//       validate: [isDate, "Invalid date format for toDate"],
//     },
//     leaveDays: {
//       type: Number,
//       required: true,
//       min: [1, "Leave days must be at least 1"],
//     },
//     reason: {
//       type: String,
//       required: true,
//     },
//     status: {
//       type: String,
//       enum: ["Pending", "Approved", "Rejected"],
//       default: "Pending",
//     },
//     archived: {
//       type: Boolean,
//       default: false,
//     },
//     createdBy: {
//       type: String,
//       required: true,
//     },
//   },
//   {
//     timestamps: true,
//   }
// );


// // Export the model
// export const LeaveModel = model<ILeave>("Leave", LeaveSchema);

import { Document, model, Schema, Types } from "mongoose";
import { isDate } from "validator";

// Leave Interface
export interface ILeave extends Document {
  _id: Types.ObjectId;
  refNo: string;
  teacherName: string;
  category: string;
  designation: string;
  type: string;
  fromDate: Date;
  toDate: Date;
  leaveDays: number;
  reason: string;
  status: string;
  archived: boolean;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

// Leave Schema
export const LeaveSchema = new Schema<ILeave>(
  {
    refNo: {
      type: String,
      required: [true, "Reference number is required"],
    },
    teacherName: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    designation: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    fromDate: {
      type: Date,
      required: true,
      validate: [isDate, "Invalid date format for fromDate"],
    },
    toDate: {
      type: Date,
      required: true,
      validate: [isDate, "Invalid date format for toDate"],
    },
    leaveDays: {
      type: Number,
      required: true,
      min: [1, "Leave days must be at least 1"],
    },
    reason: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
    archived: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Export the Leave model
export const LeaveModel = model<ILeave>("Leave", LeaveSchema);

// Repository Functions for Leave

export const findOneLeaveRepo = (filters: any) => {
  return LeaveModel.findOne(filters).exec();
};

export const findLatestLeaveRepo = async (filters?: any) => {
  return LeaveModel.find(filters).sort({ createdAt: -1 }).limit(1).exec();
};

export const createLeaveRepo = (data: any) => {
  return new LeaveModel(data).save();
};

export const findOneAndUpdateLeaveRepo = async (filters: any, data: any) => {
  return LeaveModel.findOneAndUpdate(filters, { $set: { ...data } }, { new: true }).exec();
};

export const getPagedLeavesRepo = async (data: any) => {
  const { pageIndex, pageSize, sortField, sortOrder, filters } = data;
  let filterFieldsStatus = {};
  let filterFields = {};
  let archiveFilter = { archived: false };

  if (filters?.searchTerm) {
    filterFields = {
      text: {
        $regex: filters.searchTerm,
        $options: "i",
      },
    };
  }

  if (filters?.status) {
    filterFieldsStatus = {
      status: filters.status,
    };
  }

  return LeaveModel.aggregate([
    {
      $match: {
        ...archiveFilter,
      },
    },
    {
      $match: {
        ...filterFieldsStatus,
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
        status: 1,
        archived: 1,
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
            { $ifNull: ["$designation", ""] },
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
