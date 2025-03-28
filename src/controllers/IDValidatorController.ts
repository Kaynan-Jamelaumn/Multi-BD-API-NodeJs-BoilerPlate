// src/controllers/ValidationController.ts
import {Request, Response} from 'express';
import IDValidator from '../utils/IDValidator';
import { UserDataToBeValidated, Role, User } from '../types/user';



export default class ValidationController {
    private static getData(req: Request, field: string): string | undefined {
        return (req.body?.[field] ?? req.params?.[field]);
    }

    private static handleValidationResult(validationResult: any, res: Response): void {
        if (!validationResult.valid) {
            const statusCode = validationResult.status || 400;
            res.status(statusCode).json({
                error: validationResult.error
            });
        } else {
            res.status(200).json({
                message: 'Validation successful'
            });
        }
    }

    private static performValidation(
        req: Request,
        res: Response,
        fields: string[],
        errorMessage: string,
        validator: (...args: string[]) => any
    ): void {
        const values: string[] = [];
        for (const field of fields) {
            const value = this.getData(req, field);
            if (!value) {
                res.status(400).json({ error: errorMessage });
                return;
            }
            values.push(value);
        }
        const validationResult = validator(...values);
        this.handleValidationResult(validationResult, res);
    }  

    static validateFields(req: Request, res: Response): void {
        const userData: User = {
            username: this.getData(req, 'username'),
            name: this.getData(req, 'name'),
            surname: this.getData(req, 'surname'),
            email: this.getData(req, 'email'),
            password: this.getData(req, 'password'),
            role: this.getData(req, 'role') as Role,
        };

        const validationResult = IDValidator.validateFields(userData);
        this.handleValidationResult(validationResult, res);
    }
    static validatePassport = (req: Request, res: Response) => this.performValidation(
        req, res,
        ['passportNumber', 'countryCode'],
        'Passport number and country code are required.',
        IDValidator.validatePassport
    );

    static validateCPF = (req: Request, res: Response) => this.performValidation(
        req, res, ['cpfNumber'], 
        'CPF number is required.',
        IDValidator.validateCPF
    );

    static validateRG = (req: Request, res: Response) => this.performValidation(
        req, res, ['rgNumber'],
        'RG number is required.',
        IDValidator.validateRG
    );

    static validateSUS = (req: Request, res: Response) => this.performValidation(
        req, res, ['susNumber'],
        'SUS number is required.',
        IDValidator.validateSUS
    );

    static validateCNH = (req: Request, res: Response) => this.performValidation(
        req, res, ['cnhNumber'],
        'CNH number is required.',
        IDValidator.validateCNH
    );

    static validateCTPS = (req: Request, res: Response) => this.performValidation(
        req, res, ['ctpsNumber'],
        'CTPS number is required.',
        IDValidator.validateCTPS
    );

    static validateCRM(req: Request, res: Response): void {
        const crmNumber = this.getData(req, 'crmNumber');

        if (!crmNumber) {
            res.status(400).json({
                error: 'CRM number is required.'
            });
            return;
        }

        const validationResult = IDValidator.validateCRM(crmNumber);
        this.handleValidationResult(validationResult, res);
    }

    static validateOAB(req: Request, res: Response): void {
        const oabNumber = this.getData(req, 'oabNumber');

        if (!oabNumber) {
            res.status(400).json({
                error: 'OAB number is required.'
            });
            return;
        }

        const validationResult = IDValidator.validateOAB(oabNumber);
        this.handleValidationResult(validationResult, res);
    }

    static validateCREA(req: Request, res: Response): void {
        const creaNumber = this.getData(req, 'creaNumber');

        if (!creaNumber) {
            res.status(400).json({
                error: 'CREA number is required.'
            });
            return;
        }

        const validationResult = IDValidator.validateCREA(creaNumber);
        this.handleValidationResult(validationResult, res);
    }
    static validatePIS = (req: Request, res: Response) => this.performValidation(
        req, res, ['pis'],
        'PIS number is required.',
        IDValidator.validatePIS
    );

    static validateCNPJ = (req: Request, res: Response) => this.performValidation(
        req, res, ['cnpj'],
        'CNPJ number is required.',
        IDValidator.validateCNPJ
    );

    static validateUSDriversLicense = (req: Request, res: Response) => this.performValidation(
        req, res, ['licenseNumber'],
        'US Driver\'s License number is required.',
        IDValidator.validateUSDriversLicense
    );

    static validateUSSSN = (req: Request, res: Response) => this.performValidation(
        req, res, ['ssn'],
        'US SSN is required.',
        IDValidator.validateUSSSN
    );

    static validateUSMilitaryID = (req: Request, res: Response) => this.performValidation(
        req, res, ['militaryID'],
        'US Military ID is required.',
        IDValidator.validateUSMilitaryID
    );

    static validateUSGreenCard = (req: Request, res: Response) => this.performValidation(
        req, res, ['greenCardNumber'],
        'US Greencard Number is required.',
        IDValidator.validateUSGreenCard
    );
    static validateUSEAD = (req: Request, res: Response) => this.performValidation(
        req, res, ['eadNumber'],
        'EAD Number is required.',
        IDValidator.validateUSEAD
    );

    static validateUSBirthCertificate = (req: Request, res: Response) => this.performValidation(
        req, res, ['birthCertNumber'],
        'Birth Certificate Number is required.',
        IDValidator.validateUSBirthCertificate
    );

    static validateUSMedicareMedicaid = (req: Request, res: Response) => this.performValidation(
        req, res, ['medicareNumber'],
        'Medicare/Medicaid Number is required.',
        IDValidator.validateUSMedicareMedicaid
    );

    static validateUSVeteranID = (req: Request, res: Response) => this.performValidation(
        req, res, ['vicNumber'],
        'Veteran ID Number is required.',
        IDValidator.validateUSVeteranID
    );

    static validateUKDrivingLicence = (req: Request, res: Response) => this.performValidation(
        req, res, ['licenceNumber'],
        'Driving Licence Number is required.',
        IDValidator.validateUKDrivingLicence
    );

    
    static validateUKBirthCertificate = (req: Request, res: Response) => this.performValidation(
        req, res, ['birthCertNumber'],
        'Birth Certificate Number is required.',
        IDValidator.validateUKBirthCertificate
    );
    
    static validateUKArmedForcesID = (req: Request, res: Response) => this.performValidation(
        req, res, ['armedForcesID'],
        'Armed Forces ID Number is required.',
        IDValidator.validateUKArmedForcesID
    );
    
    static validateUKNINumber = (req: Request, res: Response) => this.performValidation(
        req, res, ['niNumber'],
        'UK NI Number is required.',
        IDValidator.validateUKNINumber
    );
    
    static validateUKResidenceCard = (req: Request, res: Response) => this.performValidation(
        req, res, ['residenceCardNumber'],
        'Residence Card Number is required.',
        IDValidator.validateUKResidenceCard
    );
    
    static validateCanadianSIN = (req: Request, res: Response) => this.performValidation(
        req, res, ['sinNumber'],
        'Canadian SIN Number is required.',
        IDValidator.validateCanadianSIN
    );
    
    static validateMexicanCURP = (req: Request, res: Response) => this.performValidation(
        req, res, ['curpNumber'],
        'Mexican CURP Number is required.',
        IDValidator.validateMexicanCURP
    );
    
    static validateSouthKoreanRRN = (req: Request, res: Response) => this.performValidation(
        req, res, ['rrnNumber'],
        'South Korean RRN Number is required.',
        IDValidator.validateSouthKoreanRRN
    );
    
    static validateGermanPersonalausweis = (req: Request, res: Response) => this.performValidation(
        req, res, ['idNumber'],
        'German Personalausweis Number is required.',
        IDValidator.validateGermanPersonalausweis
    );


}