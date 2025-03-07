import {Types} from "mongoose";
import {SETTINGS} from "../constants/commons.settings";
import config from "config";
import * as path from "node:path";
import * as fs from "node:fs";
import jwt, {Jwt} from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import {
    createUserRefreshTokenRepo,
    findOneAndDeleteUserRefreshTokenRepo,
    findOneUserRefreshTokenRepo
} from "../data-access/token.repo";
import {log} from "../util/logger";
import {aggregateUserRepo} from "../data-access/admin.repo";

const ObjectId = Types.ObjectId;

export const generateJWT = async (user: any, isRefresh: any, userType: any) => {
    try {
        let payload: any = null;

        switch (userType) {
            case SETTINGS.USERS.ADMIN:
                payload = {
                    userId: user._id,
                    role: user.role,
                    firstname: user.firstname,
                    lastname: user.lastname,
                    email: user.email,
                    permissions:
                        user.role?.permissions?.map((p: any) => p.code) || [],
                };
                delete payload.role.permissions;
                break;
        }

        const signOptions: any = {
            issuer: config.get("auth.accessToken.issuer"),
            expiresIn: config.get("auth.accessToken.expiresIn"),
            algorithm: "RS256",
        };

        const filePath = path.join(__dirname, "../../config/private.pem");
        const privateKey: string = fs.readFileSync(filePath, "utf8");

        const token = await jwt.sign(payload, privateKey, signOptions);
        if (!isRefresh) {
            const rtPayload = {
                refreshToken: uuidv4(),
            };

            const rtSignOptions: any = {
                issuer: config.get("auth.refreshToken.issuer"),
                expiresIn: config.get("auth.refreshToken.expiresIn"),
            };

            await createUserRefreshTokenRepo({
                user: user._id,
                refreshToken: rtPayload.refreshToken,
            });

            const generatedRToken = await jwt.sign(
                rtPayload,
                config.get("auth.refreshToken.secret"),
                rtSignOptions
            );

            log.info("Token generated & Login successful");

            return {
                access_token: token,
                refresh_token: generatedRToken,
                user: payload,
            };
        } else {
            log.info("Token refreshed!");
            return {
                access_token: token,
            };
        }
    } catch (error) {
        log.error("Token not generated");
        throw error;
    }
};

export const validateRefreshTokenReq = async (isRefresh: boolean, token: any, userType: string) => {
    if (!token) {
        log.error("Token not found");
        throw { message: "Token not found" };
    }
    try {
        const data: any = await jwt.verify(
            token,
            config.get("auth.refreshToken.secret")
        );
        const refreshTokenData: any = await findOneUserRefreshTokenRepo({
            refreshToken: data.refreshToken,
        });
        if (!refreshTokenData) {
            throw {
                message:
                    "Refresh token not found in system. Unable to issue access token",
            };
        }
        switch (userType) {
            case SETTINGS.USERS.ADMIN:
                const user = (
                    await aggregateUserRepo({
                        _id: new ObjectId(refreshTokenData.user),
                    })
                )[0];
                return await generateJWT(user, isRefresh, SETTINGS.USERS.ADMIN);
        }
    } catch (error: any) {
        const decoded: any = jwt.decode(token, { complete: true });
        if (error.message === config.get("auth.refreshToken.errorMessage")) {
            await findOneAndDeleteUserRefreshTokenRepo({
                refreshToken: decoded.payload.refreshToken,
            });
            log.error("Expired refresh token");
            throw { message: "Expired refresh token" };
        } else {
            log.error("Invalid refresh token");
            throw { message: "Invalid refresh token" };
        }
    }
};
