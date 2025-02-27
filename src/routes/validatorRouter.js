import { Router } from 'express';
import IDValidator from '../utils/IDValidator.js';

const router = new Router();

// Helper function to extract data from req.body or req.params
const getData = (req, field) => req.body[field] || req.params[field];

// route to validate user fields
/**
 * @swagger
 * /validate/validate-fields:
 *   post:
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
router.post('/validate-fields', (req, res) => {
    const userData = {
        username: getData(req, 'username'),
        name: getData(req, 'name'),
        surname: getData(req, 'surname'),
        email: getData(req, 'email'),
        password: getData(req, 'password'),
        role: getData(req, 'role'),
    };

    const validationResult = IDValidator.validateFields(userData);

    if (!validationResult.valid) {
        return res.status(validationResult.status || 400).json({ error: validationResult.error });
    }

    res.status(200).json({ message: 'All fields are valid.' });
});

// route to validate passport
/**
 * @swagger
 * /validate/validate-passport/{passportNumber}/{countryCode}:
 *   post:
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
router.post('/validate-passport/:passportNumber?/:countryCode?', (req, res) => {
    const passportNumber = getData(req, 'passportNumber');
    const countryCode = getData(req, 'countryCode');

    if (!passportNumber || !countryCode) {
        return res.status(400).json({ error: 'Passport number and country code are required.' });
    }

    const validationResult = IDValidator.validatePassport(passportNumber, countryCode);

    if (!validationResult.valid) {
        return res.status(validationResult.status || 400).json({ error: validationResult.error });
    }

    res.status(200).json({ message: 'Passport is valid.' });
});

// route to validate CPF
/**
 * @swagger
 * /validate/validate-cpf/{cpfNumber}:
 *   post:
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
router.post('/validate-cpf/:cpfNumber?', (req, res) => {
    const cpfNumber = getData(req, 'cpfNumber');

    if (!cpfNumber) {
        return res.status(400).json({ error: 'CPF number is required.' });
    }

    const validationResult = IDValidator.validateCPF(cpfNumber);

    if (!validationResult.valid) {
        return res.status(validationResult.status || 400).json({ error: validationResult.error });
    }

    res.status(200).json({ message: 'CPF is valid.' });
});

// route to validate RG
/**
 * @swagger
 * /validate/validate-rg/{rgNumber}:
 *   post:
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
router.post('/validate-rg/:rgNumber?', (req, res) => {
    const rgNumber = getData(req, 'rgNumber');

    if (!rgNumber) {
        return res.status(400).json({ error: 'RG number is required.' });
    }

    const validationResult = IDValidator.validateRG(rgNumber);

    if (!validationResult.valid) {
        return res.status(validationResult.status || 400).json({ error: validationResult.error });
    }

    res.status(200).json({ message: 'RG is valid.' });
});

// route to validate SUS
/**
 * @swagger
 * /validate/validate-sus/{susNumber}:
 *   post:
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
router.post('/validate-sus/:susNumber?', (req, res) => {
    const susNumber = getData(req, 'susNumber');

    if (!susNumber) {
        return res.status(400).json({ error: 'SUS number is required.' });
    }

    const validationResult = IDValidator.validateSUS(susNumber);

    if (!validationResult.valid) {
        return res.status(validationResult.status || 400).json({ error: validationResult.error });
    }

    res.status(200).json({ message: 'SUS number is valid.' });
});

// route to validate CNH
/**
 * @swagger
 * /validate/validate-cnh/{cnhNumber}:
 *   post:
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
router.post('/validate-cnh/:cnhNumber?', (req, res) => {
    const cnhNumber = getData(req, 'cnhNumber');

    if (!cnhNumber) {
        return res.status(400).json({ error: 'CNH number is required.' });
    }

    const validationResult = IDValidator.validateCNH(cnhNumber);

    if (!validationResult.valid) {
        return res.status(validationResult.status || 400).json({ error: validationResult.error });
    }

    res.status(200).json({ message: 'CNH is valid.' });
});

// route to validate CTPS
/**
 * @swagger
 * /validate/validate-ctps/{ctpsNumber}:
 *   post:
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
router.post('/validate-ctps/:ctpsNumber?', (req, res) => {
    const ctpsNumber = getData(req, 'ctpsNumber');

    if (!ctpsNumber) {
        return res.status(400).json({ error: 'CTPS number is required.' });
    }

    const validationResult = IDValidator.validateCTPS(ctpsNumber);

    if (!validationResult.valid) {
        return res.status(validationResult.status || 400).json({ error: validationResult.error });
    }

    res.status(200).json({ message: 'CTPS is valid.' });
});

// route to validate CRM
/**
 * @swagger
 * /validate/validate-crm/{crmNumber}:
 *   post:
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
router.post('/validate-crm/:crmNumber?', (req, res) => {
    const crmNumber = getData(req, 'crmNumber');

    if (!crmNumber) {
        return res.status(400).json({ error: 'CRM number is required.' });
    }

    const validationResult = IDValidator.validateCRM(crmNumber);

    if (!validationResult.valid) {
        return res.status(validationResult.status || 400).json({ error: validationResult.error });
    }

    res.status(200).json({ message: 'CRM is valid.' });
});

// route to validate OAB
/**
 * @swagger
 * /validate/validate-oab/{oabNumber}:
 *   post:
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
router.post('/validate-oab/:oabNumber?', (req, res) => {
    const oabNumber = getData(req, 'oabNumber');

    if (!oabNumber) {
        return res.status(400).json({ error: 'OAB number is required.' });
    }

    const validationResult = IDValidator.validateOAB(oabNumber);

    if (!validationResult.valid) {
        return res.status(validationResult.status || 400).json({ error: validationResult.error });
    }

    res.status(200).json({ message: 'OAB is valid.' });
});

// route to validate CREA
/**
 * @swagger
 * /validate/validate-crea/{creaNumber}:
 *   post:
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
router.post('/validate-crea/:creaNumber?', (req, res) => {
    const creaNumber = getData(req, 'creaNumber');

    if (!creaNumber) {
        return res.status(400).json({ error: 'CREA number is required.' });
    }

    const validationResult = IDValidator.validateCREA(creaNumber);

    if (!validationResult.valid) {
        return res.status(validationResult.status || 400).json({ error: validationResult.error });
    }

    res.status(200).json({ message: 'CREA is valid.' });
});

// route to validate PIS/PASEP 
/**
 * @swagger
 * /validate/validate-pis-pasep/{pis}:
 *   post:
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
router.post('/validate-pis-pasep/:pis?', (req, res) => {
    const creaNumber = getData(req, 'pis');

    if (!creaNumber) {
        return res.status(400).json({ error: 'PIS number is required.' });
    }

    const validationResult = IDValidator.validatePIS(creaNumber);

    if (!validationResult.valid) {
        return res.status(validationResult.status || 400).json({ error: validationResult.error });
    }

    res.status(200).json({ message: 'PIS-PASEP is valid.' });
});


// route to validate CNPJ
/**
 * @swagger
 * /validate/validate-cnpj/{cnpj}:
 *   post:
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
router.post('/validate-cnpj/:cnpj?', (req, res) => {
    const creaNumber = getData(req, 'cnpj');

    if (!creaNumber) {
        return res.status(400).json({ error: 'CNPJ number is required.' });
    }

    const validationResult = IDValidator.validateCNPJ(creaNumber);

    if (!validationResult.valid) {
        return res.status(validationResult.status || 400).json({ error: validationResult.error });
    }

    res.status(200).json({ message: 'CNPJ is valid.' });
});



// Route to validate US Driver's License
/**
 * @swagger
 * /validate/validate-us-license/{licenseNumber}:
 *   post:
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
router.post('/validate-us-license/:licenseNumber?', (req, res) => {
    const licenseNumber = getData(req, 'licenseNumber');
    if (!licenseNumber) return res.status(400).json({ error: 'License number is required.' });
    const validationResult = IDValidator.validateUSDriversLicense(licenseNumber);
    if (!validationResult.valid) return res.status(400).json({ error: validationResult.error });
    res.status(200).json({ message: 'US Driver\'s License is valid.' });
});

// Route to validate US SSN
/**
 * @swagger
 * /validate/validate-us-ssn/{ssn}:
 *   post:
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
router.post('/validate-us-ssn/:ssn?', (req, res) => {
    const ssn = getData(req, 'ssn');
    if (!ssn) return res.status(400).json({ error: 'SSN is required.' });
    const validationResult = IDValidator.validateUSSSN(ssn);
    if (!validationResult.valid) return res.status(400).json({ error: validationResult.error });
    res.status(200).json({ message: 'SSN is valid.' });
});

// Route to validate US Military ID
/**
 * @swagger
 * /validate/validate-us-military-id/{militaryID}:
 *   post:
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
router.post('/validate-us-military-id/:militaryID?', (req, res) => {
    const militaryID = getData(req, 'militaryID');
    if (!militaryID) return res.status(400).json({ error: 'Military ID is required.' });
    const validationResult = IDValidator.validateUSMilitaryID(militaryID);
    if (!validationResult.valid) return res.status(400).json({ error: validationResult.error });
    res.status(200).json({ message: 'US Military ID is valid.' });
});

// Route to validate UK National Insurance Number
/**
 * @swagger
 * /validate/validate-uk-ni/{niNumber}:
 *   post:
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
router.post('/validate-uk-ni/:niNumber?', (req, res) => {
    const niNumber = getData(req, 'niNumber');
    if (!niNumber) return res.status(400).json({ error: 'NI Number is required.' });
    const validationResult = IDValidator.validateUKNINumber(niNumber);
    if (!validationResult.valid) return res.status(400).json({ error: validationResult.error });
    res.status(200).json({ message: 'UK NI Number is valid.' });
});

// Route to validate Canadian SIN (Social Insurance Number)
/**
 * @swagger
 * /validate/validate-ca-sin/{sinNumber}:
 *   post:
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
router.post('/validate-ca-sin/:sinNumber?', (req, res) => {
    const niNumber = getData(req, 'sinNumber');
    if (!niNumber) return res.status(400).json({ error: 'SIN Number is required.' });
    const validationResult = IDValidator.validateCanadianSIN(niNumber);
    if (!validationResult.valid) return res.status(400).json({ error: validationResult.error });
    res.status(200).json({ message: 'Canadian SIN Number is valid.' });
});



// Route to validate Mexican CURP (Clave Única de Registro de Población)
/**
 * @swagger
 * /validate/validate-mx-curp/{curpNumber}:
 *   post:
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
router.post('/validate-mx-curp/:curpNumber?', (req, res) => {
    const niNumber = getData(req, 'curpNumber');
    if (!niNumber) return res.status(400).json({ error: 'CURP Number is required.' });
    const validationResult = IDValidator.validateCanadianSIN(curpNumber);
    if (!validationResult.valid) return res.status(400).json({ error: validationResult.error });
    res.status(200).json({ message: 'Mexican CURP Number is valid.' });
});


// Route to validate South Korean RRN (Resident Registration Number)
/**
 * @swagger
 * /validate/validate-kr-rrn/{rrnNumber}:
 *   post:
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
router.get('/validate-kr-rrn/:rrnNumber?', (req, res) => {
    const rrnNumber = getData(req, 'rrnNumber');
    if (!rrnNumber) return res.status(400).json({ error: 'RRN Number is required.' });
    const validationResult = IDValidator.validateSouthKoreanRRN(rrnNumber);

    if (!validationResult.valid) return res.status(400).json({ error: validationResult.error });
    res.status(200).json({ message: 'South Korean RRN is valid.' });
});


export default router;