import "dotenv/config";
import { Request, Response } from 'express';
import { File } from '../types/multer';
interface RequestWithFile extends Request {
    file?: File;
}
declare class UserController {
    private getProfilePicturePaths;
    private formatUserResponse;
    create: (req: RequestWithFile, res: Response) => Promise<any>;
    private fetchUsers;
    getUsers: (req: Request, res: Response) => Promise<any>;
    getInactiveUsers: (req: Request, res: Response) => Promise<any>;
    getActiveUsers: (req: Request, res: Response) => Promise<any>;
    self: (req: Request, res: Response) => Promise<any>;
    update: (req: RequestWithFile, res: Response) => Promise<any>;
    delete: (req: Request, res: Response) => Promise<any>;
    reactivate: (req: Request, res: Response) => Promise<any>;
    logout: (req: Request, res: Response) => Promise<any>;
    login: (req: Request, res: Response) => Promise<any>;
    searchUsers: (req: Request, res: Response) => Promise<any>;
    validateUser: (email: string, password: string) => Promise<any | null>;
    private failedValidationAndDeletePhoto;
    private checkFieldAvailability;
}
declare const _default: UserController;
export default _default;
