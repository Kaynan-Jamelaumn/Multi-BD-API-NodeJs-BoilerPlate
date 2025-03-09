import PassportValidator from "./PassportValidator.js";

class IDValidator {
    static validateFields(userData, options = {required: true}) 
    
        {const {username,name,surname,email,password,role} = userData;
        const {required} = options;

        // Validate required fields
        if (required && (!name || !surname || !email || !password || !username)) {
            return {
                valid: false,
                error: 'All fields (username, name, surname, email, password) are required.',
                status: 400
            };
        }

        // Validate name and surname length
        if (name && name.length < 2) {
            return {
                valid: false,
                error: 'Name must be at least 2 characters long.',
                status: 400
            };
        }
        if (surname && surname.length < 2) {
            return {
                valid: false,
                error: 'Surname must be at least 2 characters long.',
                status: 400
            };
        }
        if (username && username.length < 2) {
            return {
                valid: false,
                error: 'Username must be at least 2 characters long.',
                status: 400
            };
        }


        // Validate email format
        if (email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return {
                    valid: false,
                    error: 'Invalid email format.',
                    status: 400
                };
            }
        }

        // Validate password length and strength
        if (password) { //const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/; <- password regex including special chars 
            const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&.]{8,}$/;


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
                status: 400
            };
        }

        return null; // No validation errors
    }
    static validatePassport(passportNumber, countryCode) {
        PassportValidator.validatePassport(passportNumber, countryCode)
    }

    // Validator for CPF (Cadastro de Pessoas Físicas) - Brazil
    static validateCPF(cpfNumber) {
        // CPF is 11 digits long and has a specific validation algorithm
        const cpfRegex = /^\d{11}$/;
        // Check if the input matches the CPF format (11 digits)
        if (!cpfRegex.test(cpfNumber)) return { valid: false, error: 'Invalid CPF format' };

        let sum = 0;
        let remainder;

        // First digit validation
        // Calculate the sum of the first 9 digits multiplied by their respective weights (10 to 2)
        for (let i = 1; i <= 9; i++) {
            sum += parseInt(cpfNumber.charAt(i - 1)) * (11 - i);
        }
        // Calculate the remainder of the division of the sum by 11, then multiply by 10 and get the remainder of the division by 11 again
        remainder = (sum * 10) % 11;
        // If the remainder is 10 or 11, set it to 0
        if (remainder === 10 || remainder === 11) remainder = 0;
        // Check if the calculated remainder matches the 10th digit of the CPF
        if (remainder !== parseInt(cpfNumber.charAt(9))) return { valid: false, error: 'Invalid CPF checksum' };

        sum = 0;
        // Second digit validation
        // Calculate the sum of the first 10 digits multiplied by their respective weights (11 to 2)
        for (let i = 1; i <= 10; i++) {
            sum += parseInt(cpfNumber.charAt(i - 1)) * (12 - i);
        }
        // Calculate the remainder of the division of the sum by 11, then multiply by 10 and get the remainder of the division by 11 again
        remainder = (sum * 10) % 11;
        // If the remainder is 10 or 11, set it to 0
        if (remainder === 10 || remainder === 11) remainder = 0;
        // Check if the calculated remainder matches the 11th digit of the CPF
        if (remainder !== parseInt(cpfNumber.charAt(10))) return { valid: false, error: 'Invalid CPF checksum' };

        // If both checks pass, the CPF is valid
        return { valid: true, error: null };
    }
    // Validator for RG (Registro Geral) - Brazil
    static validateRG(rgNumber) {
        // RG format varies by state, allowing optional dots and dash
        const rgRegex = /^\d{2}\.?\d{3}\.?\d{3}-?[0-9Xx]?$/;
        if (typeof rgNumber !== 'string') return { valid: false, error: 'Invalid input type' };
        // Check if the RG matches the allowed format (digits with optional dots and dashes)
        return { valid: rgRegex.test(rgNumber.trim()), error: rgRegex.test(rgNumber.trim()) ? null : 'Invalid RG format' };
    
    }

    // Validator for SUS (Sistema Único de Saúde) - Brazil
    static validateSUS(susNumber) {
        // SUS number must be exactly 15 digits
        const susRegex = /^\d{15}$/;
        if (!susRegex.test(susNumber)) return { valid: false, error: 'Invalid SUS format' };

        // Checksum validation: Calculate a weighted sum of the digits, using weights decreasing from 15 to 1
        let sum = 0;
        for (let i = 0; i < 15; i++) {
            sum += parseInt(susNumber.charAt(i)) * (15 - i);
        }
        // If the sum is divisible by 11, the SUS number is valid
        const isValid = sum % 11 === 0;
        return { valid: isValid, error: isValid ? null : 'Invalid SUS checksum' };
    }

    // Validator for CNH (Carteira Nacional de Habilitação) - Brazil
    static validateCNH(cnhNumber) {
        // CNH must be exactly 11 digits
        const cnhRegex = /^\d{11}$/;
        if (!cnhRegex.test(cnhNumber)) return { valid: false, error: 'Invalid CNH format' };

        // First digit checksum: Calculate a weighted sum using weights decreasing from 9 to 1
        let sum1 = 0;
        for (let i = 0; i < 9; i++) {
            sum1 += parseInt(cnhNumber.charAt(i)) * (9 - i);
        }
        let dv1 = sum1 % 11;
        // If the remainder is 10, the check digit becomes 0
        if (dv1 === 10) dv1 = 0;

        // Second digit checksum: Calculate a weighted sum using weights increasing from 1 to 9
        let sum2 = 0;
        for (let i = 0; i < 9; i++) {
            sum2 += parseInt(cnhNumber.charAt(i)) * (1 + i);
        }
        let dv2 = sum2 % 11;
        // If the remainder is 10, the check digit becomes 0
        if (dv2 === 10) dv2 = 0;

        // Validate that both calculated check digits match the last two digits of the CNH
        const isValid = dv1 === parseInt(cnhNumber.charAt(9)) && dv2 === parseInt(cnhNumber.charAt(10));
        return { valid: isValid, error: isValid ? null : 'Invalid CNH checksum' };
    }
    

    // Validator for CTPS (Carteira de Trabalho e Previdência Social) - Brazil
    static validateCTPS(ctpsNumber) {
        // CTPS format: 7-8 digits followed by 1-2 check digits, with optional dashes or spaces
        const ctpsRegex = /^[0-9]{7,8}[-\s]?[0-9]{1,2}$/;
        if (!ctpsRegex.test(ctpsNumber)) return { valid: false, error: 'Invalid CTPS format' };

        // Normalize the input: Remove dashes or spaces and pad to 9 digits if necessary
        const ctpsDigits = ctpsNumber.replace(/[-\s]/g, '').padStart(9, '0');
        const numberPart = ctpsDigits.slice(0, -2); // First 7-8 digits
        const checkDigits = ctpsDigits.slice(-2); // Last 1-2 digits

        // Checksum validation: Calculate a weighted sum using weights decreasing from the length of the number part
        let sum = 0;
        for (let i = 0; i < numberPart.length; i++) {
            sum += parseInt(numberPart.charAt(i)) * (numberPart.length + 1 - i);
        }
        // The check digit is calculated as (11 - (sum % 11)) % 10
        let dv = (11 - (sum % 11)) % 10;

        // Validate that the calculated check digit matches the provided check digit
        const isValid = dv === parseInt(checkDigits);
        return { valid: isValid, error: isValid ? null : 'Invalid CTPS checksum' };
    }

    // Shared Validator for Professional Registrations
    static validateProfessionalRegistration(registrationNumber, type) {
        // Define the regex for the common format
        const commonRegex = /^\d{4,6}\/[A-Z]{2}$/;
        if (typeof registrationNumber !== 'string') return { valid: false, error: 'Invalid input type' };
        // Validate using the common format
        const isValid = commonRegex.test(registrationNumber.trim());
        return {
            valid: isValid,
            error: isValid ? null : `Invalid ${type} format`
        };
    }

    // Validator for CRM (Conselho Regional de Medicina) - Brazil
    static validateCRM(crmNumber) {
        return this.validateProfessionalRegistration(crmNumber, 'CRM');
    }

    // Validator for OAB (Ordem dos Advogados do Brasil) - Brazil
    static validateOAB(oabNumber) {
        return this.validateProfessionalRegistration(oabNumber, 'OAB');
    }

    // Validator for CREA (Conselho Regional de Engenharia e Agronomia) - Brazil
    static validateCREA(creaNumber) {
        return this.validateProfessionalRegistration(creaNumber, 'CREA');
    }

    //Validates Brazilian PIS/PASEP number
    static validatePIS(pisNumber) {
        // Ensure the input is exactly 11 digits
        if (!/^\d{11}$/.test(pisNumber)) {
            return { valid: false, error: "Invalid PIS/PASEP format" };
        }

        // Weighting factors for the first 10 digits
        const weights = [3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
        let sum = 0;

        // Calculate the weighted sum
        for (let i = 0; i < 10; i++) {
            sum += parseInt(pisNumber[i]) * weights[i];
        }

        // Calculate the check digit
        let remainder = sum % 11;
        let checkDigit = remainder < 2 ? 0 : 11 - remainder;

        // Validate the check digit against the last digit of the PIS/PASEP number
        return {
            valid: checkDigit === parseInt(pisNumber[10]),
            error: checkDigit === parseInt(pisNumber[10]) ? null : "Invalid PIS/PASEP number"
        };
    }
    //Validates a Brazilian CNPJ (Cadastro Nacional da Pessoa Jurídica).
    static validateCNPJ(cnpj) {
        // Ensure the input is exactly 14 digits
        if (!/^\d{14}$/.test(cnpj)) {
            return { valid: false, error: "Invalid CNPJ format" };
        }

        
        //Helper function to calculate a CNPJ check digit.
        const calculateCheckDigit = (cnpj, weights) => {
            let sum = 0;
            for (let i = 0; i < weights.length; i++) {
                sum += parseInt(cnpj[i]) * weights[i];
            }
            let remainder = sum % 11;
            return remainder < 2 ? 0 : 11 - remainder;
        };

        // Weight factors for the first and second check digits
        const firstWeights = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
        const secondWeights = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

        // Calculate both check digits
        const firstDigit = calculateCheckDigit(cnpj, firstWeights);
        const secondDigit = calculateCheckDigit(cnpj, secondWeights);

        // Validate check digits against the last two digits of the CNPJ number
        return {
            valid: firstDigit === parseInt(cnpj[12]) && secondDigit === parseInt(cnpj[13]),
            error: firstDigit === parseInt(cnpj[12]) && secondDigit === parseInt(cnpj[13]) ? null : "Invalid CNPJ number"
        };
    }


    // Validate US Driver's License (General Format - State-Specific Checks Recommended)
    static validateUSDriversLicense(licenseNumber) {
        const licenseRegex = /^[A-Z0-9]{4,16}$/; // Extended to cover some state variations
        return { valid: licenseRegex.test(licenseNumber), error: licenseRegex.test(licenseNumber) ? null : "Invalid US Driver's License format" };
    }

    // Validate US Social Security Number (SSN)
    static validateUSSSN(ssn) {
        const ssnRegex = /^(?!000|666|9\d{2})\d{3}-(?!00)\d{2}-(?!0000)\d{4}$/;
        return { valid: ssnRegex.test(ssn), error: ssnRegex.test(ssn) ? null : "Invalid SSN format" };
    }

    // Validate US Military ID (CAC)
    static validateUSMilitaryID(militaryID) {
        const militaryIDRegex = /^[A-Z0-9]{10,12}$/;
        return { valid: militaryIDRegex.test(militaryID), error: militaryIDRegex.test(militaryID) ? null : "Invalid US Military ID format" };
    }

    // Validate US Permanent Resident Card (Green Card)
    static validateUSGreenCard(greenCardNumber) {
        const greenCardRegex = /^([A-Z]{3}\d{10}|[A-Z]\d{8,9})$/;
        return { valid: greenCardRegex.test(greenCardNumber), error: greenCardRegex.test(greenCardNumber) ? null : "Invalid Green Card format" };
    }

    // Validate US Employment Authorization Document (EAD)
    static validateUSEAD(eadNumber) {
        const eadRegex = /^[A-Z]{3}\d{10}$/;
        return { valid: eadRegex.test(eadNumber), error: eadRegex.test(eadNumber) ? null : "Invalid EAD format" };
    }

    // Validate US Birth Certificate (General Format)
    static validateUSBirthCertificate(birthCertNumber) {
        const birthCertRegex = /^[A-Z]{2}\d{6,8}$/;
        return { valid: birthCertRegex.test(birthCertNumber), error: birthCertRegex.test(birthCertNumber) ? null : "Invalid US Birth Certificate format" };
    }

    // Validate US Medicare/Medicaid Card (MBI Format)
    static validateUSMedicareMedicaid(medicareNumber) {
        const medicareRegex = /^[1-9][A-Z]\d{2}-[A-Z]\d{4}-[A-Z]\d{2}$/;
        return { valid: medicareRegex.test(medicareNumber), error: medicareRegex.test(medicareNumber) ? null : "Invalid Medicare/Medicaid format" };
    }

    // Validate US Veteran ID Card (VIC)
    static validateUSVeteranID(vicNumber) {
        const vicRegex = /^[A-Z0-9]{8,12}$/;
        return { valid: vicRegex.test(vicNumber), error: vicRegex.test(vicNumber) ? null : "Invalid Veteran ID format" };
    }

    // Validate UK Driving Licence (DVLA Format)
    static validateUKDrivingLicence(licenceNumber) {
        const licenceRegex = /^[A-Z]{5}\d{6}[A-Z]{2}\d{2}$/;
        return { valid: licenceRegex.test(licenceNumber), error: licenceRegex.test(licenceNumber) ? null : "Invalid UK Driving Licence format" };
    }

    // Validate UK Birth Certificate
    static validateUKBirthCertificate(birthCertNumber) {
        const birthCertRegex = /^[A-Z]{2}\d{6,8}$/;
        return { valid: birthCertRegex.test(birthCertNumber), error: birthCertRegex.test(birthCertNumber) ? null : "Invalid UK Birth Certificate format" };
    }

    // Validate UK Armed Forces ID
    static validateUKArmedForcesID(armedForcesID) {
        const armedForcesRegex = /^[A-Z]{2}\d{6}$/;
        return { valid: armedForcesRegex.test(armedForcesID), error: armedForcesRegex.test(armedForcesID) ? null : "Invalid UK Armed Forces ID format" };
    }

    // Validate UK National Insurance Number (NI Number)
    static validateUKNINumber(niNumber) {
        const niRegex = /^(?!BG|GB|NK|KN|TN|NT|ZZ)[A-Z]{2}\d{6}[ABCD]$/;
        return { valid: niRegex.test(niNumber), error: niRegex.test(niNumber) ? null : "Invalid UK NI Number format" };
    }

    // Validate UK Biometric Residence Permit (BRP)
    static validateUKResidenceCard(residenceCardNumber) {
        const residenceCardRegex = /^[A-Z0-9]{12}$/;
        return { valid: residenceCardRegex.test(residenceCardNumber), error: residenceCardRegex.test(residenceCardNumber) ? null : "Invalid UK Residence Card format" };
    }

    //Canadian SIN (Social Insurance Number)
    static validateCanadianSIN(sin) {
        // Ensure the input is exactly 9 digits
        if (!/^\d{9}$/.test(sin)) {
            return { valid: false, error: "Invalid SIN format" };
        }
    
        // Luhn algorithm for SIN validation
        const luhnCheck = (sin) => {
            let sum = 0;

             // Loop through each digit in the SIN
            for (let i = 0; i < sin.length; i++) {
                let digit = parseInt(sin[i]);

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
    
         // Return validation result along with an error message if invalid
        return {
            valid: luhnCheck(sin),
            error: luhnCheck(sin) ? null : "Invalid SIN number"
        };
    }


    static validateMexicanCURP(curp) {
        // CURP format: 18 alphanumeric characters
        const curpRegex = /^[A-Z]{4}\d{6}[HM][A-Z]{5}\d{2}$/;
        if (!curpRegex.test(curp)) {
            return { valid: false, error: "Invalid CURP format" };
        }
    
        // Checksum validation
        const checksum = (curp) => {
            // Define the valid characters for the CURP, including numbers and letters
            const chars = "0123456789ABCDEFGHIJKLMNÑOPQRSTUVWXYZ";
    
            let sum = 0;
    
            // Iterate over the first 17 characters of the CURP
            for (let i = 0; i < 17; i++) {
                const char = curp[i]; // Get the current character
                const value = chars.indexOf(char); // Find its position in the `chars` string
                sum += value * (18 - i); // Multiply the character's value by its weight (18 - position)
            }
    
            // Calculate the checksum digit: 10 - (sum % 10)
            // If the result is 10, it wraps around to 0
            const checksumDigit = 10 - (sum % 10);
            if (checksumDigit === 10) {
                checksumDigit = 0;
            }
    
            // Compare the calculated checksum digit with the 18th character of the CURP
            return checksumDigit === parseInt(curp[17]);
        };
    
        // Return the validation result
        return {
            valid: checksum(curp),
            error: checksum(curp) ? null : "Invalid CURP checksum"
        };
    }
    

    static validateSouthKoreanRRN(rrn) {
        // Ensure the input is a 13-digit string
        // The RRN must be exactly 13 digits long and consist only of numbers.
        if (typeof rrn !== "string" || !/^\d{13}$/.test(rrn)) {
            return { valid: false, error: "Invalid RRN format" };
        }
    
        // Validate gender digit (7th digit: 1-4)
        // The 7th digit of the RRN indicates the gender and the century of birth:
        // 1 or 2: Male or female born in the 1900s
        // 3 or 4: Male or female born in the 2000s
        const genderDigit = parseInt(rrn[6]);
        if (genderDigit < 1 || genderDigit > 4) {
            return { valid: false, error: "Invalid gender digit in RRN" };
        }
    
        // Validate birthdate (first 6 digits: YYMMDD)
        // The first 6 digits represent the birthdate in the format YYMMDD.
        const year = parseInt(rrn.substring(0, 2));  // Extract the year (YY)
        const month = parseInt(rrn.substring(2, 4)); // Extract the month (MM)
        const day = parseInt(rrn.substring(4, 6));  // Extract the day (DD)
    
        // Determine the century based on the gender digit
        // If the gender digit is 1 or 2, the birth year is in the 1900s.
        // If the gender digit is 3 or 4, the birth year is in the 2000s.
        let fullYear;
        if (genderDigit === 1 || genderDigit === 2) {
            fullYear = 1900 + year; // Birth year is in the 1900s
        } else if (genderDigit === 3 || genderDigit === 4) {
            fullYear = 2000 + year; // Birth year is in the 2000s
        }
    
        // Validate the date
        // Create a Date object using the extracted year, month, and day.
        // Subtract 1 from the month because JavaScript months are 0-indexed (0 = January).
        const date = new Date(fullYear, month - 1, day);
        // Check if the date is valid by verifying if the Date object's time is NaN.
        if (isNaN(date.getTime())) {
            return { valid: false, error: "Invalid birthdate in RRN" };
        }
    
        // Check digit validation
        // The 13th digit is a check digit used to validate the RRN.
        // The check digit is calculated using a weighted sum of the first 12 digits.
        const weights = [2, 3, 4, 5, 6, 7, 8, 9, 2, 3, 4, 5]; // Weights for each digit
        // Calculate the weighted sum of the first 12 digits.
        const sum = weights.reduce((acc, weight, i) => acc + parseInt(rrn[i]) * weight, 0);
        // Calculate the remainder: (11 - (sum % 11)) % 10
        const remainder = (11 - (sum % 11)) % 10;
        // Compare the calculated remainder with the 13th digit (check digit).
        const isValid = remainder === parseInt(rrn[12]);
    
        // Return the validation result
        return {
            valid: isValid,
            error: isValid ? null : "Invalid RRN number"
        };
    }

    static validateGermanPersonalausweis(id) {
        // The German Personalausweis number must be exactly 10 digits long.
        // This regex checks if the input consists of exactly 10 digits.
        if (!/^\d{10}$/.test(id)) {
            return { valid: false, error: "Invalid format: Must be exactly 10 digits" };
        }
    
        // The official weighting factors for the checksum calculation are [7, 3, 1].
        // These weights are applied to the last 9 digits of the 10-digit number.
        const weights = [7, 3, 1, 7, 3, 1, 7, 3, 1];
    
        // The checksum will be calculated by multiplying each digit by its corresponding weight
        // and summing up the results.
        let checksum = 0;
    
        // Loop through the last 9 digits of the input (from index 1 to 9).
        // The first digit (index 0) is the issuing authority number and is not used in the checksum.
        for (let i = 1; i < 10; i++) {
            // Extract the current digit and convert it to a number.
            const digit = parseInt(id[i], 10);
    
            // If the character is not a valid digit, return an error.
            if (isNaN(digit)) {
                return { valid: false, error: "Invalid character detected" };
            }
    
            // Multiply the digit by its corresponding weight and add it to the checksum.
            // Note: `weights[i - 1]` is used because the weights array starts from index 0.
            checksum += digit * weights[i - 1];
        }
        // The expected check digit is the last digit of the checksum (checksum % 10).
        const expectedCheckDigit = checksum % 10;
    
        // The actual check digit is the 10th digit of the input (index 9).
        const actualCheckDigit = parseInt(id[9], 10);
    
        // If the actual check digit is not a number or does not match the expected check digit,
        // the input is invalid.
        if (isNaN(actualCheckDigit) || expectedCheckDigit !== actualCheckDigit) {
            return { valid: false, error: "Invalid checksum" };
        }
    
        // If all checks pass, the input is valid.
        return { valid: true, error: null };
    }


  
}
export default IDValidator;
