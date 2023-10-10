import {Request, Response, NextFunction} from "express";
import jwt, {JsonWebTokenError, TokenExpiredError} from "jsonwebtoken";

export function validateToken(req: Request, res: Response, next: NextFunction) {
    const headerToken = req.headers['authorization'];

    if (headerToken != undefined && headerToken.startsWith("Bearer ")) {
        const bearerToken = headerToken.split(" ")[1];

        try {
            const validToken = jwt.verify(bearerToken, process.env.SECRET_KEY || "ultra-secret-thomas-key");
            next();
        } catch (error) {
            if (error instanceof TokenExpiredError) {
                res.status(401).json({message: "Token expired"});
            } else if (error instanceof JsonWebTokenError) {
                res.status(401).json({message: "Invalid token"});
            } else {
                res.status(500).json({message: "Internal server error"});
            }
        }
    } else {
        res.status(401).json({message: "Unauthorized"});
    }
}
