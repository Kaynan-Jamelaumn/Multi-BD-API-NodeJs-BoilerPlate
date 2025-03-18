import { User } from "../types/user";
import { ValidationResult } from "../types/validation";
type ValidationOptions = {
    required?: boolean;
    strictPassword?: boolean;
};
type DocumentValidationResult = ValidationResult;
declare class IDValidator {
    static validateFields(userData: User, options?: ValidationOptions): ValidationResult;
    static validatePassport(passportNumber: string, countryCode: string): ValidationResult;
    static validateCPF(cpfNumber: string): DocumentValidationResult;
    static validateRG(rgNumber: string): {
        valid: boolean;
        error: string;
        status?: undefined;
    } | {
        valid: boolean;
        error: string | null;
        status: number;
    };
    static validateSUS(susNumber: string): DocumentValidationResult;
    static validateCNH(cnhNumber: string): DocumentValidationResult;
    static validateCTPS(ctpsNumber: string): DocumentValidationResult;
    static validateProfessionalRegistration(registrationNumber: string, type: 'CRM' | 'OAB' | 'CREA'): DocumentValidationResult;
    static validateCRM(crmNumber: string): DocumentValidationResult;
    static validateOAB(oabNumber: string): DocumentValidationResult;
    static validateCREA(creaNumber: string): DocumentValidationResult;
    static validatePIS(pisNumber: string): DocumentValidationResult;
    static validateCNPJ(cnpj: string): DocumentValidationResult;
    static validateUSDriversLicense(licenseNumber: string): DocumentValidationResult;
    static validateUSSSN(ssn: string): DocumentValidationResult;
    static validateUSMilitaryID(militaryID: string): DocumentValidationResult;
    static validateUSGreenCard(greenCardNumber: string): DocumentValidationResult;
    static validateUSEAD(eadNumber: string): DocumentValidationResult;
    static validateUSBirthCertificate(birthCertNumber: string): DocumentValidationResult;
    static validateUSMedicareMedicaid(medicareNumber: string): DocumentValidationResult;
    static validateUSVeteranID(vicNumber: string): DocumentValidationResult;
    static validateUKDrivingLicence(licenceNumber: string): DocumentValidationResult;
    static validateUKBirthCertificate(birthCertNumber: string): DocumentValidationResult;
    static validateUKArmedForcesID(armedForcesID: string): DocumentValidationResult;
    static validateUKNINumber(niNumber: string): DocumentValidationResult;
    static validateUKResidenceCard(residenceCardNumber: string): DocumentValidationResult;
    static validateCanadianSIN(sin: string): DocumentValidationResult;
    static validateMexicanCURP(curp: string): DocumentValidationResult;
    static validateSouthKoreanRRN(rrn: string): DocumentValidationResult;
    static validateGermanPersonalausweis(id: string): DocumentValidationResult;
}
export default IDValidator;
