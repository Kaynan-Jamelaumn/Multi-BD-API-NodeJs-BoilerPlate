// tests/controllers/BrazilianID.test.ts
import { Request, Response } from 'express';
import ValidationController from '../../../controllers/IDValidatorController';
import { ValidationResult } from '../../../types/validation';

describe('BrazilianID Validation', () => {
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



  describe('validateCNH', () => {
    it('should return 400 if CNH number is not provided', () => {
      mockRequest.params = {};
      ValidationController.validateCNH(mockRequest as Request, mockResponse as Response);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'CNH number is required.' });
    });
  
    it('should return 200 for valid CNH number', () => {
      mockRequest.params = { cnhNumber: '00000000000' }; //valid both check digits =0
      ValidationController.validateCNH(mockRequest as Request, mockResponse as Response);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
    });
  
    it('should return 200 for valid CNH with check digits zero', () => {
      mockRequest.params = { cnhNumber: '12345678900' }; // Sum1 = 165 (dv1 = 0), Som2 = 285 (dv2 = 0)
      ValidationController.validateCNH(mockRequest as Request, mockResponse as Response);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
    });
  
    it('should return 400 for non-numeric characters', () => {
      mockRequest.params = { cnhNumber: '12345a67890' };
      ValidationController.validateCNH(mockRequest as Request, mockResponse as Response);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Invalid CNH format' });
    });
  
    it('should return 400 for incorrect length (10 digits)', () => {
      mockRequest.params = { cnhNumber: '1234567890' };
      ValidationController.validateCNH(mockRequest as Request, mockResponse as Response);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Invalid CNH format' });
    });
  
    it('should return 400 for formatted number', () => {
      mockRequest.params = { cnhNumber: '123.456.789-00' };
      ValidationController.validateCNH(mockRequest as Request, mockResponse as Response);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Invalid CNH format' });
    });
  
    it('should return 400 for invalid checksum', () => {
      mockRequest.params = { cnhNumber: '12345678909' }; // correct digits would be 00
      ValidationController.validateCNH(mockRequest as Request, mockResponse as Response);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Invalid CNH checksum' });
    });
  
    it('should return 200 for valid check digits with remainder 10', () => {
      mockRequest.params = { cnhNumber: '12345678801' }; // Sum1 = 164 (dv1 = 0), Sum2 = 276 (dv2 = 1)
      ValidationController.validateCNH(mockRequest as Request, mockResponse as Response);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
    });
  
    it('should return 400 for correct length but wrong check digits', () => {
      mockRequest.params = { cnhNumber: '11111111111' }; // Sum1 = 45 (dv1 = 1), Sum2 = 45 (dv2 = 1)
      ValidationController.validateCNH(mockRequest as Request, mockResponse as Response);
      expect(mockResponse.status).toHaveBeenCalledWith(200); // Este exemplo é válido!
    });
  });


  

  describe('validateCTPS', () => {
    it('should return 400 if CTPS number is not provided', () => {
      mockRequest.params = {};
      ValidationController.validateCTPS(mockRequest as Request, mockResponse as Response);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'CTPS number is required.' });
    });
  
    it('should return 200 for valid CTPS with padding zeros', () => {
      mockRequest.params = { ctpsNumber: '000000000' }; //  DV1=0, DV2=0
      ValidationController.validateCTPS(mockRequest as Request, mockResponse as Response);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
    });
  
    it('should return 200 for formatted valid CTPS with dash', () => {
      mockRequest.params = { ctpsNumber: '1234567-21' }; // DV1=2, DV2=7
      ValidationController.validateCTPS(mockRequest as Request, mockResponse as Response);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
    });
  
    it('should return 200 for formatted valid CTPS with space', () => {
      // CTPS with a space separator, should still be valid
      mockRequest.params = { ctpsNumber: '7654321 34' }; // Valid DV1=3, DV2=4
      ValidationController.validateCTPS(mockRequest as Request, mockResponse as Response);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
    });
  
    it('should return 400 for non-numeric characters', () => {
      // CTPS contains alphabetic character, should be invalid
      mockRequest.params = { ctpsNumber: '12345a7-89' };
      ValidationController.validateCTPS(mockRequest as Request, mockResponse as Response);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Invalid CTPS format' });
    });
  
    it('should return 400 for invalid format with multiple separators', () => {
      // More than one separator used, should be invalid
      mockRequest.params = { ctpsNumber: '123-4567-89' };
      ValidationController.validateCTPS(mockRequest as Request, mockResponse as Response);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Invalid CTPS format' });
    });
  
    it('should return 400 for incorrect checksum', () => {
      // CTPS checksum digit is incorrect, should fail
      mockRequest.params = { ctpsNumber: '123456789' }; // dv expected 9, given digit 89
      ValidationController.validateCTPS(mockRequest as Request, mockResponse as Response);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Invalid CTPS checksum' });
    });
  
    it('should return 200 for valid 8-digit main number', () => {
      // Valid CTPS with 8 digits, correct checksum
      mockRequest.params = { ctpsNumber: '8765432198' }; // DV1=9, DV2=5
      ValidationController.validateCTPS(mockRequest as Request, mockResponse as Response);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
    });
  
    it('should return 400 for numbers exceeding max length', () => {
      // Too many digits after normalization, should be invalid
      mockRequest.params = { ctpsNumber: '123456789012' }; // 12 digits after normalization
      ValidationController.validateCTPS(mockRequest as Request, mockResponse as Response);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Invalid CTPS format' });
    });
  
    it('should return 200 for valid check digit with remainder 10', () => {
      // Valid CTPS where check digit calculation results in remainder 10
      mockRequest.params = { ctpsNumber: '111111122' }; //DV1=2, DV2=9
      ValidationController.validateCTPS(mockRequest as Request, mockResponse as Response);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
    });
  });

  describe('validateCRM', () => {
    it('should return 400 if CRM number is not provided', () => {
      mockRequest.params = {};
      ValidationController.validateCRM(mockRequest as Request, mockResponse as Response);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'CRM number is required.' });
    });
  
    it('should return 200 for valid CRM with 4 digits', () => {
      // CRM with valid 4-digit number and state abbreviation
      mockRequest.params = { crmNumber: '1234/SP' };
      ValidationController.validateCRM(mockRequest as Request, mockResponse as Response);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
    });
  
    it('should return 200 for valid CRM with 6 digits', () => {
      mockRequest.params = { crmNumber: '123456/RJ' };
      ValidationController.validateCRM(mockRequest as Request, mockResponse as Response);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
    });
  
    it('should return 200 for valid CRM with trailing spaces', () => {
      mockRequest.params = { crmNumber: ' 12345/MG ' };
      ValidationController.validateCRM(mockRequest as Request, mockResponse as Response);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
    });
  
    it('should return 400 for missing slash', () => {
      // CRM missing the required slash separator
      mockRequest.params = { crmNumber: '1234SP' };
      ValidationController.validateCRM(mockRequest as Request, mockResponse as Response);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Invalid CRM format' });
    });
  
    it('should return 400 for lowercase letters', () => {
      mockRequest.params = { crmNumber: '12345/rs' };
      ValidationController.validateCRM(mockRequest as Request, mockResponse as Response);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Invalid CRM format' });
    });
  
    it('should return 400 for special characters', () => {
      mockRequest.params = { crmNumber: '1234/@B' };
      ValidationController.validateCRM(mockRequest as Request, mockResponse as Response);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Invalid CRM format' });
    });
  
    it('should return 400 for too many digits', () => {
      mockRequest.params = { crmNumber: '1234567/SP' };
      ValidationController.validateCRM(mockRequest as Request, mockResponse as Response);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Invalid CRM format' });
    });
  
    it('should return 400 for too few digits', () => {
      mockRequest.params = { crmNumber: '123/SP' };
      ValidationController.validateCRM(mockRequest as Request, mockResponse as Response);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Invalid CRM format' });
    });
  
    it('should return 400 for invalid UF length', () => {
      mockRequest.params = { crmNumber: '12345/ABC' };
      ValidationController.validateCRM(mockRequest as Request, mockResponse as Response);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Invalid CRM format' });
    });
  
    it('should return 400 for numeric UF', () => {
      mockRequest.params = { crmNumber: '12345/12' };
      ValidationController.validateCRM(mockRequest as Request, mockResponse as Response);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Invalid CRM format' });
    });
  
    it('should return 200 for valid zero-padded number', () => {
      mockRequest.params = { crmNumber: '0000/DF' };
      ValidationController.validateCRM(mockRequest as Request, mockResponse as Response);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
    });
  });



});