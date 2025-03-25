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


});