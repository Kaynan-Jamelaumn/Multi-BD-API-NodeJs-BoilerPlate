// tests/controllers/UnitedStatesID.test.ts
import { Request, Response } from 'express';
import ValidationController from '../../../controllers/IDValidatorController';
import { ValidationResult } from '../../../types/validation';

describe('UnitedStatesID Validation', () => {
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


    describe('validateUSDriversLicense', () => {
      it('should return 400 if license number is missing', () => {
        mockRequest.params = {};
        ValidationController.validateUSDriversLicense(mockRequest as Request, mockResponse as Response);
        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.json).toHaveBeenCalledWith({ error: 'US Driver\'s License number is required.' });
      });
  
      // Valid formats (4-16 alphanumeric characters)
      it('should return 200 for valid license (minimum length - 4 chars)', () => {
        mockRequest.params = { licenseNumber: 'A123' };
        ValidationController.validateUSDriversLicense(mockRequest as Request, mockResponse as Response);
        expect(mockResponse.status).toHaveBeenCalledWith(200);
      });
  
      it('should return 200 for valid license (maximum length - 16 chars)', () => {
        mockRequest.params = { licenseNumber: 'ABCD1234EFGH5678' };
        ValidationController.validateUSDriversLicense(mockRequest as Request, mockResponse as Response);
        expect(mockResponse.status).toHaveBeenCalledWith(200);
      });
  
      it('should return 200 for valid license (mixed case converted to uppercase)', () => {
        mockRequest.params = { licenseNumber: 'aBcD1234' };
        ValidationController.validateUSDriversLicense(mockRequest as Request, mockResponse as Response);
        expect(mockResponse.status).toHaveBeenCalledWith(200);
      });
  
      // Invalid formats
      it('should return 400 for license that is too short (3 chars)', () => {
        mockRequest.params = { licenseNumber: 'A12' };
        ValidationController.validateUSDriversLicense(mockRequest as Request, mockResponse as Response);
        expect(mockResponse.status).toHaveBeenCalledWith(400);
      });
  
      it('should return 400 for license that is too long (17 chars)', () => {
        mockRequest.params = { licenseNumber: 'ABCD1234EFGH56789' };
        ValidationController.validateUSDriversLicense(mockRequest as Request, mockResponse as Response);
        expect(mockResponse.status).toHaveBeenCalledWith(400);
      });
  
      it('should return 400 for license with special characters', () => {
        mockRequest.params = { licenseNumber: 'A123-456' };
        ValidationController.validateUSDriversLicense(mockRequest as Request, mockResponse as Response);
        expect(mockResponse.status).toHaveBeenCalledWith(400);
      });
  
      it('should return 400 for license with spaces', () => {
        mockRequest.params = { licenseNumber: 'A 123 456' };
        ValidationController.validateUSDriversLicense(mockRequest as Request, mockResponse as Response);
        expect(mockResponse.status).toHaveBeenCalledWith(400);
      });
  
      it('should return 400 for empty string', () => {
        mockRequest.params = { licenseNumber: '' };
        ValidationController.validateUSDriversLicense(mockRequest as Request, mockResponse as Response);
        expect(mockResponse.status).toHaveBeenCalledWith(400);
      });
    });

  

    describe('validateUSSSN', () => {
      it('should return 400 if SSN is missing', () => {
        mockRequest.params = {};
        ValidationController.validateUSSSN(mockRequest as Request, mockResponse as Response);
        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.json).toHaveBeenCalledWith({ error: 'US SSN is required.' });
      });
  
      // Valid SSN formats
      it('should return 200 for valid SSN (standard format)', () => {
        mockRequest.params = { ssn: '123-45-6789' };
        ValidationController.validateUSSSN(mockRequest as Request, mockResponse as Response);
        expect(mockResponse.status).toHaveBeenCalledWith(200);
      });
  
      // Invalid SSN formats
      it('should return 400 for SSN starting with 000', () => {
        mockRequest.params = { ssn: '000-45-6789' };
        ValidationController.validateUSSSN(mockRequest as Request, mockResponse as Response);
        expect(mockResponse.status).toHaveBeenCalledWith(400);
      });
  
      it('should return 400 for SSN starting with 666', () => {
        mockRequest.params = { ssn: '666-45-6789' };
        ValidationController.validateUSSSN(mockRequest as Request, mockResponse as Response);
        expect(mockResponse.status).toHaveBeenCalledWith(400);
      });
  
      it('should return 400 for SSN starting with 900-999', () => {
        mockRequest.params = { ssn: '900-45-6789' };
        ValidationController.validateUSSSN(mockRequest as Request, mockResponse as Response);
        expect(mockResponse.status).toHaveBeenCalledWith(400);
      });
  
      it('should return 400 for SSN with middle digits 00', () => {
        mockRequest.params = { ssn: '123-00-6789' };
        ValidationController.validateUSSSN(mockRequest as Request, mockResponse as Response);
        expect(mockResponse.status).toHaveBeenCalledWith(400);
      });
  
      it('should return 400 for SSN with last digits 0000', () => {
        mockRequest.params = { ssn: '123-45-0000' };
        ValidationController.validateUSSSN(mockRequest as Request, mockResponse as Response);
        expect(mockResponse.status).toHaveBeenCalledWith(400);
      });
  
      it('should return 400 for SSN without hyphens', () => {
        mockRequest.params = { ssn: '123456789' };
        ValidationController.validateUSSSN(mockRequest as Request, mockResponse as Response);
        expect(mockResponse.status).toHaveBeenCalledWith(400);
      });
  
      it('should return 400 for SSN with incorrect hyphen placement', () => {
        mockRequest.params = { ssn: '12-345-6789' };
        ValidationController.validateUSSSN(mockRequest as Request, mockResponse as Response);
        expect(mockResponse.status).toHaveBeenCalledWith(400);
      });
  
      it('should return 400 for SSN with letters', () => {
        mockRequest.params = { ssn: 'ABC-DE-FGHI' };
        ValidationController.validateUSSSN(mockRequest as Request, mockResponse as Response);
        expect(mockResponse.status).toHaveBeenCalledWith(400);
      });
  
      it('should return 400 for SSN that is too short', () => {
        mockRequest.params = { ssn: '123-45-678' };
        ValidationController.validateUSSSN(mockRequest as Request, mockResponse as Response);
        expect(mockResponse.status).toHaveBeenCalledWith(400);
      });
  
      it('should return 400 for SSN that is too long', () => {
        mockRequest.params = { ssn: '123-45-67890' };
        ValidationController.validateUSSSN(mockRequest as Request, mockResponse as Response);
        expect(mockResponse.status).toHaveBeenCalledWith(400);
      });
  
      it('should return 400 for empty string', () => {
        mockRequest.params = { ssn: '' };
        ValidationController.validateUSSSN(mockRequest as Request, mockResponse as Response);
        expect(mockResponse.status).toHaveBeenCalledWith(400);
      });
    });
    




    describe('validateUSMilitaryID', () => {
      it('should return 400 if Military ID is missing', () => {
        mockRequest.params = {};
        ValidationController.validateUSMilitaryID(mockRequest as Request, mockResponse as Response);
        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.json).toHaveBeenCalledWith({ error: 'US Military ID is required.' });
      });
  
      // Valid Military ID formats
      it('should return 200 for valid Military ID (minimum length - 10 chars)', () => {
        mockRequest.params = { militaryID: 'ABCD123456' };
        ValidationController.validateUSMilitaryID(mockRequest as Request, mockResponse as Response);
        expect(mockResponse.status).toHaveBeenCalledWith(200);
      });
  
      it('should return 200 for valid Military ID (maximum length - 12 chars)', () => {
        mockRequest.params = { militaryID: 'ABCD12345678' };
        ValidationController.validateUSMilitaryID(mockRequest as Request, mockResponse as Response);
        expect(mockResponse.status).toHaveBeenCalledWith(200);
      });
  
      it('should return 200 for valid Military ID (mixed case converted to uppercase)', () => {
        mockRequest.params = { militaryID: 'abCD123456' };
        ValidationController.validateUSMilitaryID(mockRequest as Request, mockResponse as Response);
        expect(mockResponse.status).toHaveBeenCalledWith(200);
      });
  
      it('should return 200 for valid Military ID (all numbers)', () => {
        mockRequest.params = { militaryID: '1234567890' };
        ValidationController.validateUSMilitaryID(mockRequest as Request, mockResponse as Response);
        expect(mockResponse.status).toHaveBeenCalledWith(200);
      });
  
      it('should return 200 for valid Military ID (all letters)', () => {
        mockRequest.params = { militaryID: 'ABCDEFGHIJ' };
        ValidationController.validateUSMilitaryID(mockRequest as Request, mockResponse as Response);
        expect(mockResponse.status).toHaveBeenCalledWith(200);
      });
  
      // Invalid Military ID formats
      it('should return 400 for Military ID that is too short (9 chars)', () => {
        mockRequest.params = { militaryID: 'ABCD12345' };
        ValidationController.validateUSMilitaryID(mockRequest as Request, mockResponse as Response);
        expect(mockResponse.status).toHaveBeenCalledWith(400);
      });
  
      it('should return 400 for Military ID that is too long (13 chars)', () => {
        mockRequest.params = { militaryID: 'ABCD123456789' };
        ValidationController.validateUSMilitaryID(mockRequest as Request, mockResponse as Response);
        expect(mockResponse.status).toHaveBeenCalledWith(400);
      });
  
      it('should return 400 for Military ID with special characters', () => {
        mockRequest.params = { militaryID: 'ABCD-123456' };
        ValidationController.validateUSMilitaryID(mockRequest as Request, mockResponse as Response);
        expect(mockResponse.status).toHaveBeenCalledWith(400);
      });
  
      it('should return 400 for Military ID with spaces', () => {
        mockRequest.params = { militaryID: 'ABCD 123456' };
        ValidationController.validateUSMilitaryID(mockRequest as Request, mockResponse as Response);
        expect(mockResponse.status).toHaveBeenCalledWith(400);
      });
  
      it('should return 400 for empty string', () => {
        mockRequest.params = { militaryID: '' };
        ValidationController.validateUSMilitaryID(mockRequest as Request, mockResponse as Response);
        expect(mockResponse.status).toHaveBeenCalledWith(400);
      });
    });



    describe('validateUSGreenCard', () => {
      it('should return 400 if Green Card number is missing', () => {
        mockRequest.params = {};
        ValidationController.validateUSGreenCard(mockRequest as Request, mockResponse as Response);
        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.json).toHaveBeenCalledWith({ error: 'US Greencard Number is required.' });
      });
  
      // Valid Green Card formats (based on regex: /^([A-Z]{3}\d{10}|[A-Z]\d{8,9})$/)
      it('should return 200 for valid Green Card (format: 3 letters + 10 digits)', () => {
        mockRequest.params = { greenCardNumber: 'ABC1234567890' }; // 3 letters + 10 digits
        ValidationController.validateUSGreenCard(mockRequest as Request, mockResponse as Response);
        expect(mockResponse.status).toHaveBeenCalledWith(200);
      });
  
      it('should return 200 for valid Green Card (format: 1 letter + 8 digits)', () => {
        mockRequest.params = { greenCardNumber: 'A12345678' }; // 1 letter + 8 digits
        ValidationController.validateUSGreenCard(mockRequest as Request, mockResponse as Response);
        expect(mockResponse.status).toHaveBeenCalledWith(200);
      });
  
      it('should return 200 for valid Green Card (format: 1 letter + 9 digits)', () => {
        mockRequest.params = { greenCardNumber: 'B123456789' }; // 1 letter + 9 digits
        ValidationController.validateUSGreenCard(mockRequest as Request, mockResponse as Response);
        expect(mockResponse.status).toHaveBeenCalledWith(200);
      });
  
      // Invalid Green Card formats
      it('should return 400 for Green Card with 2 letters + 8 digits (invalid format)', () => {
        mockRequest.params = { greenCardNumber: 'AB12345678' }; // 2 letters + 8 digits (invalid)
        ValidationController.validateUSGreenCard(mockRequest as Request, mockResponse as Response);
        expect(mockResponse.status).toHaveBeenCalledWith(400);
      });
  
      it('should return 400 for Green Card with 3 letters + 9 digits (invalid length)', () => {
        mockRequest.params = { greenCardNumber: 'ABC123456789' }; // 3 letters + 9 digits (invalid)
        ValidationController.validateUSGreenCard(mockRequest as Request, mockResponse as Response);
        expect(mockResponse.status).toHaveBeenCalledWith(400);
      });
  
      it('should return 400 for Green Card with 1 letter + 7 digits (too short)', () => {
        mockRequest.params = { greenCardNumber: 'A1234567' }; // 1 letter + 7 digits (invalid)
        ValidationController.validateUSGreenCard(mockRequest as Request, mockResponse as Response);
        expect(mockResponse.status).toHaveBeenCalledWith(400);
      });
  
      it('should return 400 for Green Card with 1 letter + 10 digits (too long)', () => {
        mockRequest.params = { greenCardNumber: 'A1234567890' }; // 1 letter + 10 digits (invalid)
        ValidationController.validateUSGreenCard(mockRequest as Request, mockResponse as Response);
        expect(mockResponse.status).toHaveBeenCalledWith(400);
      });
  
      it('should return 400 for Green Card with lowercase letters', () => {
        mockRequest.params = { greenCardNumber: 'abc1234567890' }; // Lowercase letters (invalid)
        ValidationController.validateUSGreenCard(mockRequest as Request, mockResponse as Response);
        expect(mockResponse.status).toHaveBeenCalledWith(400);
      });
  
      it('should return 400 for Green Card with special characters', () => {
        mockRequest.params = { greenCardNumber: 'ABC-123-4567' }; // Hyphens (invalid)
        ValidationController.validateUSGreenCard(mockRequest as Request, mockResponse as Response);
        expect(mockResponse.status).toHaveBeenCalledWith(400);
      });
  
      it('should return 400 for Green Card with spaces', () => {
        mockRequest.params = { greenCardNumber: 'ABC 123 4567' }; // Spaces (invalid)
        ValidationController.validateUSGreenCard(mockRequest as Request, mockResponse as Response);
        expect(mockResponse.status).toHaveBeenCalledWith(400);
      });
  
      it('should return 400 for empty string', () => {
        mockRequest.params = { greenCardNumber: '' };
        ValidationController.validateUSGreenCard(mockRequest as Request, mockResponse as Response);
        expect(mockResponse.status).toHaveBeenCalledWith(400);
      });
    });

    




    describe('validateUSEAD', () => {
      it('should return 400 if EAD number is missing', () => {
        mockRequest.params = {};
        ValidationController.validateUSEAD(mockRequest as Request, mockResponse as Response);
        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.json).toHaveBeenCalledWith({ error: 'EAD Number is required.' });
      });
  
      // Valid EAD formats (based on regex: /^[A-Z]{3}\d{10}$/)
      it('should return 200 for valid EAD (format: 3 letters + 10 digits)', () => {
        mockRequest.params = { eadNumber: 'ABC1234567890' }; // 3 letters + 10 digits
        ValidationController.validateUSEAD(mockRequest as Request, mockResponse as Response);
        expect(mockResponse.status).toHaveBeenCalledWith(200);
      });
  
      // Invalid EAD formats
      it('should return 400 for EAD with 2 letters + 10 digits', () => {
        mockRequest.params = { eadNumber: 'AB1234567890' }; // 2 letters + 10 digits
        ValidationController.validateUSEAD(mockRequest as Request, mockResponse as Response);
        expect(mockResponse.status).toHaveBeenCalledWith(400);
      });
  
      it('should return 400 for EAD with 3 letters + 9 digits', () => {
        mockRequest.params = { eadNumber: 'ABC123456789' }; // 3 letters + 9 digits
        ValidationController.validateUSEAD(mockRequest as Request, mockResponse as Response);
        expect(mockResponse.status).toHaveBeenCalledWith(400);
      });
  
      it('should return 400 for EAD with 3 letters + 11 digits', () => {
        mockRequest.params = { eadNumber: 'ABC12345678901' }; // 3 letters + 11 digits
        ValidationController.validateUSEAD(mockRequest as Request, mockResponse as Response);
        expect(mockResponse.status).toHaveBeenCalledWith(400);
      });
  
      it('should return 400 for EAD with lowercase letters', () => {
        mockRequest.params = { eadNumber: 'abc1234567890' }; // lowercase letters
        ValidationController.validateUSEAD(mockRequest as Request, mockResponse as Response);
        expect(mockResponse.status).toHaveBeenCalledWith(400);
      });
  
      it('should return 400 for EAD with special characters', () => {
        mockRequest.params = { eadNumber: 'ABC-123-4567' }; // hyphens
        ValidationController.validateUSEAD(mockRequest as Request, mockResponse as Response);
        expect(mockResponse.status).toHaveBeenCalledWith(400);
      });
  
      it('should return 400 for EAD with spaces', () => {
        mockRequest.params = { eadNumber: 'ABC 123 4567' }; // spaces
        ValidationController.validateUSEAD(mockRequest as Request, mockResponse as Response);
        expect(mockResponse.status).toHaveBeenCalledWith(400);
      });
  
      it('should return 400 for empty string', () => {
        mockRequest.params = { eadNumber: '' };
        ValidationController.validateUSEAD(mockRequest as Request, mockResponse as Response);
        expect(mockResponse.status).toHaveBeenCalledWith(400);
      });
  
      it('should return 400 for EAD with letters in wrong positions', () => {
        mockRequest.params = { eadNumber: '1A23B456C789' }; // letters mixed with digits
        ValidationController.validateUSEAD(mockRequest as Request, mockResponse as Response);
        expect(mockResponse.status).toHaveBeenCalledWith(400);
      });
    });










    it('should return 400 if Birth Certificate number is missing', () => {
      mockRequest.params = {};
      ValidationController.validateUSBirthCertificate(mockRequest as Request, mockResponse as Response);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Birth Certificate Number is required.' });
    });
  
    // Valid Birth Certificate formats (based on regex: /^[A-Z]{2}\d{6,8}$/)
    it('should return 200 for valid Birth Cert with 2 letters + 6 digits', () => {
      mockRequest.params = { birthCertNumber: 'AB123456' }; // 2 letters + 6 digits
      ValidationController.validateUSBirthCertificate(mockRequest as Request, mockResponse as Response);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
    });
  
    it('should return 200 for valid Birth Cert with 2 letters + 7 digits', () => {
      mockRequest.params = { birthCertNumber: 'AB1234567' }; // 2 letters + 7 digits
      ValidationController.validateUSBirthCertificate(mockRequest as Request, mockResponse as Response);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
    });
  
    it('should return 200 for valid Birth Cert with 2 letters + 8 digits', () => {
      mockRequest.params = { birthCertNumber: 'AB12345678' }; // 2 letters + 8 digits
      ValidationController.validateUSBirthCertificate(mockRequest as Request, mockResponse as Response);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
    });
  
    // Invalid Birth Certificate formats
    it('should return 400 for Birth Cert with 1 letter + 6 digits', () => {
      mockRequest.params = { birthCertNumber: 'A123456' }; // 1 letter + 6 digits
      ValidationController.validateUSBirthCertificate(mockRequest as Request, mockResponse as Response);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
    });
  
    it('should return 400 for Birth Cert with 3 letters + 6 digits', () => {
      mockRequest.params = { birthCertNumber: 'ABC123456' }; // 3 letters + 6 digits
      ValidationController.validateUSBirthCertificate(mockRequest as Request, mockResponse as Response);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
    });
  
    it('should return 400 for Birth Cert with 2 letters + 5 digits', () => {
      mockRequest.params = { birthCertNumber: 'AB12345' }; // 2 letters + 5 digits
      ValidationController.validateUSBirthCertificate(mockRequest as Request, mockResponse as Response);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
    });
  
    it('should return 400 for Birth Cert with 2 letters + 9 digits', () => {
      mockRequest.params = { birthCertNumber: 'AB123456789' }; // 2 letters + 9 digits
      ValidationController.validateUSBirthCertificate(mockRequest as Request, mockResponse as Response);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
    });
  
    it('should return 400 for Birth Cert with lowercase letters', () => {
      mockRequest.params = { birthCertNumber: 'ab123456' }; // lowercase letters
      ValidationController.validateUSBirthCertificate(mockRequest as Request, mockResponse as Response);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
    });
  
    it('should return 400 for Birth Cert with special characters', () => {
      mockRequest.params = { birthCertNumber: 'AB-123-456' }; // hyphens
      ValidationController.validateUSBirthCertificate(mockRequest as Request, mockResponse as Response);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
    });
  
    it('should return 400 for Birth Cert with spaces', () => {
      mockRequest.params = { birthCertNumber: 'AB 123 456' }; // spaces
      ValidationController.validateUSBirthCertificate(mockRequest as Request, mockResponse as Response);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
    });
  
    it('should return 400 for empty string', () => {
      mockRequest.params = { birthCertNumber: '' };
      ValidationController.validateUSBirthCertificate(mockRequest as Request, mockResponse as Response);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
    });
  
    it('should return 400 for Birth Cert with letters in wrong positions', () => {
      mockRequest.params = { birthCertNumber: '1A2B3456' }; // letters mixed with digits
      ValidationController.validateUSBirthCertificate(mockRequest as Request, mockResponse as Response);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
    });
  
    it('should return 400 for Birth Cert with only letters', () => {
      mockRequest.params = { birthCertNumber: 'ABCDEFGH' }; // only letters
      ValidationController.validateUSBirthCertificate(mockRequest as Request, mockResponse as Response);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
    });
  
    it('should return 400 for Birth Cert with only digits', () => {
      mockRequest.params = { birthCertNumber: '12345678' }; // only digits
      ValidationController.validateUSBirthCertificate(mockRequest as Request, mockResponse as Response);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
    });
  
    // Edge cases
    it('should return 400 for Birth Cert with exactly 2 letters but no digits', () => {
      mockRequest.params = { birthCertNumber: 'AB' }; // exactly 2 letters but no digits
      ValidationController.validateUSBirthCertificate(mockRequest as Request, mockResponse as Response);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
    });
  
    it('should return 400 for Birth Cert with exactly 6 digits but no letters', () => {
      mockRequest.params = { birthCertNumber: '123456' }; // exactly 6 digits but no letters
      ValidationController.validateUSBirthCertificate(mockRequest as Request, mockResponse as Response);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
    });
  
    it('should return 400 for Birth Cert with leading/trailing whitespace', () => {
      mockRequest.params = { birthCertNumber: ' AB123456 ' }; // whitespace around valid format
      ValidationController.validateUSBirthCertificate(mockRequest as Request, mockResponse as Response);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
    });



    it('should return 400 if Medicare/Medicaid number is missing', () => {
      mockRequest.params = {};
      ValidationController.validateUSMedicareMedicaid(mockRequest as Request, mockResponse as Response);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Medicare/Medicaid Number is required.' });
    });
  
    // Valid MBI formats (based on regex: /^[1-9][A-Z]\d{2}-[A-Z]\d{4}-[A-Z]\d{2}$/)
    it('should return 200 for valid MBI format (1A23-B456-C78)', () => {
      mockRequest.params = { medicareNumber: '1A23-B456-C78' };
      ValidationController.validateUSMedicareMedicaid(mockRequest as Request, mockResponse as Response);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
    });
  
    it('should return 200 for valid MBI with different character combinations', () => {
      mockRequest.params = { medicareNumber: '9Z99-Z999-Z99' };
      ValidationController.validateUSMedicareMedicaid(mockRequest as Request, mockResponse as Response);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
    });
  
    // Invalid MBI formats
    it('should return 400 for MBI starting with 0', () => {
      mockRequest.params = { medicareNumber: '0A23-B456-C78' }; // starts with 0
      ValidationController.validateUSMedicareMedicaid(mockRequest as Request, mockResponse as Response);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
    });
  
    it('should return 400 for MBI starting with letter', () => {
      mockRequest.params = { medicareNumber: 'AA23-B456-C78' }; // starts with letter
      ValidationController.validateUSMedicareMedicaid(mockRequest as Request, mockResponse as Response);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
    });
  
    it('should return 400 for MBI with lowercase letters', () => {
      mockRequest.params = { medicareNumber: '1a23-b456-c78' }; // lowercase letters
      ValidationController.validateUSMedicareMedicaid(mockRequest as Request, mockResponse as Response);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
    });
  
    it('should return 400 for MBI missing hyphens', () => {
      mockRequest.params = { medicareNumber: '1A23B456C78' }; // no hyphens
      ValidationController.validateUSMedicareMedicaid(mockRequest as Request, mockResponse as Response);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
    });
  
    it('should return 400 for MBI with wrong hyphen positions', () => {
      mockRequest.params = { medicareNumber: '1-A23-B456-C78' }; // too many hyphens
      ValidationController.validateUSMedicareMedicaid(mockRequest as Request, mockResponse as Response);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
    });
  
    it('should return 400 for MBI with spaces', () => {
      mockRequest.params = { medicareNumber: '1A23 B456 C78' }; // spaces instead of hyphens
      ValidationController.validateUSMedicareMedicaid(mockRequest as Request, mockResponse as Response);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
    });
  
    it('should return 400 for MBI with special characters', () => {
      mockRequest.params = { medicareNumber: '1A23@B456#C78' }; // special characters
      ValidationController.validateUSMedicareMedicaid(mockRequest as Request, mockResponse as Response);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
    });
  
    it('should return 400 for empty string', () => {
      mockRequest.params = { medicareNumber: '' };
      ValidationController.validateUSMedicareMedicaid(mockRequest as Request, mockResponse as Response);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
    });
  
    it('should return 400 for MBI with incorrect segment lengths', () => {
      mockRequest.params = { medicareNumber: '1A2-B456-C78' }; // first segment too short
      ValidationController.validateUSMedicareMedicaid(mockRequest as Request, mockResponse as Response);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
    });
  
    it('should return 400 for MBI with letters in digit positions', () => {
      mockRequest.params = { medicareNumber: '1A2B-B45C-C7D' }; // letters where digits should be
      ValidationController.validateUSMedicareMedicaid(mockRequest as Request, mockResponse as Response);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
    });
  
    it('should return 400 for MBI with digits in letter positions', () => {
      mockRequest.params = { medicareNumber: '1123-2456-378' }; // digits where letters should be
      ValidationController.validateUSMedicareMedicaid(mockRequest as Request, mockResponse as Response);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
    });
  
    // Edge cases
    it('should return 400 for MBI with leading/trailing whitespace', () => {
      mockRequest.params = { medicareNumber: ' 1A23-B456-C78 ' };
      ValidationController.validateUSMedicareMedicaid(mockRequest as Request, mockResponse as Response);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
    });
  
    it('should return 400 for MBI with too many characters', () => {
      mockRequest.params = { medicareNumber: '1A23-B456-C789' }; // last segment too long
      ValidationController.validateUSMedicareMedicaid(mockRequest as Request, mockResponse as Response);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
    });
  
    it('should return 400 for MBI with too few characters', () => {
      mockRequest.params = { medicareNumber: '1A23-B456-C7' }; // last segment too short
      ValidationController.validateUSMedicareMedicaid(mockRequest as Request, mockResponse as Response);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
    });
  
    // Testing excluded characters (S, L, O, I, B, Z)
    it('should return 400 for MBI containing excluded letter S', () => {
      mockRequest.params = { medicareNumber: '1S23-B456-C78' }; // contains S
      ValidationController.validateUSMedicareMedicaid(mockRequest as Request, mockResponse as Response);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
    });
  
    it('should return 400 for MBI containing excluded letter L', () => {
      mockRequest.params = { medicareNumber: '1A23-L456-C78' }; // contains L
      ValidationController.validateUSMedicareMedicaid(mockRequest as Request, mockResponse as Response);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
    });
    
});