///src/utils/IDValidators
import PassportValidator from "./PassportValidator";
import { User, UserDataToBeValidated, isUser } from "../types/user";
import { ValidationResult } from "../types/validation";

type ValidationOptions = {
required?: boolean // Whether fields are mandatory
strictPassword?: boolean
}
  
type DocumentValidationResult = ValidationResult//Omit<ValidationResult, 'status'>

class IDValidator {
    static validateFields(userData: User , options: ValidationOptions = { required: true }): ValidationResult {
        const { username, name, surname, email, password, role } = userData;
        const { required } = options;

        // Validate required fields
        if (required) {
            const requiredFields: string[] = ['username', 'name', 'surname', 'email', 'password'];
            let missingFields: string[] = []; 
                missingFields = requiredFields.filter(field => !userData[field as keyof User]);
    
            if (missingFields.length > 0) {
                return {
                    valid: false,
                    error: `Missing required fields: ${missingFields.join(', ')}`,
                    status: 400, // Status is always defined
                };
            }
        }

        // Validate name and surname length
        if (name && name.length < 2) {
            return {
                valid: false,
                error: 'Name must be at least 2 characters long.',
                status: 400,
            };
        }
        if (surname && surname.length < 2) {
            return {
                valid: false,
                error: 'Surname must be at least 2 characters long.',
                status: 400,
            };
        }
        if (username && username.length < 2) {
            return {
                valid: false,
                error: 'Username must be at least 2 characters long.',
                status: 400,
            };
        }

        // Validate email format
        if (email) {
            const emailRegex: RegExp  = /^[a-zA-Z0-9._%+-]+@([a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$|^[a-zA-Z0-9._%+-]+@(\d{1,3}\.){3}\d{1,3}$/i;
            if (!emailRegex.test(email)) {
                return { 
                        valid: false,
                        error: 'Invalid email format.',
                        status: 400
                     };
            }
        }

        // Validate password length and strength
        if (password) {
            const passwordRegex: RegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&.]{8,}$/;
            if (!passwordRegex.test(password)) {
                return {
                    valid: false,
                    error: 'Password must be at least 8 characters long and include an uppercase letter, a lowercase letter, and a number.',
                    status: 400,
                };
            }
        }

        // Validate role
        if (role && !['User', 'Admin'].includes(role)) {
            return {
                valid: false,
                error: 'Invalid role. Allowed values are "User" or "Admin".',
                status: 400,
            };
        }

        // If all validations pass
        return {
            valid: true,
            error: null,
            status: 200, // Status is always defined
        };
    }
    static validatePassport(passportNumber: string, countryCode: string): ValidationResult {
        const result = PassportValidator.validatePassport(passportNumber, countryCode);

        return {
            valid: result.valid,
            error: result.error? result.error: null,
            status: result.valid ? 200 : 400, 
        };
    }
    // Validator for CPF (Cadastro de Pessoas Físicas) - Brazil
    static validateCPF(cpfNumber: string): DocumentValidationResult {
        if (typeof cpfNumber !== 'string') {
            return { valid: false, error: 'Invalid input type expected string', status: 400 };
        }


        // CPF is 11 digits long and has a specific validation algorithm
        cpfNumber = cpfNumber.replace(/\D/g, ''); // input cleaning and improved format validation

        const cpfRegex: RegExp = /^\d{11}$/;
        // Check if the input matches the CPF format (11 digits)
        if (!cpfRegex.test(cpfNumber)) return { valid: false, error: 'Invalid CPF format', status: 400 };
    
        // Check if all digits are the same (e.g., '11111111111')
        if (/^(\d)\1{10}$/.test(cpfNumber)) return { valid: false, error: 'Invalid CPF checksum', status: 400 };
         
        let sum: number = 0;
        let remainder: number;
    
        // First digit validation
        // Calculate the sum of the first 9 digits multiplied by their respective weights (10 to 2)
        for (let i = 0; i < 9; i++) {
            sum += parseInt(cpfNumber.charAt(i)) * (10 - i);
        }
        // Calculate the remainder of the division of the sum by 11
        remainder = sum % 11;
        const firstDigit: number = remainder < 2 ? 0 : 11 - remainder;
        // Check if the calculated digit matches the 10th digit
        if (firstDigit !== parseInt(cpfNumber.charAt(9))) {
            return { valid: false, error: 'Invalid CPF checksum', status: 400 };
}
        sum = 0;
        // Second digit validation
        // Calculate the sum of the first 10 digits multiplied by their respective weights (11 to 2)
        for (let i = 0; i < 10; i++) {
            sum += parseInt(cpfNumber.charAt(i)) * (11 - i);
        }
        // Calculate the remainder of the division of the sum by 11
        remainder = sum % 11;
        const secondDigit: number = remainder < 2 ? 0 : 11 - remainder;
        // Check if the calculated digit matches the 11th digit
        if (secondDigit !== parseInt(cpfNumber.charAt(10))) {
            return { valid: false, error: 'Invalid CPF checksum', status: 400 };
        }
            
    
        // If both checks pass, the CPF is valid
        return { valid: true, error: null, status: 200 };
    }
    // Validator for RG (Registro Geral) - Brazil
    static validateRG(rgNumber: string) {
        if (typeof rgNumber !== 'string') {
            return { valid: false, error: 'Invalid input type expected string', status: 400 };
        }
    
        // Remove any leading or trailing spaces from the RG number.
        const trimmedRG: string = rgNumber.trim();
    
        // Validate the RG format using regex.
        // Allow two formats:
        // 1. Formatted: XX.XXX.XXX-X (dots and dash are optional)
        // 2. Unformatted: 9 digits (XXXXXXXXX)
        const rgRegex: RegExp = /^(\d{2}\.?\d{3}\.?\d{3}-?[0-9Xx]|\d{9})$/i;
        if (!rgRegex.test(trimmedRG)) {
            return { valid: false, error: 'Invalid RG format', status: 400 };
        }
    
        // Remove dots and dashes, and convert to uppercase for consistency.
        const cleaned: string = trimmedRG.replace(/[.-]/g, '').toUpperCase();
    
        // The cleaned RG must be exactly 9 characters long (8 digits + 1 check digit).
        if (cleaned.length !== 9) {
            return { valid: false, error: 'Invalid RG format', status: 400 };
        }
    
        // Extract the first 8 characters as the digits part and the last character as the check digit.
        const digitsPart: string = cleaned.slice(0, 8);
        const checkDigit: string = cleaned.charAt(8);
    
        // Reject RGs where the digits part is all zeros.
        if (digitsPart === '00000000') {
            return { valid: false, error: 'Invalid RG checksum', status: 400 };
        }
    
        // Reject RGs where all digits are the same (e.g., '11111111').
        if (/^(\d)\1+$/.test(digitsPart)) {
            return { valid: false, error: 'Invalid RG checksum', status: 400 };
        }
    
        // Use weights [9, 8, 7, 6, 5, 4, 3, 2] for each digit in the digits part.
        const weights: number[] = [9, 8, 7, 6, 5, 4, 3, 2];
        let sum: number = 0;
        for (let i = 0; i < 8; i++) {
            sum += parseInt(digitsPart[i], 10) * weights[i];
        }
    
        // Calculate the check digit as (11 - (sum % 11)).
        const remainder: number = sum % 11;
        const computedCheck: number = 11 - remainder;
    
        // Handle special cases for the computed check digit:
        // If the computed check is 10, the check digit is 'X'.
        // If the computed check is 11, the check digit is '0'.
        let computedDigit: string;
        if (computedCheck === 10) {
            computedDigit = 'X';
        } else if (computedCheck === 11) {
            computedDigit = '0';
        } else {
            computedDigit = computedCheck.toString();
        }
    
        // Compare the computed check digit with the provided check digit.
        if (computedDigit !== checkDigit) {
            return { valid: false, error: 'Invalid RG checksum', status: 400 };
        }
    
        // If all checks pass, the RG is valid.
        return { valid: true, error: null, status: 200 };
    }
    // Validator for SUS (Sistema Único de Saúde) - Brazil
    static validateSUS(susNumber: string): DocumentValidationResult {
        // SUS number must be exactly 15 digits
        const susRegex: RegExp = /^\d{15}$/;
        if (!susRegex.test(susNumber)) return { valid: false, error: 'Invalid SUS format', status: 400 };

        // Checksum validation: Calculate a weighted sum of the digits, using weights decreasing from 15 to 1
        let sum: number = 0;
        for (let i = 0; i < 15; i++) {
            sum += parseInt(susNumber.charAt(i)) * (15 - i);
        }
        // If the sum is divisible by 11, the SUS number is valid
        const isValid: boolean = sum % 11 === 0;
        return { valid: isValid, error: isValid ? null : 'Invalid SUS checksum', status: isValid ? 200 : 400};
    }

    // Validator for CNH (Carteira Nacional de Habilitação) - Brazil
    static validateCNH(cnhNumber: string): DocumentValidationResult {
        // CNH must be exactly 11 digits
        const cnhRegex: RegExp = /^\d{11}$/;
        if (!cnhRegex.test(cnhNumber)) return { valid: false, error: 'Invalid CNH format', status: 400 };

        // First digit checksum: Calculate a weighted sum using weights decreasing from 9 to 1
        let sum1: number = 0;
        for (let i = 0; i < 9; i++) {
            sum1 += parseInt(cnhNumber.charAt(i)) * (9 - i);
        }
        let dv1: number = sum1 % 11;
        // If the remainder is 10, the check digit becomes 0
        if (dv1 === 10) dv1 = 0;

        // Second digit checksum: Calculate a weighted sum using weights increasing from 1 to 9
        let sum2: number = 0;
        for (let i = 0; i < 9; i++) {
            sum2 += parseInt(cnhNumber.charAt(i)) * (1 + i);
        }
        let dv2: number = sum2 % 11;
        // If the remainder is 10, the check digit becomes 0
        if (dv2 === 10) dv2 = 0;

        // Validate that both calculated check digits match the last two digits of the CNH
        const isValid: boolean = dv1 === parseInt(cnhNumber.charAt(9)) && dv2 === parseInt(cnhNumber.charAt(10));
        return { valid: isValid, error: isValid ? null : 'Invalid CNH checksum', status: isValid ? 200 : 400  };
    }
    

    // Validator for CTPS (Carteira de Trabalho e Previdência Social) - Brazil
    static validateCTPS(ctpsNumber: string): DocumentValidationResult {
        // CTPS format: 7-8 digits followed by 1-2 check digits, with optional dashes or spaces
        const ctpsRegex: RegExp = /^[0-9]{7,8}[-\s]?[0-9]{1,2}$/;
        if (!ctpsRegex.test(ctpsNumber)) return { valid: false, error: 'Invalid CTPS format', status: 400 };

        // Normalize the input: Remove dashes or spaces and pad to 9 digits if necessary
        const ctpsDigits: string = ctpsNumber.replace(/[-\s]/g, '').padStart(9, '0');
        const numberPart: string = ctpsDigits.slice(0, -2); // First 7-8 digits
        const checkDigits: string = ctpsDigits.slice(-2); // Last 1-2 digits

        // Checksum validation: Calculate a weighted sum using weights decreasing from the length of the number part
        let sum: number = 0;
        for (let i = 0; i < numberPart.length; i++) {
            sum += parseInt(numberPart.charAt(i)) * (numberPart.length + 1 - i);
        }
        // The check digit is calculated as (11 - (sum % 11)) % 10
        let dv: number = (11 - (sum % 11)) % 10;

        // Validate that the calculated check digit matches the provided check digit
        const isValid: boolean = dv === parseInt(checkDigits);
        return { valid: isValid, error: isValid ? null : 'Invalid CTPS checksum', status: isValid ? 200 : 400 };
    }

    // Shared Validator for Professional Registrations
    static validateProfessionalRegistration(registrationNumber: string, type: 'CRM' | 'OAB' | 'CREA' ): DocumentValidationResult  {
        // Define the regex for the common format
        const commonRegex: RegExp = /^\d{4,6}\/[A-Z]{2}$/;
        if (typeof registrationNumber !== 'string') return { valid: false, error: 'Invalid input type', status: 400 };
        // Validate using the common format
        const isValid: boolean = commonRegex.test(registrationNumber.trim());
        return {
            valid: isValid,
            error: isValid ? null : `Invalid ${type} format`, 
            status: isValid ? 200 : 400
        };
    }

    // Validator for CRM (Conselho Regional de Medicina) - Brazil
    static validateCRM(crmNumber: string): DocumentValidationResult  {
        return this.validateProfessionalRegistration(crmNumber, 'CRM');
    }

    // Validator for OAB (Ordem dos Advogados do Brasil) - Brazil
    static validateOAB(oabNumber: string): DocumentValidationResult  {
        return this.validateProfessionalRegistration(oabNumber, 'OAB');
    }

    // Validator for CREA (Conselho Regional de Engenharia e Agronomia) - Brazil
    static validateCREA(creaNumber: string): DocumentValidationResult  {
        return this.validateProfessionalRegistration(creaNumber, 'CREA');
    }

    //Validates Brazilian PIS/PASEP number
    static validatePIS(pisNumber: string): DocumentValidationResult  {
        // Ensure the input is exactly 11 digits
        if (!/^\d{11}$/.test(pisNumber)) {
            return { valid: false, error: "Invalid PIS/PASEP format", status: 400 };
        }

        // Weighting factors for the first 10 digits
        const weights: number[] = [3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
        let sum: number = 0;

        // Calculate the weighted sum
        for (let i = 0; i < 10; i++) {
            sum += parseInt(pisNumber[i]) * weights[i];
        }

        // Calculate the check digit
        let remainder: number = sum % 11;
        let checkDigit: number = remainder < 2 ? 0 : 11 - remainder;


        const isValid: boolean =  checkDigit === parseInt(pisNumber[10]);
        // Validate the check digit against the last digit of the PIS/PASEP number
        return {
            valid: isValid,
            error: isValid ? null : "Invalid PIS/PASEP number",
             status: isValid ? 200 : 400
        };
    }
    //Validates a Brazilian CNPJ (Cadastro Nacional da Pessoa Jurídica).
    static validateCNPJ(cnpj: string): DocumentValidationResult  {
        // Ensure the input is exactly 14 digits
        if (!/^\d{14}$/.test(cnpj)) {
            return { valid: false, error: "Invalid CNPJ format", status: 400 };
        }

        
        //Helper function to calculate a CNPJ check digit.
        const calculateCheckDigit = (cnpj: string, weights: number[]): number => {
            let sum: number = 0;
            for (let i = 0; i < weights.length; i++) {
                sum += parseInt(cnpj[i]) * weights[i];
            }
            let remainder: number = sum % 11;
            return remainder < 2 ? 0 : 11 - remainder;
        };

        // Weight factors for the first and second check digits
        const firstWeights: number[] = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
        const secondWeights: number[] = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

        // Calculate both check digits
        const firstDigit: number = calculateCheckDigit(cnpj, firstWeights);
        const secondDigit: number = calculateCheckDigit(cnpj, secondWeights);

        const isValid: boolean = firstDigit === parseInt(cnpj[12]) && secondDigit === parseInt(cnpj[13]);
        // Validate check digits against the last two digits of the CNPJ number
        return {
            valid: isValid,
            error: isValid? null : "Invalid CNPJ number", 
            status: isValid ? 200 : 400
        };
    }


    // Validate US Driver's License (General Format - State-Specific Checks Recommended)
    static validateUSDriversLicense(licenseNumber: string): DocumentValidationResult  {
        const licenseRegex: RegExp = /^[A-Z0-9]{4,16}$/; // Extended to cover some state variations
        const isValid: boolean = licenseRegex.test(licenseNumber);


        return { valid: isValid, error:isValid ? null : "Invalid US Driver's License format", status: isValid ? 200 : 400 };
    }

    // Validate US Social Security Number (SSN)
    static validateUSSSN(ssn: string): DocumentValidationResult  {
        const ssnRegex: RegExp = /^(?!000|666|9\d{2})\d{3}-(?!00)\d{2}-(?!0000)\d{4}$/;
        const isValid: boolean = ssnRegex.test(ssn);

        return { valid: isValid, error: isValid ? null : "Invalid SSN format", status: isValid ? 200 : 400 };
    }

    // Validate US Military ID (CAC)
    static validateUSMilitaryID(militaryID: string): DocumentValidationResult  {
        const militaryIDRegex: RegExp = /^[A-Z0-9]{10,12}$/;
        const isValid: boolean = militaryIDRegex.test(militaryID);

        return { valid: isValid, error: isValid ? null : "Invalid US Military ID format", status: isValid ? 200 : 400 };
    }

    // Validate US Permanent Resident Card (Green Card)
    static validateUSGreenCard(greenCardNumber: string): DocumentValidationResult  {
        const greenCardRegex: RegExp = /^([A-Z]{3}\d{10}|[A-Z]\d{8,9})$/;
        const isValid: boolean = greenCardRegex.test(greenCardNumber);

        return { valid: isValid, error: isValid ? null : "Invalid Green Card format", status: isValid ? 200 : 400 };
    }

    // Validate US Employment Authorization Document (EAD)
    static validateUSEAD(eadNumber: string): DocumentValidationResult  {
        const eadRegex: RegExp = /^[A-Z]{3}\d{10}$/;
        const isValid: boolean = eadRegex.test(eadNumber);

        return { valid: isValid, error: isValid ? null : "Invalid EAD format", status: isValid ? 200 : 400 };
    }

    // Validate US Birth Certificate (General Format)
    static validateUSBirthCertificate(birthCertNumber: string): DocumentValidationResult  {
        const birthCertRegex: RegExp = /^[A-Z]{2}\d{6,8}$/;
        const isValid: boolean = birthCertRegex.test(birthCertNumber);

        return { valid: isValid, error: isValid ? null : "Invalid US Birth Certificate format", status: isValid ? 200 : 400 };
    }

    // Validate US Medicare/Medicaid Card (MBI Format)
    static validateUSMedicareMedicaid(medicareNumber: string): DocumentValidationResult  {
        const medicareRegex: RegExp = /^[1-9][A-Z]\d{2}-[A-Z]\d{4}-[A-Z]\d{2}$/;
        const isValid: boolean = medicareRegex.test(medicareNumber);

        return { valid: isValid, error: isValid ? null : "Invalid Medicare/Medicaid format", status: isValid ? 200 : 400 };
    }

    // Validate US Veteran ID Card (VIC)
    static validateUSVeteranID(vicNumber: string): DocumentValidationResult  {
        const vicRegex: RegExp = /^[A-Z0-9]{8,12}$/;
        const isValid: boolean = vicRegex.test(vicNumber);


        return { valid: isValid, error: isValid ? null : "Invalid Veteran ID format", status: isValid ? 200 : 400 };
    }

    // Validate UK Driving Licence (DVLA Format)
    static validateUKDrivingLicence(licenceNumber: string): DocumentValidationResult  {
        const licenceRegex: RegExp = /^[A-Z]{5}\d{6}[A-Z]{2}\d{2}$/;
        const isValid: boolean = licenceRegex.test(licenceNumber);

        return { valid: isValid, error: isValid ? null : "Invalid UK Driving Licence format", status: isValid ? 200 : 400 };
    }

    // Validate UK Birth Certificate
    static validateUKBirthCertificate(birthCertNumber: string): DocumentValidationResult  {
        const birthCertRegex: RegExp = /^[A-Z]{2}\d{6,8}$/;
        const isValid: boolean = birthCertRegex.test(birthCertNumber);

        return { valid: isValid, error: isValid ? null : "Invalid UK Birth Certificate format", status: isValid ? 200 : 400 };
    }

    // Validate UK Armed Forces ID
    static validateUKArmedForcesID(armedForcesID: string): DocumentValidationResult  {
        const armedForcesRegex: RegExp = /^[A-Z]{2}\d{6}$/;
        const isValid: boolean = armedForcesRegex.test(armedForcesID);


        return { valid: isValid, error: isValid ? null : "Invalid UK Armed Forces ID format", status: isValid ? 200 : 400 };
    }

    // Validate UK National Insurance Number (NI Number)
    static validateUKNINumber(niNumber: string): DocumentValidationResult  {
        const niRegex: RegExp = /^(?!BG|GB|NK|KN|TN|NT|ZZ)[A-Z]{2}\d{6}[ABCD]$/;
        const isValid: boolean = niRegex.test(niNumber);


        return { valid: isValid, error: isValid ? null : "Invalid UK NI Number format", status: isValid ? 200 : 400 };
    }

    // Validate UK Biometric Residence Permit (BRP)
    static validateUKResidenceCard(residenceCardNumber: string): DocumentValidationResult  {
        const residenceCardRegex: RegExp = /^[A-Z0-9]{12}$/;
        const isValid: boolean = residenceCardRegex.test(residenceCardNumber);


        return { valid: isValid, error: isValid ? null : "Invalid UK Residence Card format", status: isValid ? 200 : 400 };
    }

    //Canadian SIN (Social Insurance Number)
    static validateCanadianSIN(sin: string): DocumentValidationResult  {
        // Ensure the input is exactly 9 digits
        if (!/^\d{9}$/.test(sin)) {
            return { valid: false, error: "Invalid SIN format", status: 400 };
        }
    
        // Luhn algorithm for SIN validation
        const luhnCheck = (sin: string): boolean => {
            let sum: number = 0;

             // Loop through each digit in the SIN
            for (let i = 0; i < sin.length; i++) {
                let digit: number = parseInt(sin[i]);

                // Double every second digit (even index positions in zero-based indexing)
                if (i % 2 === 0) {
                    digit *= 2;

                    // If doubling results in a two-digit number, subtract 9 (e.g., 8 * 2 = 16 → 1 + 6 = 7)
                    if (digit > 9) digit = digit - 9;
                }
                 // Add the processed digit to the sum
                sum += digit;
            }

            // If the sum is a multiple of 10, the SIN is valid
            return sum % 10 === 0;
        };
    
        const isValid: boolean =  luhnCheck(sin);

         // Return validation result along with an error error if invalid
        return {
            valid: isValid,
            error: isValid ? null : "Invalid SIN number", 
            status: isValid ? 200 : 400
        };
    }


    static validateMexicanCURP(curp: string): DocumentValidationResult  {
        // CURP format: 18 alphanumeric characters
        const curpRegex: RegExp = /^[A-Z]{4}\d{6}[HM][A-Z]{5}\d{2}$/;
        if (!curpRegex.test(curp)) {
            return { valid: false, error: "Invalid CURP format", status: 400 };
        }
    
        // Checksum validation
        const checksum = (curp: string): boolean => {
            // Define the valid characters for the CURP, including numbers and letters
            const chars: string = "0123456789ABCDEFGHIJKLMNÑOPQRSTUVWXYZ";
    
            let sum: number = 0;
    
            // Iterate over the first 17 characters of the CURP
            for (let i = 0; i < 17; i++) {
                const char: string = curp[i]; // Get the current character
                const value: number = chars.indexOf(char); // Find its position in the `chars` string
                sum += value * (18 - i); // Multiply the character's value by its weight (18 - position)
            }
    
            // Calculate the checksum digit: 10 - (sum % 10)
            // If the result is 10, it wraps around to 0
            let  checksumDigit: number = 10 - (sum % 10);
            if (checksumDigit === 10) {
                checksumDigit = 0;
            }
    
            // Compare the calculated checksum digit with the 18th character of the CURP
            return checksumDigit === parseInt(curp[17]);
        };
    
        const isValid: boolean =  checksum(curp);

        // Return the validation result
        return {
            valid: isValid,
            error: isValid ? null : "Invalid CURP checksum", 
            status: isValid ? 200 : 400
        };
    }
    

    static validateSouthKoreanRRN(rrn: string): DocumentValidationResult  {
        // Ensure the input is a 13-digit string
        // The RRN must be exactly 13 digits long and consist only of numbers.
        if (!/^\d{13}$/.test(rrn)) {
            return { valid: false, error: "Invalid RRN format", status: 400 };
        }
    
        // Validate gender digit (7th digit: 1-4)
        // The 7th digit of the RRN indicates the gender and the century of birth:
        // 1 or 2: Male or female born in the 1900s
        // 3 or 4: Male or female born in the 2000s
        const genderDigit: number = parseInt(rrn[6]);
        if (genderDigit < 1 || genderDigit > 4) {
            return { valid: false, error: "Invalid gender digit in RRN", status: 400 };
        }
    
        // Validate birthdate (first 6 digits: YYMMDD)
        // The first 6 digits represent the birthdate in the format YYMMDD.
        const year: number = parseInt(rrn.substring(0, 2));  // Extract the year (YY)
        const month: number = parseInt(rrn.substring(2, 4)); // Extract the month (MM)
        const day: number = parseInt(rrn.substring(4, 6));  // Extract the day (DD)
    
        // Determine the century based on the gender digit
        // If the gender digit is 1 or 2, the birth year is in the 1900s.
        // If the gender digit is 3 or 4, the birth year is in the 2000s.
        let fullYear: number;
        if (genderDigit === 1 || genderDigit === 2) {
            fullYear = 1900 + year; // Birth year is in the 1900s
        } else if (genderDigit === 3 || genderDigit === 4) {
            fullYear = 2000 + year; // Birth year is in the 2000s
        }else {
            // This block is technically unreachable due to the earlier genderDigit validation,
            // but it ensures TypeScript that `fullYear` is always assigned.
            return { valid: false, error: 'Invalid gender digit in RRN', status: 400 }
        }

    
        // Validate the date
        // Create a Date object using the extracted year, month, and day.
        // Subtract 1 from the month because JavaScript months are 0-indexed (0 = January).
        const date: Date = new Date(fullYear, month - 1, day);
        // Check if the date is valid by verifying if the Date object's time is NaN.
        if (isNaN(date.getTime())) {
            return { valid: false, error: "Invalid birthdate in RRN", 
                status: 400 };
        }
    
        // Check digit validation
        // The 13th digit is a check digit used to validate the RRN.
        // The check digit is calculated using a weighted sum of the first 12 digits.
        const weights: number[] = [2, 3, 4, 5, 6, 7, 8, 9, 2, 3, 4, 5]; // Weights for each digit
        // Calculate the weighted sum of the first 12 digits.
        const sum: number = weights.reduce((acc, weight, i) => acc + parseInt(rrn[i]) * weight, 0);
        // Calculate the remainder: (11 - (sum % 11)) % 10
        const remainder: number = (11 - (sum % 11)) % 10;
        // Compare the calculated remainder with the 13th digit (check digit).
        const isValid: boolean = remainder === parseInt(rrn[12]);
    
        

        // Return the validation result
        return {
            valid: isValid,
            error: isValid ? null : "Invalid RRN number", status: isValid ? 200 : 400
        };
    }

    static validateGermanPersonalausweis(id: string): DocumentValidationResult  {
        // The German Personalausweis number must be exactly 10 digits long.
        // This regex checks if the input consists of exactly 10 digits.
        if (!/^\d{10}$/.test(id)) {
            return { valid: false, error: "Invalid format: Must be exactly 10 digits", status: 400 };
        }
    
        // The official weighting factors for the checksum calculation are [7, 3, 1].
        // These weights are applied to the last 9 digits of the 10-digit number.
        const weights: number[] = [7, 3, 1, 7, 3, 1, 7, 3, 1];
    
        // The checksum will be calculated by multiplying each digit by its corresponding weight
        // and summing up the results.
        let checksum: number = 0;
    
        // Loop through the last 9 digits of the input (from index 1 to 9).
        // The first digit (index 0) is the issuing authority number and is not used in the checksum.
        for (let i = 1; i < 10; i++) {
            // Extract the current digit and convert it to a number.
            const digit: number = parseInt(id[i], 10);
    
            // If the character is not a valid digit, return an error.
            if (isNaN(digit)) {
                return { valid: false, error: "Invalid character detected", status: 400 };
            }
    
            // Multiply the digit by its corresponding weight and add it to the checksum.
            // Note: `weights[i - 1]` is used because the weights array starts from index 0.
            checksum += digit * weights[i - 1];
        }
        // The expected check digit is the last digit of the checksum (checksum % 10).
        const expectedCheckDigit: number = checksum % 10;
    
        // The actual check digit is the 10th digit of the input (index 9).
        const actualCheckDigit: number = parseInt(id[9], 10);
    
        // If the actual check digit is not a number or does not match the expected check digit,
        // the input is invalid.
        if (isNaN(actualCheckDigit) || expectedCheckDigit !== actualCheckDigit) {
            return { valid: false, error: "Invalid checksum", status: 400 };
        }
    
        // If all checks pass, the input is valid.
        return { valid: true, error: null, status: 200 };
    }


  
}
export default IDValidator;
