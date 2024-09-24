import { Injectable, NestMiddleware, UnauthorizedException } from "@nestjs/common";
import { isArray } from "class-validator";
import { NextFunction, Request, Response } from "express";
import { verify, JwtPayload as BaseJwtPayload } from "jsonwebtoken";
import { UserEntity } from "src/user/entities/user.entity";
import { UserService } from "src/user/user.service";

// Extending the Express Request interface to include the currentuser property
declare global {
    namespace Express {
        interface Request {
            currentuser?: UserEntity;
        }
    }
}
// Define a custom JwtPayload interface extending the base JwtPayload from jsonwebtoken
interface JwtPayload {
    id: string;
}

@Injectable()
export class currentUserMiddleware implements NestMiddleware {
    constructor(private readonly userservice: UserService) {}

    async use(req: Request, res: Response, next: NextFunction) {
        try {
            const authHeaders = req.headers.authorization || req.headers.Authorization;

            if (!authHeaders || isArray(authHeaders) || !authHeaders.startsWith('Bearer ')) {
                req.currentuser = null;
                return next(); 
            }

            const token = authHeaders.split(' ')[1];
            console.log("Token:", token);
            console.log("Secret Key:", process.env.ACCESS_TOKEN_SECRET_KEY);

            // Verify the token and extract the payload
            const { id } = verify(token, "ksdnkj0932kjsdnkmsdnm,nksdl") as JwtPayload;

            // Find the current user by the ID in the token
            const currentuser = await this.userservice.findOne(+id);
            if (!currentuser) {
                req.currentuser = null;
                return next();
            }

            req.currentuser = currentuser;
            console.log("Current User:", currentuser);

            next();
        } catch (error) {
            console.error("JWT Verification Error:", error.message);

            if (error.name === 'JsonWebTokenError') {
                throw new UnauthorizedException('Invalid token');
            } else if (error.name === 'TokenExpiredError') {
                throw new UnauthorizedException('Token has expired');
            } else {
                next(error);
            }
        }
    }
}
