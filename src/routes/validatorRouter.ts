import {
    Router
} from 'express';
import ValidationController from '../controllers/IDValidatorController';

const router = Router();

// route to validate user fields
/**
 * @swagger
 * /validate/validate-fields:
 *   get:
 *     summary: Validate user fields
 *     tags: [Validation]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               name:
 *                 type: string
 *               surname:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *     responses:
 *       200:
 *         description: All fields are valid
 *       400:
 *         description: Invalid fields
 */
router.get('/validate-fields/', ValidationController.validateFields);



// route to validate passport
/**
 * @swagger
 * /validate/validate-passport/{passportNumber}/{countryCode}:
 *   get:
 *     summary: Validate passport
 *     tags: [Validation]
 *     parameters:
 *       - in: path
 *         name: passportNumber
 *         schema:
 *           type: string
 *         required: true
 *         description: The passport number
 *       - in: path
 *         name: countryCode
 *         schema:
 *           type: string
 *         required: true
 *         description: The country code
 *     responses:
 *       200:
 *         description: Passport is valid
 *       400:
 *         description: Invalid passport or missing parameters
 */
router.get('/validate-passport/:passportNumber/:countryCode?', ValidationController.validatePassport);


// route to validate CPF
/**
 * @swagger
 * /validate/validate-cpf/{cpfNumber}:
 *   get:
 *     summary: Validate CPF
 *     tags: [Validation]
 *     parameters:
 *       - in: path
 *         name: cpfNumber
 *         schema:
 *           type: string
 *         required: true
 *         description: The CPF number
 *     responses:
 *       200:
 *         description: CPF is valid
 *       400:
 *         description: Invalid CPF or missing parameter
 */
router.get('/validate-cpf/:cpfNumber?', ValidationController.validateCPF);


// route to validate RG
/**
 * @swagger
 * /validate/validate-rg/{rgNumber}:
 *   get:
 *     summary: Validate RG
 *     tags: [Validation]
 *     parameters:
 *       - in: path
 *         name: rgNumber
 *         schema:
 *           type: string
 *         required: true
 *         description: The RG number
 *     responses:
 *       200:
 *         description: RG is valid
 *       400:
 *         description: Invalid RG or missing parameter
 */
router.get('/validate-rg/:rgNumber?', ValidationController.validateRG);



// route to validate SUS
/**
 * @swagger
 * /validate/validate-sus/{susNumber}:
 *   get:
 *     summary: Validate SUS number
 *     tags: [Validation]
 *     parameters:
 *       - in: path
 *         name: susNumber
 *         schema:
 *           type: string
 *         required: true
 *         description: The SUS number
 *     responses:
 *       200:
 *         description: SUS number is valid
 *       400:
 *         description: Invalid SUS number or missing parameter
 */
router.get('/validate-sus/:susNumber?', ValidationController.validateSUS);




// route to validate CNH
/**
 * @swagger
 * /validate/validate-cnh/{cnhNumber}:
 *   get:
 *     summary: Validate CNH
 *     tags: [Validation]
 *     parameters:
 *       - in: path
 *         name: cnhNumber
 *         schema:
 *           type: string
 *         required: true
 *         description: The CNH number
 *     responses:
 *       200:
 *         description: CNH is valid
 *       400:
 *         description: Invalid CNH or missing parameter
 */
router.get('/validate-cnh/:cnhNumber?', ValidationController.validateCNH);

// route to validate CTPS
/**
 * @swagger
 * /validate/validate-ctps/{ctpsNumber}:
 *   get:
 *     summary: Validate CTPS
 *     tags: [Validation]
 *     parameters:
 *       - in: path
 *         name: ctpsNumber
 *         schema:
 *           type: string
 *         required: true
 *         description: The CTPS number
 *     responses:
 *       200:
 *         description: CTPS is valid
 *       400:
 *         description: Invalid CTPS or missing parameter
 */
router.get('/validate-ctps/:ctpsNumber?', ValidationController.validateCTPS);


// route to validate CRM
/**
 * @swagger
 * /validate/validate-crm/{crmNumber}:
 *   get:
 *     summary: Validate CRM
 *     tags: [Validation]
 *     parameters:
 *       - in: path
 *         name: crmNumber
 *         schema:
 *           type: string
 *         required: true
 *         description: The CRM number
 *     responses:
 *       200:
 *         description: CRM is valid
 *       400:
 *         description: Invalid CRM or missing parameter
 */
router.get('/validate-crm/:crmNumber?', ValidationController.validateCRM);


// route to validate OAB
/**
 * @swagger
 * /validate/validate-oab/{oabNumber}:
 *   get:
 *     summary: Validate OAB
 *     tags: [Validation]
 *     parameters:
 *       - in: path
 *         name: oabNumber
 *         schema:
 *           type: string
 *         required: true
 *         description: The OAB number
 *     responses:
 *       200:
 *         description: OAB is valid
 *       400:
 *         description: Invalid OAB or missing parameter
 */
router.get('/validate-oab/:oabNumber?', ValidationController.validateOAB);

// route to validate CREA
/**
 * @swagger
 * /validate/validate-crea/{creaNumber}:
 *   get:
 *     summary: Validate CREA
 *     tags: [Validation]
 *     parameters:
 *       - in: path
 *         name: creaNumber
 *         schema:
 *           type: string
 *         required: true
 *         description: The CREA number
 *     responses:
 *       200:
 *         description: CREA is valid
 *       400:
 *         description: Invalid CREA or missing parameter
 */
router.get('/validate-crea/:creaNumber?', ValidationController.validateCREA);

// route to validate PIS/PASEP 
/**
 * @swagger
 * /validate/validate-pis-pasep/{pis}:
 *   get:
 *     summary: Validate PIS/PASEP
 *     tags: [Validation]
 *     parameters:
 *       - in: path
 *         name: pis
 *         schema:
 *           type: string
 *         required: true
 *         description: The PIS/PASEP number
 *     responses:
 *       200:
 *         description: PIS/PASEP is valid
 *       400:
 *         description: Invalid PIS/PASEP or missing parameter
 */
router.get('/validate-pis-pasep/:pis?', ValidationController.validatePIS);

// route to validate CNPJ
/**
 * @swagger
 * /validate/validate-cnpj/{cnpj}:
 *   get:
 *     summary: Validate CNPJ
 *     tags: [Validation]
 *     parameters:
 *       - in: path
 *         name: cnpj
 *         schema:
 *           type: string
 *         required: true
 *         description: The CNPJ number
 *     responses:
 *       200:
 *         description: CNPJ is valid
 *       400:
 *         description: Invalid CNPJ or missing parameter
 */
router.get('/validate-cnpj/:cnpj?', ValidationController.validateCNPJ);


// Route to validate US Driver's License
/**
 * @swagger
 * /validate/validate-us-license/{licenseNumber}:
 *   get:
 *     summary: Validate US Driver's License
 *     tags: [Validation]
 *     parameters:
 *       - in: path
 *         name: licenseNumber
 *         schema:
 *           type: string
 *         required: true
 *         description: The US Driver's License number
 *     responses:
 *       200:
 *         description: US Driver's License is valid
 *       400:
 *         description: Invalid US Driver's License or missing parameter
 */
router.get('/validate-us-license/:licenseNumber?', ValidationController.validateUSDriversLicense);

// Route to validate US SSN
/**
 * @swagger
 * /validate/validate-us-ssn/{ssn}:
 *   get:
 *     summary: Validate US SSN
 *     tags: [Validation]
 *     parameters:
 *       - in: path
 *         name: ssn
 *         schema:
 *           type: string
 *         required: true
 *         description: The US SSN
 *     responses:
 *       200:
 *         description: US SSN is valid
 *       400:
 *         description: Invalid US SSN or missing parameter
 */
router.get('/validate-us-ssn/:ssn?', ValidationController.validateUSSSN);


// Route to validate US Military ID
/**
 * @swagger
 * /validate/validate-us-military-id/{militaryID}:
 *   get:
 *     summary: Validate US Military ID
 *     tags: [Validation]
 *     parameters:
 *       - in: path
 *         name: militaryID
 *         schema:
 *           type: string
 *         required: true
 *         description: The US Military ID
 *     responses:
 *       200:
 *         description: US Military ID is valid
 *       400:
 *         description: Invalid US Military ID or missing parameter
 */
router.get('/validate-us-military-id/:militaryID?', ValidationController.validateUSMilitaryID);



// Route to validate US Military ID
/**
 * @swagger
 * /validate/validate-us-greencard-number/{greenCardNumber}:
 *   get:
 *     summary: Validate US GreenCard
 *     tags: [Validation]
 *     parameters:
 *       - in: path
 *         name: greenCardNumber
 *         schema:
 *           type: string
 *         required: true
 *         description: The US GreenCard
 *     responses:
 *       200:
 *         description: US GreenCard ID is valid
 *       400:
 *         description: Invalid US GreenCard ID or missing parameter
 */
router.get('/validate-us-greencard-number/:greenCardNumber?', ValidationController.validateUSGreencard);


// Route to validate UK National Insurance Number
/**
 * @swagger
 * /validate/validate-uk-ni/{niNumber}:
 *   get:
 *     summary: Validate UK National Insurance Number
 *     tags: [Validation]
 *     parameters:
 *       - in: path
 *         name: niNumber
 *         schema:
 *           type: string
 *         required: true
 *         description: The UK National Insurance Number
 *     responses:
 *       200:
 *         description: UK NI Number is valid
 *       400:
 *         description: Invalid UK NI Number or missing parameter
 */
router.get('/validate-uk-ni/:niNumber?', ValidationController.validateUKNINumber);


// Route to validate Canadian SIN (Social Insurance Number)
/**
 * @swagger
 * /validate/validate-ca-sin/{sinNumber}:
 *   get:
 *     summary: Validate Canadian SIN (Social Insurance Number)
 *     tags: [Validation]
 *     parameters:
 *       - in: path
 *         name: sinNumber
 *         schema:
 *           type: string
 *         required: true
 *         description: The SIN (Social Insurance Number)
 *     responses:
 *       200:
 *         description: Canadian SIN Number is valid.
 *       400:
 *         description: Invalid SIN format/Invalid SIN number
 */
router.get('/validate-ca-sin/:sinNumber?', ValidationController.validateCanadianSIN);
// Route to validate Mexican CURP (Clave Única de Registro de Población)
/**
 * @swagger
 * /validate/validate-mx-curp/{curpNumber}:
 *   get:
 *     summary: Validate Mexican CURP (Clave Única de Registro de Población)
 *     tags: [Validation]
 *     parameters:
 *       - in: path
 *         name: sinNumber
 *         schema:
 *           type: string
 *         required: true
 *         description: The MX  CURP (Clave Única de Registro de Población) number
 *     responses:
 *       200:
 *         description: Mexican CURP Number is valid.
 *       400:
 *         description: Invalid CURP format/Invalid CURP checksum
 */
router.get('/validate-mx-curp/:curpNumber?', ValidationController.validateMexicanCURP);

// Route to validate South Korean RRN (Resident Registration Number)
/**
 * @swagger
 * /validate/validate-kr-rrn/{rrnNumber}:
 *   get:
 *     summary: Validate South Korean RRN (Resident Registration Number)
 *     tags: [Validation]
 *     parameters:
 *       - in: path
 *         name: rrnNumber
 *         schema:
 *           type: string
 *         required: true
 *         description: The South Korean RRN (Resident Registration Number)
 *     responses:
 *       200:
 *         description: South Korean RRN is valid.
 *       400:
 *         description: Invalid RRN format/Invalid RRN checksum
 */
router.get('/validate-kr-rrn/:rrnNumber?', ValidationController.validateSouthKoreanRRN);
/**
 * @swagger
 * /validate/validate-de-personalausweis/{idNumber}:
 *   get:
 *     summary: Validate German Personalausweis (ID)
 *     tags: [Validation]
 *     parameters:
 *       - in: path
 *         name: idNumber
 *         schema:
 *           type: string
 *         required: true
 *         description: The German Personalausweis number (10 digits)
 *     responses:
 *       200:
 *         description: German Personalausweis is valid.
 *       400:
 *         description: Invalid ID format/Invalid checksum
 */
router.get('/validate-de-personalausweis/:idNumber?', ValidationController.validateGermanPersonalausweis);




export default router;