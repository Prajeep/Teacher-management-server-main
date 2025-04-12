import { Document, model, Schema } from "mongoose";
import { isDate } from "validator";

// Leave Interface
export interface ILeave extends Document {
  _id: string;
  teacherName: string;
  category: string;
  type: string;
  fromDate: Date;
  toDate: Date;
  leaveDays: number;
  reason: string;
  reliefAssignee: string;
  status: string;
  archived: boolean;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

// Leave Schema
export const LeaveSchema = new Schema<ILeave>(
  {
    teacherName: {
      type: String,
      required: true,
    },
    category: {
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
    reliefAssignee: {
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

// Export the model
export const LeaveModel = model<ILeave>("Leave", LeaveSchema);
