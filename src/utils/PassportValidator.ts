interface ValidationResult {
    valid: boolean;
    error?: string;
    status: number;
}

// Define all valid country codes as a union type
type CountryCode = keyof typeof PassportValidator.passportPatterns;

class PassportValidator {
    // Passport patterns dictionary with strict country code typing
    public static readonly passportPatterns = {
        'BR': /^[A-Z]{2}\d{6}$/, // Brazil
        'UK': /^[A-Z0-9]{9}$/, // United Kingdom
        'US': /^\d{9}$/, // United States
        'JP': /^[A-Z]{2}\d{7}$/, // Japan
        'KR': /^[A-Z]{2}\d{7}$/, // South Korea
        'CN': /^G\d{8}$|^E\d{7}$/, // China
        'SG': /^[A-Z]\d{7}[A-Z]$/, // Singapore
        'AR': /^[A-Z]{3}\d{6}$/, // Argentina
        'FR': /^\d{2}[A-Z]{2}\d{5}$/, // France
        'DE': /^[CFGHJKLMNPRTVWXYZ][CFGHJKLMNPRTVWXYZ0-9]{8}$/, // Germany
        'RU': /^\d{9}$/, // Russia
        'CA': /^[A-Z]{2}\d{6}$/, // Canada
        'AU': /^[A-Z]\d{7}$/, // Australia
        'IN': /^[A-Z]\d{7}$/, // India
        'IT': /^[A-Z]{2}\d{7}$/, // Italy
        'ES': /^[A-Z]{2}\d{6}$/, // Spain
        'MX': /^\d{8}$|^[A-Z]{2}\d{6}$|^[A-Z0-9]{9}$/, // Mexico
        'TR': /^[A-Z]\d{8}$/, // Turkey
        'SA': /^[A-Z]{2}\d{7}$/, // Saudi Arabia
        'NL': /^[A-Z]{2}\d{7}$/, // Netherlands
        'SE': /^\d{8}$/, // Sweden
        'CH': /^[A-Z]\d{7}$/, // Switzerland
        'NZ': /^[A-Z]{2}\d{6}$/, // New Zealand
        'ZA': /^[A-Z]{2}\d{7}$/, // South Africa
        'AE': /^\d{9}$/, // United Arab Emirates
        'TH': /^[A-Z]\d{7}$/, // Thailand
        'ID': /^[A-Z]\d{7}$/, // Indonesia
        'MY': /^[A-Z]\d{8}$/, // Malaysia
        'PH': /^[A-Z]\d{7}$/, // Philippines
        'EG': /^[A-Z]\d{8}$/, // Egypt
        'GR': /^[A-Z]{2}\d{7}$/, // Greece
        'PL': /^[A-Z]{2}\d{7}$/, // Poland
        'BE': /^[A-Z]{2}\d{6}$/, // Belgium
        'AT': /^[A-Z]\d{7}$/, // Austria
        'NO': /^\d{8}$/, // Norway (checksum validated separately)
        'DK': /^\d{9}$/, // Denmark
        'FI': /^\d{8}$/, // Finland (checksum validated separately)
        'IE': /^[A-Z]{2}\d{7}$/, // Ireland
        'IL': /^\d{7}$|^\d{8}$/, // Israel
        'PT': /^[A-Z]{2}\d{6}$/, // Portugal
        'HU': /^[A-Z]{2}\d{6}$/, // Hungary
        'CZ': /^[A-Z]{2}\d{7}$/, // Czech Republic
        'SK': /^[A-Z]{2}\d{7}$/, // Slovakia
        'RO': /^[A-Z]{2}\d{7}$/, // Romania
        'BG': /^[A-Z]{2}\d{7}$/, // Bulgaria
        'HR': /^[A-Z]{2}\d{7}$/, // Croatia
        'SI': /^[A-Z]{2}\d{7}$/, // Slovenia
        'LT': /^[A-Z]{2}\d{7}$/, // Lithuania
        'LV': /^[A-Z]{2}\d{7}$/, // Latvia
        'EE': /^[A-Z]{2}\d{7}$/, // Estonia
        'IS': /^[A-Z]{2}\d{7}$/, // Iceland
        'MT': /^[A-Z]{2}\d{7}$/, // Malta
        'CY': /^[A-Z]{2}\d{7}$/, // Cyprus
    } as const;

    // Countries requiring special checksum validation
    private static readonly countriesWithChecksum: ReadonlySet<CountryCode> = new Set([
        'FR', 'DE', 'RU', 'UK', 'US', 'NL', 'SE', 'CH', 'IE', 'IT', 'PL', 'GR', 'NO', 'FI'
    ]);

    static validatePassport(passportNumber: string, countryCode: string): ValidationResult {
        // Input validation
        if (typeof passportNumber !== 'string' || passportNumber.trim().length === 0) {
            return {
                valid: false,
                error: "Passport number is required and must be a non-empty string.",
                status: 400,
            };
        }
        if (typeof countryCode !== 'string' || countryCode.trim().length !== 2) {
            return {
                valid: false,
                error: "Country code must be a 2-character string.",
                status: 400,

            };
        }

        // Normalize input
        const normalizedPassport = passportNumber.trim().toUpperCase();
        const normalizedCountry = countryCode.toUpperCase() as CountryCode;

        // Validate passport number characters
        if (!/^[A-Z0-9]+$/.test(normalizedPassport)) {
            return {
                valid: false,
                error: "Passport number contains invalid characters.",
                status: 400,

            };
        }

        // Validate country code exists in patterns
        if (!(normalizedCountry in PassportValidator.passportPatterns)) {
            return {
                valid: false,
                error: "Invalid or unsupported country code.",
                status: 400,

            };
        }

        // Validate format against country pattern
        if (!PassportValidator.passportPatterns[normalizedCountry].test(normalizedPassport)) {
            return {
                valid: false,
                error: "Passport number does not match the country's format.",
                status: 400,

            };
        }

        // Apply checksum validation if applicable
        if (PassportValidator.countriesWithChecksum.has(normalizedCountry)) {
            if (normalizedCountry === 'NO' || normalizedCountry === 'FI') {
                if (!this.validateMod11Checksum(normalizedPassport)) {
                    return {
                        valid: false,
                        error: "Invalid Mod-11 checksum.",
                        status: 400,

                    };
                }
            } else {
                if (!this.validateICAOChecksum(normalizedPassport)) {
                    return {
                        valid: false,
                        error: "Invalid ICAO checksum.",
                        status: 400,

                    };
                }
            }
        }

        return {
            valid: true,
            error: undefined,
            status: 200,

        };
    }

    /*
      Validates the ICAO checksum for a passport number.
      The ICAO checksum is calculated using a weighted sum of characters in the passport number
      (excluding the last character, which is the checksum digit itself). The weights cycle through
      [7, 3, 1], and each character is converted to a numeric value: digits as-is, and letters as
      A=10, B=11, ..., Z=35.
     */
    private static validateICAOChecksum(number: string): boolean {
        const weights = [7, 3, 1]; // Weights used for the checksum calculation
        let sum = 0;

        // Iterate over all characters except the last (checksum digit)
        for (let i = 0; i < number.length - 1; i++) {
            const char = number[i];
            let value: number;

            // Convert alphabetic characters (A-Z) to their numeric equivalents (A=10, ..., Z=35)
            if (/[A-Z]/.test(char)) {
                value = char.charCodeAt(0) - 55; // A=10, B=11, ..., Z=35
            }
            // Convert numeric characters (0-9) to their numeric value
            else if (/\d/.test(char)) {
                value = parseInt(char, 10);
            }
            // If the character is invalid, return false
            else {
                return false; // Invalid character for ICAO checksum
            }

            // Add the weighted value to the sum
            sum += value * weights[i % 3];
        }

        // Calculate the expected checksum as the remainder of the sum divided by 10
        const expectedChecksum = sum % 10;

        // Parse the actual checksum digit (last character of the number)
        const actualChecksum = parseInt(number[number.length - 1], 10);

        // Return true if the expected checksum matches the actual checksum, otherwise false
        return expectedChecksum === actualChecksum;
    }

    /*
      Validates the Mod-11 checksum for a passport number.
      The Mod-11 checksum is calculated using a weighted sum of digits in the passport number
      (excluding the last digit, which is the checksum digit). The weights cycle through
      [7, 3, 1, 7, 3, 1, 7, 3]. The expected checksum is the remainder of the sum divided by 11.
      If the remainder is 10, the checksum is considered invalid.
     */
    private static validateMod11Checksum(number: string): boolean {
        const weights = [7, 3, 1, 7, 3, 1, 7, 3]; // Weights used for the checksum calculation
        let sum = 0;

        // Ensure the passport number contains only digits
        if (!/^\d+$/.test(number)) {
            return false;
        }

        // Iterate over all digits except the last (checksum digit)
        for (let i = 0; i < number.length - 1; i++) {
            const value = parseInt(number[i], 10); // Convert the character to an integer
            sum += value * weights[i % weights.length]; // Add the weighted value to the sum
        }

        // Calculate the expected checksum as the remainder of the sum divided by 11
        const expectedChecksum = sum % 11;

        // If the expected checksum is 10, it is considered invalid
        if (expectedChecksum === 10) return false;

        // Parse the actual checksum digit (last character of the number)
        const actualChecksum = parseInt(number[number.length - 1], 10);

        // Return true if the expected checksum matches the actual checksum, otherwise false
        return expectedChecksum === actualChecksum;
    }
}

export default PassportValidator;