import bcrypt from "bcrypt";
import { Document, model, Schema } from "mongoose";
import uniqueValidator from "mongoose-unique-validator";
import { isEmail } from "validator";
import { IRole } from "./role.model";

export interface IUser extends Document {
    _id: string;
    role: IRole;
    refNo: string;
    firstname: string;
    lastname: string;
    email: string;
    imageUrl: string;
    active: boolean;
    mobile: string;
    password: string;
    archived: boolean;
    createdAt: any;
    updatedAt: any;
    __v: any;
}

export const UserSchema = new Schema<IUser>(
    {
        firstname: {
            type: String,
            required: [true, "First name is required"],
        },
        lastname: {
            type: String,
            required: [true, "Last name is required"],
        },
        role: {
            type: Schema.Types.ObjectId,
            ref: "roles",
            required: [true, "Role is required"],
        },
        email: {
            type: String,
            unique: true,
            uniqueCaseInsensitive: true,
            required: [true, "Email is required"],
            validator: [isEmail, "Invalid Email"],
            lowercase: true,
        },
        password: {
            type: String,
            required: [true, "Password is required"],
        },
        imageUrl: {
            type: String,
        },
        mobile: {
            type: String,
            required: [true, "Mobile is required"],
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

UserSchema.pre("save", function (next) {
    const admin: IUser = this;
    if (!admin.isModified("password")) {
        return next();
    }
    bcrypt.genSalt(12, (err, salt) => {
        if (err) {
            return next(err);
        }
        bcrypt.hash(admin.password, salt, (err, hash) => {
            if (err) {
                return next(err);
            }
            admin.password = hash;
            next();
        });
    });
});

UserSchema.plugin(uniqueValidator, { message: "{PATH} must be unique" });

export const User = model<IUser>("User", UserSchema);
