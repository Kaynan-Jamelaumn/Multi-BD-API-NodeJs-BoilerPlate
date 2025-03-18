import { Request, Response } from "express";
declare class AddressController {
    create: (req: Request, res: Response) => Promise<any>;
    getByUserId: (req: Request, res: Response) => Promise<any>;
    getUserAddresses: (req: Request, res: Response) => Promise<any>;
    getAddressById: (req: Request, res: Response) => Promise<any>;
    setPrimaryAddress: (req: Request, res: Response) => Promise<any>;
    getPrimaryAddress: (req: Request, res: Response) => Promise<any>;
    update: (req: Request, res: Response) => Promise<any>;
    delete: (req: Request, res: Response) => Promise<any>;
}
declare const _default: AddressController;
export default _default;
