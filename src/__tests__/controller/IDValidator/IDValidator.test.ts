// tests/controllers/validationController.test.ts
import { Request, Response } from 'express';
import ValidationController from '../../../controllers/IDValidatorController';
import { ValidationResult } from '../../../types/validation';

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




  describe('validateCanadianSIN', () => {
    it('should return 400 if SIN number is missing', () => {
      mockRequest.params = {};
      ValidationController.validateCanadianSIN(mockRequest as Request, mockResponse as Response);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Canadian SIN Number is required.' });
    });
  
    // Valid SIN numbers (pass both format and Luhn check)
    it('should return 200 for valid SIN that passes Luhn check', () => {
      mockRequest.params = { sinNumber: '046454286' }; // Valid SIN
      ValidationController.validateCanadianSIN(mockRequest as Request, mockResponse as Response);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
    });
  
    it('should return 200 for another valid SIN that passes Luhn check', () => {
      mockRequest.params = { sinNumber: '123456782' }; // Valid test SIN from Service Canada
      ValidationController.validateCanadianSIN(mockRequest as Request, mockResponse as Response);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
    });
  
    // Invalid format tests
    it('should return 400 for SIN with 8 digits', () => {
      mockRequest.params = { sinNumber: '12345678' }; // Too short
      ValidationController.validateCanadianSIN(mockRequest as Request, mockResponse as Response);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Invalid SIN format' });
    });
  
    it('should return 400 for SIN with 10 digits', () => {
      mockRequest.params = { sinNumber: '1234567890' }; // Too long
      ValidationController.validateCanadianSIN(mockRequest as Request, mockResponse as Response);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Invalid SIN format' });
    });
  
    it('should return 400 for SIN with letters', () => {
      mockRequest.params = { sinNumber: 'A23456789' }; // Contains letter
      ValidationController.validateCanadianSIN(mockRequest as Request, mockResponse as Response);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Invalid SIN format' });
    });
  
    it('should return 400 for SIN with special characters', () => {
      mockRequest.params = { sinNumber: '123-456-789' }; // Contains hyphens
      ValidationController.validateCanadianSIN(mockRequest as Request, mockResponse as Response);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Invalid SIN format' });
    });
  
    it('should return 400 for SIN with spaces', () => {
      mockRequest.params = { sinNumber: '123 456 789' }; // Contains spaces
      ValidationController.validateCanadianSIN(mockRequest as Request, mockResponse as Response);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Invalid SIN format' });
    });
  
    it('should return 400 for empty string', () => {
      mockRequest.params = { sinNumber: '' };
      ValidationController.validateCanadianSIN(mockRequest as Request, mockResponse as Response);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Canadian SIN Number is required.' });
    });
  
    // Valid format but invalid Luhn check
    it('should return 400 for SIN with correct format but failing Luhn check', () => {
      mockRequest.params = { sinNumber: '123456789' }; // Invalid check digit
      ValidationController.validateCanadianSIN(mockRequest as Request, mockResponse as Response);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Invalid SIN number' });
    });
  
    it('should return 400 for another SIN with correct format but failing Luhn check', () => {
      mockRequest.params = { sinNumber: '987654321' }; // Invalid check digit
      ValidationController.validateCanadianSIN(mockRequest as Request, mockResponse as Response);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Invalid SIN number' });
    });
  
    // Edge cases
    it('should return 400 for SIN with leading/trailing whitespace', () => {
      mockRequest.params = { sinNumber: ' 046454286 ' }; // Valid number but with whitespace
      ValidationController.validateCanadianSIN(mockRequest as Request, mockResponse as Response);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Invalid SIN format' });
    });
  
    // Security test cases
    it('should return 400 for SIN with SQL injection attempt', () => {
      mockRequest.params = { sinNumber: "12345678' OR '1'='1" };
      ValidationController.validateCanadianSIN(mockRequest as Request, mockResponse as Response);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Invalid SIN format' });
    });
  
    it('should return 400 for SIN with XSS attempt', () => {
      mockRequest.params = { sinNumber: '<script>alert(1)</script>' };
      ValidationController.validateCanadianSIN(mockRequest as Request, mockResponse as Response);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Invalid SIN format' });
    });
  
    // Testing known invalid prefixes
    it('should return 400 for SIN starting with 0 (temporary SIN)', () => {
      mockRequest.params = { sinNumber: '012345678' }; // Temporary SIN (should still pass format check but fail Luhn)
      ValidationController.validateCanadianSIN(mockRequest as Request, mockResponse as Response);
      // Note: This test assumes we're not specifically blocking temporary SINs
      // If your business logic rejects temporary SINs, modify the test accordingly
      expect(mockResponse.status).toHaveBeenCalledWith(400);
    });
  
    // Testing Luhn algorithm edge cases
    it('should return 200 for SIN requiring digit sum adjustment (9*2=18 → 1+8=9)', () => {
      mockRequest.params = { sinNumber: '453201511' }; // Contains 9 which when doubled becomes 18
      ValidationController.validateCanadianSIN(mockRequest as Request, mockResponse as Response);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
    });
  
    it('should return 200 for SIN with all digits doubled below 9', () => {
      mockRequest.params = { sinNumber: '121212121' }; // All doubled digits remain single-digit
      ValidationController.validateCanadianSIN(mockRequest as Request, mockResponse as Response);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
    });
  
    // Testing all possible check digits
    it('should return 200 for SIN with check digit 0', () => {
      mockRequest.params = { sinNumber: '046454280' }; // Valid SIN with check digit 0
      ValidationController.validateCanadianSIN(mockRequest as Request, mockResponse as Response);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
    });
  });




  describe('validateMexicanCURP', () => {
    it('should return 400 if CURP number is missing', () => {
      mockRequest.params = {};
      ValidationController.validateMexicanCURP(mockRequest as Request, mockResponse as Response);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Mexican CURP Number is required.' });
    });
  
    // Valid CURP formats (passing both format and checksum validation)
    it('should return 200 for valid CURP with correct checksum', () => {
      mockRequest.params = { curpNumber: 'XEXX010101HNEXXXA8' }; // Valid format and checksum
      ValidationController.validateMexicanCURP(mockRequest as Request, mockResponse as Response);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
    });
  
    it('should return 200 for another valid CURP with correct checksum', () => {
      mockRequest.params = { curpNumber: 'BADD110313HDFJLL02' }; // Valid format and checksum
      ValidationController.validateMexicanCURP(mockRequest as Request, mockResponse as Response);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
    });
  
    // Invalid format tests
    it('should return 400 for CURP with 17 characters', () => {
      mockRequest.params = { curpNumber: 'GODE561231HMNLNN0' }; // Too short
      ValidationController.validateMexicanCURP(mockRequest as Request, mockResponse as Response);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Invalid CURP format' });
    });
  
    it('should return 400 for CURP with 19 characters', () => {
      mockRequest.params = { curpNumber: 'GODE561231HMNLNN099' }; // Too long
      ValidationController.validateMexicanCURP(mockRequest as Request, mockResponse as Response);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Invalid CURP format' });
    });
  
    it('should return 400 for CURP with lowercase letters', () => {
      mockRequest.params = { curpNumber: 'gode561231hmnlnn09' }; // Lowercase
      ValidationController.validateMexicanCURP(mockRequest as Request, mockResponse as Response);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Invalid CURP format' });
    });
  
    it('should return 400 for CURP with invalid gender indicator', () => {
      mockRequest.params = { curpNumber: 'GODE561231XNJLLL09' }; // X instead of H/M
      ValidationController.validateMexicanCURP(mockRequest as Request, mockResponse as Response);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Invalid CURP format' });
    });
  
    it('should return 400 for CURP with special characters', () => {
      mockRequest.params = { curpNumber: 'GODE-561231-HMNLNN09' }; // Hyphens
      ValidationController.validateMexicanCURP(mockRequest as Request, mockResponse as Response);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Invalid CURP format' });
    });
  
    it('should return 400 for empty string', () => {
      mockRequest.params = { curpNumber: '' };
      ValidationController.validateMexicanCURP(mockRequest as Request, mockResponse as Response);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Mexican CURP Number is required.' });
    });
  
    // Valid format but invalid checksum
    it('should return 400 for CURP with correct format but invalid checksum', () => {
      mockRequest.params = { curpNumber: 'GODE561231HMNLNN08' }; // Checksum should be 9
      ValidationController.validateMexicanCURP(mockRequest as Request, mockResponse as Response);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Invalid CURP checksum' });
    });
  
    // Edge cases
    it('should return 400 for CURP with leading/trailing whitespace', () => {
      mockRequest.params = { curpNumber: ' GODE561231HMNLNN09 ' }; // Whitespace
      ValidationController.validateMexicanCURP(mockRequest as Request, mockResponse as Response);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Invalid CURP format' });
    });
  
    // Security test cases
    it('should return 400 for CURP with SQL injection attempt', () => {
      mockRequest.params = { curpNumber: "GODE' OR '1'='1" };
      ValidationController.validateMexicanCURP(mockRequest as Request, mockResponse as Response);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Invalid CURP format' });
    });
  
    it('should return 400 for CURP with XSS attempt', () => {
      mockRequest.params = { curpNumber: '<script>alert(1)</script>' };
      ValidationController.validateMexicanCURP(mockRequest as Request, mockResponse as Response);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Invalid CURP format' });
    });
  
    // Testing checksum edge cases
    it('should return 200 for CURP with checksum digit 0', () => {
      mockRequest.params = { curpNumber: 'AAAA000000HDFLRN00' }; // Checksum 0
      ValidationController.validateMexicanCURP(mockRequest as Request, mockResponse as Response);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
    });
  
    it('should return 400 for CURP with incorrect checksum digit 0', () => {
      mockRequest.params = { curpNumber: 'XEXX010101MNEXXA07' }; // Should be 0
      ValidationController.validateMexicanCURP(mockRequest as Request, mockResponse as Response);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Invalid CURP checksum' });
    });
  
    // Testing all segments of the CURP
    it('should return 400 for CURP with invalid birth date', () => {
      mockRequest.params = { curpNumber: 'XEXX013201MNEXXA08' }; // Invalid day 31
      ValidationController.validateMexicanCURP(mockRequest as Request, mockResponse as Response);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Invalid CURP format' });
    });
  
    it('should return 400 for CURP with invalid state code', () => {
      mockRequest.params = { curpNumber: 'GODE561231XXNLNN09' }; // XX state code
      ValidationController.validateMexicanCURP(mockRequest as Request, mockResponse as Response);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Invalid CURP format' });
    });
  
    // Testing checksum calculation with different weights
    it('should properly calculate checksum with varying character values', () => {
      mockRequest.params = { curpNumber: 'AÑAE000101HDFLRN09' }; // Edge case for checksum
      ValidationController.validateMexicanCURP(mockRequest as Request, mockResponse as Response);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
    });
  
    // Testing Ñ character (special case in Mexican alphabet)
    it('should return 200 for CURP containing Ñ character', () => {
      mockRequest.params = { curpNumber: 'ÑOLE820115HDFLRN05' }; // Contains Ñ
      ValidationController.validateMexicanCURP(mockRequest as Request, mockResponse as Response);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
    });
  });










  describe('validateSouthKoreanRRN', () => {
    // Valid RRN tests
    it('should validate a 13-digit male RRN born in 1968 (1900s)', () => {
      mockRequest.params = { rrnNumber: '6801011000015' }; // Male born Jan 1, 1968 with valid check digit
      ValidationController.validateSouthKoreanRRN(mockRequest as Request, mockResponse as Response);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
    });
  
    it('should validate a 13-digit female RRN born in 1968 (1900s)', () => {
      mockRequest.params = { rrnNumber: '6801012000018' }; // Female born Jan 1, 1968 with valid check digit
      ValidationController.validateSouthKoreanRRN(mockRequest as Request, mockResponse as Response);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
    });
  
    it('should validate a male RRN born in 2005 (2000s)', () => {
      mockRequest.params = { rrnNumber: '0501013000010' }; // Male born Jan 1, 2005 with valid check digit
      ValidationController.validateSouthKoreanRRN(mockRequest as Request, mockResponse as Response);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
    });
  
    it('should validate a female RRN born in 2005 (2000s)', () => {
      mockRequest.params = { rrnNumber: '0501014000012' }; // Female born Jan 1, 2005 with valid check digit
      ValidationController.validateSouthKoreanRRN(mockRequest as Request, mockResponse as Response);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
    });
  
    it('should validate a RRN with February 29th date for leap year 2000', () => {
      mockRequest.params = { rrnNumber: '0002293000017' }; // Valid leap date Feb 29, 2000
      ValidationController.validateSouthKoreanRRN(mockRequest as Request, mockResponse as Response);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
    });
  
    // Invalid format tests
    it('should reject RRN with incorrect length (12 digits)', () => {
      mockRequest.params = { rrnNumber: '680101100001' }; // Missing last digit
      ValidationController.validateSouthKoreanRRN(mockRequest as Request, mockResponse as Response);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Invalid RRN format' });
    });
  
    it('should reject RRN with incorrect length (14 digits)', () => {
      mockRequest.params = { rrnNumber: '68010110000181' }; // Extra digits
      ValidationController.validateSouthKoreanRRN(mockRequest as Request, mockResponse as Response);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Invalid RRN format' });
    });
  
    it('should reject RRN containing non-numeric characters', () => {
      mockRequest.params = { rrnNumber: '680101A000018' }; // Alphabetic character
      ValidationController.validateSouthKoreanRRN(mockRequest as Request, mockResponse as Response);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Invalid RRN format' });
    });
  
    it('should reject empty RRN input', () => {
      mockRequest.params = { rrnNumber: '' };
      ValidationController.validateSouthKoreanRRN(mockRequest as Request, mockResponse as Response);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'South Korean RRN Number is required.' });
    });
  
    // Invalid gender digit tests
    it('should reject RRN with invalid gender digit (0)', () => {
      mockRequest.params = { rrnNumber: '6801010000018' }; // Gender digit must be 1-4
      ValidationController.validateSouthKoreanRRN(mockRequest as Request, mockResponse as Response);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Invalid gender digit in RRN' });
    });
  
    it('should reject RRN with invalid gender digit (5)', () => {
      mockRequest.params = { rrnNumber: '6801015000015' }; // Gender digit must be 1-4
      ValidationController.validateSouthKoreanRRN(mockRequest as Request, mockResponse as Response);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Invalid gender digit in RRN' });
    });
  
    // Invalid birthdate tests
    it('should reject RRN with invalid month (13)', () => {
      mockRequest.params = { rrnNumber: '6813011000018' }; // Month must be 1-12
      ValidationController.validateSouthKoreanRRN(mockRequest as Request, mockResponse as Response);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Invalid birthdate in RRN' });
    });
  
    it('should reject RRN with invalid day (32)', () => {
      mockRequest.params = { rrnNumber: '6801321000018' }; // Day exceeds maximum
      ValidationController.validateSouthKoreanRRN(mockRequest as Request, mockResponse as Response);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Invalid birthdate in RRN' });
    });
  
    it('should reject RRN with February 29th for non-leap year (2001)', () => {
      mockRequest.params = { rrnNumber: '0102291000018' }; // 2001 was not a leap year
      ValidationController.validateSouthKoreanRRN(mockRequest as Request, mockResponse as Response);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Invalid birthdate in RRN' });
    });
  
    // Invalid check digit tests
    it('should reject RRN with incorrect check digit', () => {
      mockRequest.params = { rrnNumber: '6801011000016' }; // Last digit should be 5
      ValidationController.validateSouthKoreanRRN(mockRequest as Request, mockResponse as Response);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Invalid RRN number' });
    });
  
    // Edge cases
    it('should reject RRN with surrounding whitespace', () => {
      mockRequest.params = { rrnNumber: ' 6801011000015 ' };
      ValidationController.validateSouthKoreanRRN(mockRequest as Request, mockResponse as Response);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Invalid RRN format' });
    });
  
    // Security test cases
    it('should reject RRN with SQL injection attempt', () => {
      mockRequest.params = { rrnNumber: "680101100001' OR '1'='1" };
      ValidationController.validateSouthKoreanRRN(mockRequest as Request, mockResponse as Response);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Invalid RRN format' });
    });
  
    it('should reject RRN with XSS attempt', () => {
      mockRequest.params = { rrnNumber: '<script>alert(1)</script>' };
      ValidationController.validateSouthKoreanRRN(mockRequest as Request, mockResponse as Response);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Invalid RRN format' });
    });
});











});