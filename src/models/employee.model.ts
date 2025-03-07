import { Document, model, Schema } from "mongoose";
import {isEmail} from "validator";
import uniqueValidator from "mongoose-unique-validator";
import {IDepartment} from "./department.model";


export interface IEmployee extends Document {
    _id: string;
    refNo: string;
    firstname: string;
    lastname: string;
    jobTitle: string;
    nic: string;
    email: string;
    mobile: string;
    imageUrl: string;
    department: IDepartment
    active: boolean;
    archived: boolean;
    createdAt: any;
    updatedAt: any;
    __v: any;
}

export const EmployeeSchema = new Schema<IEmployee>(
    {
        refNo: {
            type: String,
            required: [true, "Reference number is required"],
        },
        firstname: {
            type: String,
            required: [true, "First name is required"],
        },
        lastname: {
            type: String,
            required: [true, "Last name is required"],
        },
        jobTitle: {
            type: String,
            required: [true, "Last name is required"],
        },
        mobile: {
            type: String,
        },
        nic: {
            type: String,
            required: [true, "NIC number is required"],
        },
        email: {
            type: String,
            validator: [isEmail, "Invalid Email"],
            lowercase: true,
        },
        imageUrl: {
            type: String,
        },
        department: {
            type: Schema.Types.ObjectId,
            ref: "departments",
            required: [true, "Department is required"],
        },
        active: {
            type: Boolean,
            default: true,
        },
        archived: {
            type: Boolean,
            default: false,
        },

    },
    {
        timestamps: true,
    }
);
EmployeeSchema.plugin(uniqueValidator, { message: "{PATH} must be unique" });


export const Employee = model<IEmployee>("Employee", EmployeeSchema);
