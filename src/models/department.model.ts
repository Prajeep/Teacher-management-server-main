import { Document, model, Schema } from "mongoose";


export interface IDepartment extends Document {
    _id: string;
    refNo: string;
    depName: string;
    description: string;
    active: boolean;
    archived: boolean;
    createdAt: any;
    updatedAt: any;
    __v: any;
}

export const DepartmentSchema = new Schema<IDepartment>(
    {
        depName: {
            type: String,
            required: [true, "Department name is required"],
            unique: true
        },
        description: {
            type: String,
        },
        active: {
            type: Boolean,
            default: true,
        },
        archived: {
            type: Boolean,
            default: false,
        },
        refNo: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

export const Department = model<IDepartment>("Department", DepartmentSchema);
