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



});