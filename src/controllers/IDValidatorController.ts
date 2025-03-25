// src/controllers/ValidationController.ts
import {Request, Response} from 'express';
import IDValidator from '../utils/IDValidator';
import { UserDataToBeValidated, Role, User } from '../types/user';



export default class ValidationController {
    private static getData(req: Request, field: string): string | undefined {
        return req.body?.[field] ?? req.params?.[field];
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

    static validatePassport(req: Request, res: Response): void {
        const passportNumber = this.getData(req, 'passportNumber');
        const countryCode = this.getData(req, 'countryCode');

        if (!passportNumber || !countryCode) {
            res.status(400).json({
                error: 'Passport number and country code are required.'
            });
            return; // Exit the function early
        }

        const validationResult = IDValidator.validatePassport(passportNumber, countryCode);
        this.handleValidationResult(validationResult, res);
    }

    static validateCPF(req: Request, res: Response): void {
        const cpfNumber = this.getData(req, 'cpfNumber');

        if (!cpfNumber) {
            res.status(400).json({
                error: 'CPF number is required.'
            });
            return; // Exit the function early
        }

        const validationResult = IDValidator.validateCPF(cpfNumber);
        this.handleValidationResult(validationResult, res);
    }

    static validateRG(req: Request, res: Response): void {
        const rgNumber = this.getData(req, 'rgNumber');

        if (!rgNumber) {
            res.status(400).json({
                error: 'RG number is required.'
            });
            return; // Exit the function early
        }

        const validationResult = IDValidator.validateRG(rgNumber);
        this.handleValidationResult(validationResult, res);
    }

    static validateSUS(req: Request, res: Response): void {
        const susNumber = this.getData(req, 'susNumber');

        if (!susNumber) {
            res.status(400).json({
                error: 'SUS number is required.'
            });
            return; // Exit the function early
        }

        const validationResult = IDValidator.validateSUS(susNumber);
        this.handleValidationResult(validationResult, res);
    }

    static validateCNH(req: Request, res: Response): void {
        const cnhNumber = this.getData(req, 'cnhNumber');

        if (!cnhNumber) {
            res.status(400).json({
                error: 'CNH number is required.'
            });
            return;
        }

        const validationResult = IDValidator.validateCNH(cnhNumber);
        this.handleValidationResult(validationResult, res);
    }

    static validateCTPS(req: Request, res: Response): void {
        const ctpsNumber = this.getData(req, 'ctpsNumber');

        if (!ctpsNumber) {
            res.status(400).json({
                error: 'CTPS number is required.'
            });
            return;
        }

        const validationResult = IDValidator.validateCTPS(ctpsNumber);
        this.handleValidationResult(validationResult, res);
    }

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

    static validatePIS(req: Request, res: Response): void {
        const pisNumber = this.getData(req, 'pis');

        if (!pisNumber) {
            res.status(400).json({
                error: 'PIS number is required.'
            });
            return;
        }

        const validationResult = IDValidator.validatePIS(pisNumber);
        this.handleValidationResult(validationResult, res);
    }

    static validateCNPJ(req: Request, res: Response): void {
        const cnpjNumber = this.getData(req, 'cnpj');

        if (!cnpjNumber) {
            res.status(400).json({
                error: 'CNPJ number is required.'
            });
            return;
        }

        const validationResult = IDValidator.validateCNPJ(cnpjNumber);
        this.handleValidationResult(validationResult, res);
    }

    static validateUSDriversLicense(req: Request, res: Response): void {
        const licenseNumber = this.getData(req, 'licenseNumber');

        if (!licenseNumber) {
            res.status(400).json({
                error: 'US Driver\'s License number is required.'
            });
            return;
        }

        const validationResult = IDValidator.validateUSDriversLicense(licenseNumber);
        this.handleValidationResult(validationResult, res);
    }

    static validateUSSSN(req: Request, res: Response): void {
        const ssn = this.getData(req, 'ssn');

        if (!ssn) {
            res.status(400).json({
                error: 'US SSN is required.'
            });
            return;
        }

        const validationResult = IDValidator.validateUSSSN(ssn);
        this.handleValidationResult(validationResult, res);
    }

    static validateUSMilitaryID(req: Request, res: Response): void {
        const militaryID = this.getData(req, 'militaryID');

        if (!militaryID) {
            res.status(400).json({
                error: 'US Military ID is required.'
            });
            return;
        }

        const validationResult = IDValidator.validateUSMilitaryID(militaryID);
        this.handleValidationResult(validationResult, res);
    }

    static validateUSGreenCard(req: Request, res: Response): void {
        const greenCardNumber = this.getData(req, 'greenCardNumber');

        if (!greenCardNumber) {
            res.status(400).json({
                error: 'US Greencard Number is required.'
            });
            return;
        }

        const validationResult = IDValidator.validateUSGreenCard(greenCardNumber);
        this.handleValidationResult(validationResult, res);
    }

    static validateUSEAD(req: Request, res: Response): void {
        const eadNumber = req.body.eadNumber;

        if (!eadNumber) {
            res.status(400).json({
                error: 'EAD Number is required.'
            });
            return;
        }

        const validationResult = IDValidator.validateUSEAD(eadNumber);
        this.handleValidationResult(validationResult, res);
    }

    static validateUSBirthCertificate(req: Request, res: Response): void {
        const birthCertNumber = req.body.birthCertNumber;

        if (!birthCertNumber) {
            res.status(400).json({
                error: 'Birth Certificate Number is required.'
            });
            return;
        }

        const validationResult = IDValidator.validateUSBirthCertificate(birthCertNumber);
        this.handleValidationResult(validationResult, res);
    }

    static validateUSMedicareMedicaid(req: Request, res: Response): void {
        const medicareNumber = req.body.medicareNumber;

        if (!medicareNumber) {
            res.status(400).json({
                error: 'Medicare/Medicaid Number is required.'
            });
            return;
        }

        const validationResult = IDValidator.validateUSMedicareMedicaid(medicareNumber);
        this.handleValidationResult(validationResult, res);
    }

    static validateUSVeteranID(req: Request, res: Response): void {
        const vicNumber = req.body.vicNumber;

        if (!vicNumber) {
            res.status(400).json({
                error: 'Veteran ID Number is required.'
            });
            return;
        }

        const validationResult = IDValidator.validateUSVeteranID(vicNumber);
        this.handleValidationResult(validationResult, res);
    }

    static validateUKDrivingLicence(req: Request, res: Response): void {
        const licenceNumber = req.body.licenceNumber;

        if (!licenceNumber) {
            res.status(400).json({
                error: 'Driving Licence Number is required.'
            });
            return;
        }

        const validationResult = IDValidator.validateUKDrivingLicence(licenceNumber);
        this.handleValidationResult(validationResult, res);
    }

    static validateUKBirthCertificate(req: Request, res: Response): void {
        const birthCertNumber = req.body.birthCertNumber;

        if (!birthCertNumber) {
            res.status(400).json({
                error: 'Birth Certificate Number is required.'
            });
            return;
        }

        const validationResult = IDValidator.validateUKBirthCertificate(birthCertNumber);
        this.handleValidationResult(validationResult, res);
    }

    static validateUKArmedForcesID(req: Request, res: Response): void {
        const armedForcesID = req.body.armedForcesID;

        if (!armedForcesID) {
            res.status(400).json({
                error: 'Armed Forces ID Number is required.'
            });
            return;
        }

        const validationResult = IDValidator.validateUKArmedForcesID(armedForcesID);
        this.handleValidationResult(validationResult, res);
    }

    static validateUKNINumber(req: Request, res: Response): void {
        const niNumber = this.getData(req, 'niNumber');

        if (!niNumber) {
            res.status(400).json({
                error: 'UK NI Number is required.'
            });
            return;
        }

        const validationResult = IDValidator.validateUKNINumber(niNumber);
        this.handleValidationResult(validationResult, res);
    }

    static validateUKResidenceCard(req: Request, res: Response): void {
        const residenceCardNumber = req.body.residenceCardNumber;

        if (!residenceCardNumber) {
            res.status(400).json({
                error: 'Residence Card Number is required.'
            });
            return;
        }

        const validationResult = IDValidator.validateUKResidenceCard(residenceCardNumber);
        this.handleValidationResult(validationResult, res);
    }

    static validateCanadianSIN(req: Request, res: Response): void {
        const sinNumber = this.getData(req, 'sinNumber');

        if (!sinNumber) {
            res.status(400).json({
                error: 'Canadian SIN Number is required.'
            });
            return;
        }

        const validationResult = IDValidator.validateCanadianSIN(sinNumber);
        this.handleValidationResult(validationResult, res);
    }

    static validateMexicanCURP(req: Request, res: Response): void {
        const curpNumber = this.getData(req, 'curpNumber');

        if (!curpNumber) {
            res.status(400).json({
                error: 'Mexican CURP Number is required.'
            });
            return;
        }

        const validationResult = IDValidator.validateMexicanCURP(curpNumber);
        this.handleValidationResult(validationResult, res);
    }

    static validateSouthKoreanRRN(req: Request, res: Response): void {
        const rrnNumber = this.getData(req, 'rrnNumber');

        if (!rrnNumber) {
            res.status(400).json({
                error: 'South Korean RRN Number is required.'
            });
            return;
        }

        const validationResult = IDValidator.validateSouthKoreanRRN(rrnNumber);
        this.handleValidationResult(validationResult, res);
    }

    static validateGermanPersonalausweis(req: Request, res: Response): void {
        const idNumber = this.getData(req, 'idNumber');

        if (!idNumber) {
            res.status(400).json({
                error: 'German Personalausweis Number is required.'
            });
            return;
        }

        const validationResult = IDValidator.validateGermanPersonalausweis(idNumber);
        this.handleValidationResult(validationResult, res);
    }




}