import { Request, Response, NextFunction } from 'express';
import "dotenv/config";
export declare function authMiddleware(req: Request, res: Response, next: NextFunction): void;
export declare function adminMiddleware(req: Request, res: Response, next: NextFunction): void;
