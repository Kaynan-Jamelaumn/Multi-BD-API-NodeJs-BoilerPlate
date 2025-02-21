import PassportValidator from "./passPortValidator";

class IDValidator {
    static validateFields(userData, options = {required: true}) 
    
        {const {username,name,surname,email,password,role} = userData;
        const {required} = options;

        // Validate required fields
        if (required && (!name || !surname || !email || !password || !username)) {
            return {
                error: 'All fields (username, name, surname, email, password) are required.',
                status: 400
            };
        }

        // Validate name and surname length
        if (name && name.length < 2) {
            return {
                error: 'Name must be at least 2 characters long.',
                status: 400
            };
        }
        if (surname && surname.length < 2) {
            return {
                error: 'Surname must be at least 2 characters long.',
                status: 400
            };
        }
        if (username && username.length < 2) {
            return {
                error: 'Username must be at least 2 characters long.',
                status: 400
            };
        }


        // Validate email format
        if (email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return {
                    error: 'Invalid email format.',
                    status: 400
                };
            }
        }

        // Validate password length and strength
        if (password) { //const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/; <- password regex including special chars 
            const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;
            if (!passwordRegex.test(password)) {
                return {
                    error: 'Password must be at least 8 characters long and include an uppercase letter, a lowercase letter, and a number.',
                    status: 400,
                };
            }
        }

        // Validate role
        if (role && !['User', 'Admin'].includes(role)) {
            return {
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
        if (!cpfRegex.test(cpfNumber)) return false;

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
        if (remainder !== parseInt(cpfNumber.charAt(9))) return false;

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
        if (remainder !== parseInt(cpfNumber.charAt(10))) return false;

        // If both checks pass, the CPF is valid
        return true;
    }
  
}
export default IDValidator;