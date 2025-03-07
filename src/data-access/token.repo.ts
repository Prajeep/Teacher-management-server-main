import {RefreshToken} from "../models/user.token.model";


export const createUserRefreshTokenRepo = (data: any) => {
    return new RefreshToken(data).save();
};
export const findOneUserRefreshTokenRepo = (filters: any) => {
    return RefreshToken.findOne(filters).exec();
};
export const findOneAndDeleteUserRefreshTokenRepo = (filters: any) => {
    return RefreshToken.findOneAndDelete(filters).exec();
};
