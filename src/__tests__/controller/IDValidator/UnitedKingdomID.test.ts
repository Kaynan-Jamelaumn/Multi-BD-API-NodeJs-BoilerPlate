// tests/controllers/UnitedKingdomID.test.ts
import { Request, Response } from 'express';
import ValidationController from '../../../controllers/IDValidatorController';
import { ValidationResult } from '../../../types/validation';

describe('UnitedKingdomID Validation', () => {
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


  describe('validateUK Driving License', () => {
    it('should return 400 if Driving Licence number is missing', () => {
      mockRequest.params = {};
      ValidationController.validateUKDrivingLicence(mockRequest as Request, mockResponse as Response);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Driving Licence Number is required.' });
    });

    // Valid UK Driving Licence formats (based on regex: /^[A-Z]{5}\d{6}[A-Z]{2}\d{2}$/)
    it('should return 200 for valid licence (5 letters + 6 digits + 2 letters + 2 digits)', () => {
      mockRequest.params = { licenceNumber: 'ABCDE123456FG12' }; // valid format
      ValidationController.validateUKDrivingLicence(mockRequest as Request, mockResponse as Response);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
    });

    it('should return 200 for valid licence with different character combinations', () => {
      mockRequest.params = { licenceNumber: 'ZYXWV987654LK98' }; // different valid combination
      ValidationController.validateUKDrivingLicence(mockRequest as Request, mockResponse as Response);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
    });

    // Invalid UK Driving Licence formats
    it('should return 400 for licence with 4 letters at start', () => {
      mockRequest.params = { licenceNumber: 'ABCD123456FG12' }; // 4 letters at start
      ValidationController.validateUKDrivingLicence(mockRequest as Request, mockResponse as Response);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
    });

    it('should return 400 for licence with 6 letters at start', () => {
      mockRequest.params = { licenceNumber: 'ABCDEF123456FG12' }; // 6 letters at start
      ValidationController.validateUKDrivingLicence(mockRequest as Request, mockResponse as Response);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
    });

    it('should return 400 for licence with 5 digits in middle', () => {
      mockRequest.params = { licenceNumber: 'ABCDE12345FG12' }; // 5 digits
      ValidationController.validateUKDrivingLicence(mockRequest as Request, mockResponse as Response);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
    });

    it('should return 400 for licence with 7 digits in middle', () => {
      mockRequest.params = { licenceNumber: 'ABCDE1234567FG12' }; // 7 digits
      ValidationController.validateUKDrivingLicence(mockRequest as Request, mockResponse as Response);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
    });

    it('should return 400 for licence with 1 letter at end', () => {
      mockRequest.params = { licenceNumber: 'ABCDE123456F12' }; // 1 letter before final digits
      ValidationController.validateUKDrivingLicence(mockRequest as Request, mockResponse as Response);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
    });

    it('should return 400 for licence with 3 letters at end', () => {
      mockRequest.params = { licenceNumber: 'ABCDE123456FGH12' }; // 3 letters before final digits
      ValidationController.validateUKDrivingLicence(mockRequest as Request, mockResponse as Response);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
    });

    it('should return 400 for licence with 1 digit at very end', () => {
      mockRequest.params = { licenceNumber: 'ABCDE123456FG1' }; // 1 final digit
      ValidationController.validateUKDrivingLicence(mockRequest as Request, mockResponse as Response);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
    });

    it('should return 400 for licence with 3 digits at very end', () => {
      mockRequest.params = { licenceNumber: 'ABCDE123456FG123' }; // 3 final digits
      ValidationController.validateUKDrivingLicence(mockRequest as Request, mockResponse as Response);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
    });

    it('should return 400 for licence with lowercase letters', () => {
      mockRequest.params = { licenceNumber: 'abcde123456fg12' }; // lowercase letters
      ValidationController.validateUKDrivingLicence(mockRequest as Request, mockResponse as Response);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
    });

    it('should return 400 for licence with special characters', () => {
      mockRequest.params = { licenceNumber: 'ABCDE-123456-FG12' }; // hyphens
      ValidationController.validateUKDrivingLicence(mockRequest as Request, mockResponse as Response);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
    });

    it('should return 400 for licence with spaces', () => {
      mockRequest.params = { licenceNumber: 'ABCDE 123456 FG12' }; // spaces
      ValidationController.validateUKDrivingLicence(mockRequest as Request, mockResponse as Response);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
    });

    it('should return 400 for empty string', () => {
      mockRequest.params = { licenceNumber: '' };
      ValidationController.validateUKDrivingLicence(mockRequest as Request, mockResponse as Response);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
    });

    it('should return 400 for licence with letters in digit sections', () => {
      mockRequest.params = { licenceNumber: 'ABCDE12A456FG12' }; // letter in digit section
      ValidationController.validateUKDrivingLicence(mockRequest as Request, mockResponse as Response);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
    });

    it('should return 400 for licence with digits in letter sections', () => {
      mockRequest.params = { licenceNumber: 'ABCD5123456F612' }; // digits in letter sections
      ValidationController.validateUKDrivingLicence(mockRequest as Request, mockResponse as Response);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
    });

    // Edge cases
    it('should return 400 for licence with leading/trailing whitespace', () => {
      mockRequest.params = { licenceNumber: ' ABCDE123456FG12 ' }; // whitespace around
      ValidationController.validateUKDrivingLicence(mockRequest as Request, mockResponse as Response);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
    });

    it('should return 400 for licence with exactly 15 characters but wrong format', () => {
      mockRequest.params = { licenceNumber: 'ABCDE123456FG123' }; // 15 chars but wrong format
      ValidationController.validateUKDrivingLicence(mockRequest as Request, mockResponse as Response);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
    });

    // Security test cases
    it('should return 400 for licence with SQL injection attempt', () => {
      mockRequest.params = { licenceNumber: "ABCDE' OR '1'='1" };
      ValidationController.validateUKDrivingLicence(mockRequest as Request, mockResponse as Response);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
    });

    it('should return 400 for licence with XSS attempt', () => {
      mockRequest.params = { licenceNumber: 'ABCDE<script>alert(1)</script>' };
      ValidationController.validateUKDrivingLicence(mockRequest as Request, mockResponse as Response);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
    });

    // Testing excluded characters
    it('should return 400 for licence containing special unicode characters', () => {
      mockRequest.params = { licenceNumber: 'ABCD€123456FG12' }; // euro symbol
      ValidationController.validateUKDrivingLicence(mockRequest as Request, mockResponse as Response);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
    });
  });









  describe('validateUKBirthCertificate', () => {
    it('should return 400 if Birth Certificate number is missing', () => {
      mockRequest.params = {};
      ValidationController.validateUKBirthCertificate(mockRequest as Request, mockResponse as Response);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Birth Certificate Number is required.' });
    });
  
    // Valid UK Birth Certificate formats (based on regex: /^[A-Z]{2}\d{6,8}$/)
    it('should return 200 for valid certificate with 2 letters + 6 digits', () => {
      mockRequest.params = { birthCertNumber: 'AB123456' }; // 2 letters + 6 digits
      ValidationController.validateUKBirthCertificate(mockRequest as Request, mockResponse as Response);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
    });
  
    it('should return 200 for valid certificate with 2 letters + 7 digits', () => {
      mockRequest.params = { birthCertNumber: 'AB1234567' }; // 2 letters + 7 digits
      ValidationController.validateUKBirthCertificate(mockRequest as Request, mockResponse as Response);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
    });
  
    it('should return 200 for valid certificate with 2 letters + 8 digits', () => {
      mockRequest.params = { birthCertNumber: 'AB12345678' }; // 2 letters + 8 digits
      ValidationController.validateUKBirthCertificate(mockRequest as Request, mockResponse as Response);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
    });
  
    it('should return 200 for valid certificate with different letter combinations', () => {
      mockRequest.params = { birthCertNumber: 'ZX987654' }; // different letters
      ValidationController.validateUKBirthCertificate(mockRequest as Request, mockResponse as Response);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
    });
  
    // Invalid UK Birth Certificate formats
    it('should return 400 for certificate with 1 letter + 6 digits', () => {
      mockRequest.params = { birthCertNumber: 'A123456' }; // 1 letter
      ValidationController.validateUKBirthCertificate(mockRequest as Request, mockResponse as Response);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
    });
  
    it('should return 400 for certificate with 3 letters + 6 digits', () => {
      mockRequest.params = { birthCertNumber: 'ABC123456' }; // 3 letters
      ValidationController.validateUKBirthCertificate(mockRequest as Request, mockResponse as Response);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
    });
  
    it('should return 400 for certificate with 2 letters + 5 digits', () => {
      mockRequest.params = { birthCertNumber: 'AB12345' }; // 5 digits
      ValidationController.validateUKBirthCertificate(mockRequest as Request, mockResponse as Response);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
    });
  
    it('should return 400 for certificate with 2 letters + 9 digits', () => {
      mockRequest.params = { birthCertNumber: 'AB123456789' }; // 9 digits
      ValidationController.validateUKBirthCertificate(mockRequest as Request, mockResponse as Response);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
    });
  
    it('should return 400 for certificate with lowercase letters', () => {
      mockRequest.params = { birthCertNumber: 'ab123456' }; // lowercase
      ValidationController.validateUKBirthCertificate(mockRequest as Request, mockResponse as Response);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
    });
  
    it('should return 400 for certificate with special characters', () => {
      mockRequest.params = { birthCertNumber: 'AB-123-456' }; // hyphens
      ValidationController.validateUKBirthCertificate(mockRequest as Request, mockResponse as Response);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
    });
  
    it('should return 400 for certificate with spaces', () => {
      mockRequest.params = { birthCertNumber: 'AB 123 456' }; // spaces
      ValidationController.validateUKBirthCertificate(mockRequest as Request, mockResponse as Response);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
    });
  
    it('should return 400 for empty string', () => {
      mockRequest.params = { birthCertNumber: '' };
      ValidationController.validateUKBirthCertificate(mockRequest as Request, mockResponse as Response);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
    });
  
    it('should return 400 for certificate with letters in digit positions', () => {
      mockRequest.params = { birthCertNumber: 'AB12C456' }; // letter in digit section
      ValidationController.validateUKBirthCertificate(mockRequest as Request, mockResponse as Response);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
    });
  
    // Edge cases
    it('should return 400 for certificate with leading/trailing whitespace', () => {
      mockRequest.params = { birthCertNumber: ' AB123456 ' }; // whitespace
      ValidationController.validateUKBirthCertificate(mockRequest as Request, mockResponse as Response);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
    });
  
    it('should return 400 for certificate with unicode characters', () => {
      mockRequest.params = { birthCertNumber: 'AB©123456' }; // copyright symbol
      ValidationController.validateUKBirthCertificate(mockRequest as Request, mockResponse as Response);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
    });
  
    // Security test cases
    it('should return 400 for certificate with SQL injection attempt', () => {
      mockRequest.params = { birthCertNumber: "AB' OR '1'='1" };
      ValidationController.validateUKBirthCertificate(mockRequest as Request, mockResponse as Response);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
    });
  
    it('should return 400 for certificate with XSS attempt', () => {
      mockRequest.params = { birthCertNumber: 'AB<script>alert(1)</script>' };
      ValidationController.validateUKBirthCertificate(mockRequest as Request, mockResponse as Response);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
    });
  
    // Testing minimum and maximum boundaries
    it('should return 200 for exactly 2 letters + 6 digits', () => {
      mockRequest.params = { birthCertNumber: 'AB123456' }; // exact minimum
      ValidationController.validateUKBirthCertificate(mockRequest as Request, mockResponse as Response);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
    });
  
    it('should return 200 for exactly 2 letters + 8 digits', () => {
      mockRequest.params = { birthCertNumber: 'AB12345678' }; // exact maximum
      ValidationController.validateUKBirthCertificate(mockRequest as Request, mockResponse as Response);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
    });
  
    // Testing excluded characters
    it('should return 400 for certificate containing excluded letters if any', () => {
      mockRequest.params = { birthCertNumber: 'IÖ123456' }; // potentially excluded chars
      ValidationController.validateUKBirthCertificate(mockRequest as Request, mockResponse as Response);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
    });
  });









  describe('validateUKArmedForcesID', () => {
    it('should return 400 if Armed Forces ID number is missing', () => {
      mockRequest.params = {};
      ValidationController.validateUKArmedForcesID(mockRequest as Request, mockResponse as Response);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Armed Forces ID Number is required.' });
    });
  
    // Valid UK Armed Forces ID formats (based on regex: /^[A-Z]{2}\d{6}$/)
    it('should return 200 for valid ID (2 letters + 6 digits)', () => {
      mockRequest.params = { armedForcesID: 'AB123456' }; // valid format
      ValidationController.validateUKArmedForcesID(mockRequest as Request, mockResponse as Response);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
    });
  
    it('should return 200 for valid ID with different letter combinations', () => {
      mockRequest.params = { armedForcesID: 'ZX987654' }; // different letters
      ValidationController.validateUKArmedForcesID(mockRequest as Request, mockResponse as Response);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
    });
  
    // Invalid UK Armed Forces ID formats
    it('should return 400 for ID with 1 letter + 6 digits', () => {
      mockRequest.params = { armedForcesID: 'A123456' }; // 1 letter
      ValidationController.validateUKArmedForcesID(mockRequest as Request, mockResponse as Response);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
    });
  
    it('should return 400 for ID with 3 letters + 6 digits', () => {
      mockRequest.params = { armedForcesID: 'ABC123456' }; // 3 letters
      ValidationController.validateUKArmedForcesID(mockRequest as Request, mockResponse as Response);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
    });
  
    it('should return 400 for ID with 2 letters + 5 digits', () => {
      mockRequest.params = { armedForcesID: 'AB12345' }; // 5 digits
      ValidationController.validateUKArmedForcesID(mockRequest as Request, mockResponse as Response);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
    });
  
    it('should return 400 for ID with 2 letters + 7 digits', () => {
      mockRequest.params = { armedForcesID: 'AB1234567' }; // 7 digits
      ValidationController.validateUKArmedForcesID(mockRequest as Request, mockResponse as Response);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
    });
  
    it('should return 400 for ID with lowercase letters', () => {
      mockRequest.params = { armedForcesID: 'ab123456' }; // lowercase
      ValidationController.validateUKArmedForcesID(mockRequest as Request, mockResponse as Response);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
    });
  
    it('should return 400 for ID with special characters', () => {
      mockRequest.params = { armedForcesID: 'AB-123-456' }; // hyphens
      ValidationController.validateUKArmedForcesID(mockRequest as Request, mockResponse as Response);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
    });
  
    it('should return 400 for ID with spaces', () => {
      mockRequest.params = { armedForcesID: 'AB 123 456' }; // spaces
      ValidationController.validateUKArmedForcesID(mockRequest as Request, mockResponse as Response);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
    });
  
    it('should return 400 for empty string', () => {
      mockRequest.params = { armedForcesID: '' };
      ValidationController.validateUKArmedForcesID(mockRequest as Request, mockResponse as Response);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
    });
  
    it('should return 400 for ID with letters in digit positions', () => {
      mockRequest.params = { armedForcesID: 'AB12C456' }; // letter in digit section
      ValidationController.validateUKArmedForcesID(mockRequest as Request, mockResponse as Response);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
    });
  
    // Edge cases
    it('should return 400 for ID with leading/trailing whitespace', () => {
      mockRequest.params = { armedForcesID: ' AB123456 ' }; // whitespace
      ValidationController.validateUKArmedForcesID(mockRequest as Request, mockResponse as Response);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
    });
  
    it('should return 400 for ID with unicode characters', () => {
      mockRequest.params = { armedForcesID: 'AB©123456' }; // copyright symbol
      ValidationController.validateUKArmedForcesID(mockRequest as Request, mockResponse as Response);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
    });
  
    // Security test cases
    it('should return 400 for ID with SQL injection attempt', () => {
      mockRequest.params = { armedForcesID: "AB' OR '1'='1" };
      ValidationController.validateUKArmedForcesID(mockRequest as Request, mockResponse as Response);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
    });
  
    it('should return 400 for ID with XSS attempt', () => {
      mockRequest.params = { armedForcesID: 'AB<script>alert(1)</script>' };
      ValidationController.validateUKArmedForcesID(mockRequest as Request, mockResponse as Response);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
    });
  
    // Testing exact length requirements
    it('should return 400 for ID with exactly 7 characters (2 letters + 5 digits)', () => {
      mockRequest.params = { armedForcesID: 'AB12345' }; // 1 digit short
      ValidationController.validateUKArmedForcesID(mockRequest as Request, mockResponse as Response);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
    });
  
    it('should return 400 for ID with exactly 9 characters (2 letters + 7 digits)', () => {
      mockRequest.params = { armedForcesID: 'AB1234567' }; // 1 digit extra
      ValidationController.validateUKArmedForcesID(mockRequest as Request, mockResponse as Response);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
    });
  
    // Testing all-digit and all-letter cases
    it('should return 400 for all-digit ID', () => {
      mockRequest.params = { armedForcesID: '12345678' };
      ValidationController.validateUKArmedForcesID(mockRequest as Request, mockResponse as Response);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
    });
  
    it('should return 400 for all-letter ID', () => {
      mockRequest.params = { armedForcesID: 'ABCDEFGH' };
      ValidationController.validateUKArmedForcesID(mockRequest as Request, mockResponse as Response);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
    });
  
    // Testing excluded characters
    it('should return 400 for ID containing potentially excluded letters', () => {
      mockRequest.params = { armedForcesID: 'IÖ123456' }; // non-standard letters
      ValidationController.validateUKArmedForcesID(mockRequest as Request, mockResponse as Response);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
    });
  });


});