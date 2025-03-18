import { Request, Response } from 'express';
export default class ValidationController {
    private static getData;
    private static handleValidationResult;
    static validateFields(req: Request, res: Response): void;
    static validatePassport(req: Request, res: Response): void;
    static validateCPF(req: Request, res: Response): void;
    static validateRG(req: Request, res: Response): void;
    static validateSUS(req: Request, res: Response): void;
    static validateCNH(req: Request, res: Response): void;
    static validateCTPS(req: Request, res: Response): void;
    static validateCRM(req: Request, res: Response): void;
    static validateOAB(req: Request, res: Response): void;
    static validateCREA(req: Request, res: Response): void;
    static validatePIS(req: Request, res: Response): void;
    static validateCNPJ(req: Request, res: Response): void;
    static validateUSDriversLicense(req: Request, res: Response): void;
    static validateUSSSN(req: Request, res: Response): void;
    static validateUSMilitaryID(req: Request, res: Response): void;
    static validateUKNINumber(req: Request, res: Response): void;
    static validateCanadianSIN(req: Request, res: Response): void;
    static validateMexicanCURP(req: Request, res: Response): void;
    static validateSouthKoreanRRN(req: Request, res: Response): void;
    static validateGermanPersonalausweis(req: Request, res: Response): void;
}
