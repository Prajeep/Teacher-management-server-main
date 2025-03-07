import { Types } from "mongoose";
import {User} from "../models/user.model";
import {UserPWReset} from "../models/user.password.reset.model";
import {hashPassword, validatePassword} from "../util/hash";
const ObjectId = Types.ObjectId;


export const aggregateUserRepo = (filters: any) => {
    return User.aggregate([
        {
            $match: {
                ...filters,
            },
        },
    ]).exec();
};

export const findOneUserRepo = (filters: any) => {
    return User.findOne(filters).exec();
};

export const findLatestUserRepo = async (filters? : any) => {
    return User.find(filters).sort({ createdAt: -1 }).limit(1).exec();
};
export const createUserRepo = (data: any) => {
    return new User(data).save();
};

export const getLoggedUserRepo = async (id: any) => {
    return User.aggregate([
        {
            $match: {
                _id: new ObjectId(id),
            },
        },
        {
            $lookup: {
                from: "roles",
                localField: "role",
                foreignField: "_id",
                as: "role",
            },
        },
        {
            $unwind: {
                path: "$role",
                preserveNullAndEmptyArrays: true,
            },
        },
        {
            $project: {
                _id: 1,
                role: {
                  name: 1
                },
                refNo: 1,
                name: {
                    $concat: [
                        { $ifNull: ["$firstname", ""] },
                        " ",
                        { $ifNull: ["$lastname", ""] },
                    ],
                },
                email: 1,
                imageUrl: 1,
                active: 1,
                mobile: 1,
                createdAt: 1,
                updatedAt: 1,
            },
        },
    ]).exec();
};
export const findOneAndUpdateUserRepo = async (filters: any, data: any) => {
    if (data.password) {
        if (validatePassword(data.password)) {
            data.password = await hashPassword(data.password);
        } else {
            throw {
                pwdValid: false,
                message:
                    "Password must be at least 8 characters long, contain at least one lowercase letter, one uppercase letter, and one digit.",
            };
        }
    }
    return User.findOneAndUpdate(filters, { $set: { ...data } }, { new: true }).exec();
};

export const createUserPwReset = (data: any, session?: any) => {
    return new UserPWReset(data).save({ session });
};
export const findUserPwResetToken = (filters?: any) => {
    return UserPWReset.findOne(filters).exec();
};
export const findUserPwResetTokenAndDelete = (filters?: any) => {
    return UserPWReset.findOneAndDelete(filters).exec();
};
