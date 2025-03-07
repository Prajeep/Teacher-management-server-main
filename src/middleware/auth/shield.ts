import * as fs from "fs";
import jwt from "jsonwebtoken";
import { log } from "../../util/logger";
import {findOneUserRepo} from "../../data-access/admin.repo";


class Shield {
    public publicKey: any;
    constructor(publicKey: any) {
        this.publicKey = publicKey;
    }

    public authorize(req: any, res: any, next: any, permissions: any) {
        if (permissions.some((e: any) => req.user.permissions.indexOf(e) > -1)) {
            next();
        } else {
            log.error("Authorization Failed");
            return res
                .status(403)
                .send({ code: 1004, message: "Authorization Failed" });
        }
    }

    public verifyJWT(
        req: any,
        res: any,
        next: any,
        publicKey: any,
        permissions: any,
        token: any,
        role?: any,
        userType?: any
    ) {
        const key: string = fs.readFileSync(publicKey, "utf8");

        const decodeOptions: any = {
            algorithms: ["RS256"],
        };

        jwt.verify(token, key, decodeOptions, async (error, data: any) => {
            if (error) {
                log.error("Authentication Failed || JWT Expired");
                return res.status(403).send({
                    code: 1003,
                    message: "Authentication Failed || JWT Expired",
                });
            } else {
                req.user = data;
                const user = await findOneUserRepo({ _id: data.userId });
                if (!user) {
                    log.error("Authentication Failed - User Deleted");
                    return res.status(403).send({
                        code: 403,
                        message: "Authentication Failed - User Deleted",
                    });
                }
                if (role && req.user.roleName !== role) {
                    log.error("Authentication Failed - Route Not Permitted");
                    return res.status(403).send({
                        code: 403,
                        message: "Authentication Failed - Route Not Permitted",
                    });
                }
                if (userType && userType !== req.user.userType) {
                    log.error("Authentication Failed - Route Not Permitted");
                    return res.status(403).send({
                        code: 403,
                        message: "Authentication Failed - Route Not Permitted",
                    });
                }
                log.info("Jwt verified");
                // log.info(data);
                if (permissions) {
                    this.authorize(req, res, next, permissions);
                } else {
                    next();
                }
            }
        });
    }

    public extractBearerToken(
        req: any,
        res: any,
        next: any,
        publicKey: any,
        permissions: any,
        authHeader: any,
        role?: any,
        userType?: any
    ) {
        const headerAr = authHeader.split(" ");

        if (headerAr[0] !== "Bearer") {
            log.error("Prefix Bearer is not found in authorization header");
            return res.status(401).send({
                code: 401,
                message: 'Prefix "Bearer" is not found in authorization header',
            });
        }

        const token = headerAr[1];

        if (!token || token === "null" || token === " ") {
            log.error("Bearer Token not found");
            return res
                .status(401)
                .send({ code: 401, message: "Bearer Token not found" });
        }

        this.verifyJWT(
            req,
            res,
            next,
            publicKey,
            permissions,
            token,
            role,
            userType
        );
    }

    public auth(role?: any, userType?: any) {
        return (req: any, res: any, next: any) => {
            const authHeader = req.headers.authorization;

            if (typeof authHeader === "undefined") {
                log.error("Authorization header not set");
                res.status(401).send({
                    code: 401,
                    message: "Authorization header not set",
                });
            } else {
                this.extractBearerToken(
                    req,
                    res,
                    next,
                    this.publicKey,
                    null,
                    authHeader,
                    role,
                    userType
                );
            }
        };
    }

    public authWithPermission(permissions: any, role?: any) {
        return (req: any, res: any, next: any) => {
            const authHeader = req.headers.authorization;

            if (typeof authHeader === "undefined") {
                log.error("Authorization header not set");
                return res.status(401).send({
                    code: 401,
                    message: "Authorization header not set",
                });
            } else {
                this.extractBearerToken(
                    req,
                    res,
                    next,
                    this.publicKey,
                    permissions,
                    authHeader,
                    role
                );
            }
        };
    }
}

export { Shield };
