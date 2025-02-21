import { Router } from 'express';
import IDValidator from '../utils/IDValidator.js';

const router = new Router();

// Helper function to extract data from req.body or req.params
const getData = (req, field) => req.body[field] || req.params[field];

// route to validate user fields
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

export default router;