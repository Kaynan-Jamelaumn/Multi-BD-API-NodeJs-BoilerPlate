// tests/controllers/validationController.test.ts
import { Request, Response } from 'express';
import ValidationController from '../../controllers/IDValidatorController';
import { ValidationResult } from '../../types/validation';

describe('ValidationController', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  const responseResult = {
    json: jest.fn(),
    status: jest.fn().mockReturnThis(),
  };

  beforeEach(() => {
    mockRequest = {};
    mockResponse = responseResult;
    jest.clearAllMocks();
  });

  // Field Validation Tests
  describe('validateFields', () => {
    const validUserData = {
      username: 'validUser',
      name: 'Valid',
      surname: 'User',
      email: 'valid@example.com',
      password: 'ValidPass123!',
      role: 'User'
    };
  
    // Required fields validation
    it('should return 400 for missing all required fields', () => {
      mockRequest.body = {};
      ValidationController.validateFields(mockRequest as Request, mockResponse as Response);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Missing required fields: username, name, surname, email, password'
      });
    });
  
    ['username', 'name', 'surname', 'email', 'password'].forEach(field => {
      it(`should return 400 when ${field} is missing`, () => {
        const invalidData = { ...validUserData };
        delete invalidData[field as keyof typeof invalidData];
        
        mockRequest.body = invalidData;
        ValidationController.validateFields(mockRequest as Request, mockResponse as Response);
        
        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.json).toHaveBeenCalledWith({
          error: `Missing required fields: ${field}`
        });
      });
    });
  
    // Email validation
    describe('email validation', () => {
      const invalidEmails = [
        'missing-at.com',
        'invalid@domain',
        'double@@domain.com',
        'invalid@-domain.com',
        ' spaces@domain.com',
        'invalid@domain..com'
      ];
  
      invalidEmails.forEach(email => {
        it(`should return 400 for invalid email: ${email}`, () => {
          mockRequest.body = { ...validUserData, email };
          ValidationController.validateFields(mockRequest as Request, mockResponse as Response);
          expect(mockResponse.status).toHaveBeenCalledWith(400);
          expect(mockResponse.json).toHaveBeenCalledWith({
            error: 'Invalid email format.'
          });
        });
      });
  
      const validEmails = [
        'valid.email+tag@sub.domain.co.uk',
        'name@123.45.67.89',
        'user.name@domain.travel',
        'UPPERCASE@DOMAIN.COM'
      ];
  
      validEmails.forEach(email => {
        it(`should accept valid email: ${email}`, () => {
          mockRequest.body = { ...validUserData, email };
          ValidationController.validateFields(mockRequest as Request, mockResponse as Response);
          expect(mockResponse.status).toHaveBeenCalledWith(200);
          expect(mockResponse.json).toHaveBeenCalledWith({
            message: 'Validation successful'
          });
        });
      });
    });
  
    // Password validation
    describe('password validation', () => {
      const passwordCases = [
        {
          description: 'missing uppercase',
          password: 'lowercase123!',
          error: 'Password must be at least 8 characters long and include an uppercase letter, a lowercase letter, and a number.'
        },
        {
          description: 'missing lowercase',
          password: 'UPPERCASE123!',
          error: 'Password must be at least 8 characters long and include an uppercase letter, a lowercase letter, and a number.'
        },
        {
          description: 'missing number',
          password: 'NoNumbersHere!',
          error: 'Password must be at least 8 characters long and include an uppercase letter, a lowercase letter, and a number.'
        },
        {
          description: 'too short',
          password: 'Short1!',
          error: 'Password must be at least 8 characters long and include an uppercase letter, a lowercase letter, and a number.'
        },
        /*
        {
          description: 'missing special character',
          password: 'MissingSpecial1',
          error: 'Password must be at least 8 characters long and include an uppercase letter, a lowercase letter, and a number.'
        }
        */
      ];
  
      passwordCases.forEach(({ description, password, error }) => {
        it(`should return 400 for password ${description}`, () => {
          mockRequest.body = { ...validUserData, password };
          ValidationController.validateFields(mockRequest as Request, mockResponse as Response);
          expect(mockResponse.status).toHaveBeenCalledWith(400);
          expect(mockResponse.json).toHaveBeenCalledWith({ error });
        });
      });
    });
  
    // Length validation
    describe('field length validation', () => {
      it('should return 400 for 1-character name', () => {
        mockRequest.body = { ...validUserData, name: 'A' };
        ValidationController.validateFields(mockRequest as Request, mockResponse as Response);
        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.json).toHaveBeenCalledWith({
          error: 'Name must be at least 2 characters long.'
        });
      });
  
      it('should return 400 for 1-character surname', () => {
        mockRequest.body = { ...validUserData, surname: 'B' };
        ValidationController.validateFields(mockRequest as Request, mockResponse as Response);
        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.json).toHaveBeenCalledWith({
          error: 'Surname must be at least 2 characters long.'
        });
      });
  
      it('should return 400 for 1-character username', () => {
        mockRequest.body = { ...validUserData, username: 'a' };
        ValidationController.validateFields(mockRequest as Request, mockResponse as Response);
        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.json).toHaveBeenCalledWith({
          error: 'Username must be at least 2 characters long.'
        });
      });
    });
  
    // Role validation
    it('should return 400 for invalid role', () => {
      mockRequest.body = { ...validUserData, role: 'InvalidRole' };
      ValidationController.validateFields(mockRequest as Request, mockResponse as Response);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Invalid role. Allowed values are "User" or "Admin".'
      });
    });
  
    // Multiple validation errors
    it('should return first error when multiple fields are invalid', () => {
      mockRequest.body = {
        ...validUserData,
        name: 'A',
        email: 'invalid-email',
        password: 'weak'
      };
      ValidationController.validateFields(mockRequest as Request, mockResponse as Response);
      
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Name must be at least 2 characters long.'
      });
    });
  });



  
  // CPF Validation Tests
  describe('validateCPF', () => {
    it('should return 200 for valid formatted CPF', () => {
      mockRequest.params = { cpfNumber: '453.178.287-91' };
      ValidationController.validateCPF(mockRequest as Request, mockResponse as Response);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
    });

    it('should return 400 for non-numeric CPF', () => {
      mockRequest.params = { cpfNumber: '453a7828791' };
      ValidationController.validateCPF(mockRequest as Request, mockResponse as Response);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Invalid CPF format' });
    });

    it('should return 400 for CPF with leading zeros', () => {
      mockRequest.params = { cpfNumber: '00000000000' };
      ValidationController.validateCPF(mockRequest as Request, mockResponse as Response);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Invalid CPF checksum' });
    });
  });


  describe('validateRG', () => {
    // Valid RG Tests
    it('should return 200 for valid formatted RG with check digit', () => {
      mockRequest.params = { rgNumber: '12.345.678-9' }; // Valid check digit
      ValidationController.validateRG(mockRequest as Request, mockResponse as Response);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
  });
  
  it('should return 200 for valid unformatted RG with check digit', () => {
      mockRequest.params = { rgNumber: '123456789' }; // Valid check digit
      ValidationController.validateRG(mockRequest as Request, mockResponse as Response);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
  });

  it('should return 200 for valid RG with "X" check digit', () => {
    mockRequest.params = { rgNumber: '00000023-X' }; // Valid check digit 'X'
    ValidationController.validateRG(mockRequest as Request, mockResponse as Response);
    expect(mockResponse.status).toHaveBeenCalledWith(200);
});
    // Invalid Format Tests
    it('should return 400 for non-numeric characters in RG', () => {
      mockRequest.params = { rgNumber: '12a3456789' };
      ValidationController.validateRG(mockRequest as Request, mockResponse as Response);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Invalid RG format' });
    });
  
    it('should return 400 for incorrect punctuation placement', () => {
      mockRequest.params = { rgNumber: '123-45.6789' };
      ValidationController.validateRG(mockRequest as Request, mockResponse as Response);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Invalid RG format' });
    });
  
    it('should return 400 for RG with missing check digit', () => {
      mockRequest.params = { rgNumber: '12345678' }; // Current code allows this, test will fail until regex is fixed
      ValidationController.validateRG(mockRequest as Request, mockResponse as Response);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Invalid RG format' });
    });
  
    // Check Digit Validity Tests (Requires checksum implementation)
    it('should return 400 for invalid check digit', () => {
      mockRequest.params = { rgNumber: '12.345.678-0' }; // Assuming 9 is correct
      ValidationController.validateRG(mockRequest as Request, mockResponse as Response);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Invalid RG checksum' });
    });
  
    // Special Case Tests
    it('should return 400 for RG with all zeros', () => {
      mockRequest.params = { rgNumber: '000000000' }; // 9 zeros
      ValidationController.validateRG(mockRequest as Request, mockResponse as Response);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Invalid RG checksum' });
  });
    it('should return 400 for RG with repeating digits', () => {
      mockRequest.params = { rgNumber: '111111111' };
      ValidationController.validateRG(mockRequest as Request, mockResponse as Response);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Invalid RG checksum' });
    });
  }); 




  describe('validateSUS', () => {
    it('should return 400 if SUS number is not provided', () => {
      mockRequest.params = {};
      ValidationController.validateSUS(mockRequest as Request, mockResponse as Response);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'SUS number is required.' });
    });
  
    it('should return 200 for valid unformatted SUS number', () => {
      mockRequest.params = { susNumber: '123456789012348' }; // valid (sum = 473 → 473 % 11 = 0)
      ValidationController.validateSUS(mockRequest as Request, mockResponse as Response);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
    });
  
    it('should return 400 for non-numeric characters', () => {
      mockRequest.params = { susNumber: '1234x6789012345' };
      ValidationController.validateSUS(mockRequest as Request, mockResponse as Response);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Invalid SUS format' });
    });
  
    it('should return 400 for incorrect length (14 digits)', () => {
      mockRequest.params = { susNumber: '12345678901234' };
      ValidationController.validateSUS(mockRequest as Request, mockResponse as Response);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Invalid SUS format' });
    });
  
    it('should return 400 for formatted number', () => {
      mockRequest.params = { susNumber: '123.4567.8901.2348' };
      ValidationController.validateSUS(mockRequest as Request, mockResponse as Response);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Invalid SUS format' });
    });
  
    it('should return 400 for invalid checksum', () => {
      mockRequest.params = { susNumber: '111111111111111' }; // sum = 120 → 120 % 11 = 10
      ValidationController.validateSUS(mockRequest as Request, mockResponse as Response);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Invalid SUS checksum' });
    });
  
    it('should return 200 for zero-padded valid number', () => {
      mockRequest.params = { susNumber: '000000000000000' }; // sum = 0 → 0 % 11 = 0
      ValidationController.validateSUS(mockRequest as Request, mockResponse as Response);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
    });
  
    it('should return 400 for correct length but wrong checksum', () => {
      mockRequest.params = { susNumber: '123456789012345' }; // Soma = 470 → 470 % 11 = 8
      ValidationController.validateSUS(mockRequest as Request, mockResponse as Response);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Invalid SUS checksum' });
    });
  });

});