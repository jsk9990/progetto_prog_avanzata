"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//---------------IMPORT-LIBRERIE-----------------------------------------------//
const express_1 = __importDefault(require("express")); //import express
require("dotenv/config");
//---------------IMPORT CONTROLLERS------------------------------------------//
const DB_1 = require("./src/Controller/DB"); //importo controller utente
const controllerUtente_1 = require("./src/Controller/controllerUtente");
const controllerGrafo_1 = require("./src/Controller/controllerGrafo");
//import { updateGrafo, updateArcoAfterRequest, getRichieste, approvaRichiesta, viewRichiestePerData, getRichiestePerModello, getRichiestePerUtente, exportRichieste} from './Controller/controllerGrafo3';
//----------------CONFIGURAZIONI INIZIALI----------------------------------------//
const app = (0, express_1.default)();
const port = process.env.EXPRESS_PORT;
app.use(express_1.default.json());
//-----------------CREAZIONE ROUTES----------------------------------------------//
//-------------------MIDDLEWARE-------------------------------------------------//
const generateToken_1 = require("./src/Middleware/generateToken");
const checkToken_1 = require("./src/Middleware/checkToken");
const checkUtente_1 = require("./src/Middleware/checkUtente");
const checkGrafoEsecuzione_1 = require("./src/Middleware/checkGrafoEsecuzione");
const decodeToken_1 = require("./src/Middleware/decodeToken");
const checkGrafo_1 = require("./src/Middleware/checkGrafo");
const checkAdmin_1 = require("./src/Middleware/checkAdmin");
const checkGrafoSimulazione_1 = require("./src/Middleware/checkGrafoSimulazione");
const checkGrafoUpdate_1 = require("./src/Middleware/checkGrafoUpdate");
const checkApprovaRichiesta_1 = require("./src/Middleware/checkApprovaRichiesta");
const checkGrafoAfterRequest_1 = require("./src/Middleware/checkGrafoAfterRequest");
const checkExport_1 = require("./src/Middleware/checkExport");
//-------------------ROUTES-------------------------------------------------//
app.get('/home', (req, res) => {
    (0, DB_1.testDbConnection)(req, res);
});
app.post('/login', checkUtente_1.checkEmailFormat, checkUtente_1.checkCredenziali, generateToken_1.generateToken, (req, res) => {
    res.json({
        message: 'Login effettuato con successo',
        message2: 'Ecco il tuo token:',
        token: req.body.token
    });
});
app.post('/sign_in', checkUtente_1.checkEmailFormat, checkUtente_1.checkUtente, generateToken_1.generateToken, (req, res) => {
    (0, controllerUtente_1.creaUtente)(req, res);
});
app.get('/utenti', checkToken_1.checkToken, (req, res) => {
    (0, controllerUtente_1.getUtenti)(req, res);
});
app.get('/utenti/admin', checkToken_1.checkToken, decodeToken_1.decodeToken, checkAdmin_1.checkAdmin, (req, res) => {
    (0, controllerUtente_1.getUtenti)(req, res);
});
app.post('/utenti/admin/ricaricaCredito', checkToken_1.checkToken, decodeToken_1.decodeToken, checkAdmin_1.checkAdmin, (req, res) => {
    (0, controllerUtente_1.updateCredito)(req, res);
});
app.post('/utenti/crea_grafo', checkToken_1.checkToken, decodeToken_1.decodeToken, checkGrafo_1.verificaStrutturaGrafo, checkGrafo_1.verificaGrafoConnesso, (req, res) => {
    (0, controllerGrafo_1.creaGrafo)(req, res);
});
app.post('/utenti/esecuzione_modello', checkToken_1.checkToken, decodeToken_1.decodeToken, checkGrafoEsecuzione_1.checkGrafoEsecuzione, (req, res) => {
    (0, controllerGrafo_1.calcolaPercorsoMinimo)(req, res);
});
app.post('/utenti/simulazione', checkToken_1.checkToken, checkGrafoSimulazione_1.checkGrafoSimulazione, checkGrafoSimulazione_1.checkVerificaRequisiti, (req, res) => {
    (0, controllerGrafo_1.getSimulazione)(req, res);
});
app.post('/utenti/aggiornaGrafo', checkToken_1.checkToken, decodeToken_1.decodeToken, checkGrafoUpdate_1.validateGrafoUpdate, (req, res) => {
    (0, controllerGrafo_1.updateGrafo)(req, res);
});
//prendo tutte le richieste 
app.get('/utenti/richieste', checkToken_1.checkToken, decodeToken_1.decodeToken, (req, res) => {
    (0, controllerGrafo_1.getRichieste)(req, res);
});
//prendo le richieste accettate e rifiutate in base alla data
app.get('/utenti/view_aggiornamenti', checkToken_1.checkToken, decodeToken_1.decodeToken, (req, res) => {
    (0, controllerGrafo_1.viewRichiestePerData)(req, res);
});
app.get('/utenti/richieste_per_singolo_modello', checkToken_1.checkToken, decodeToken_1.decodeToken, (req, res) => {
    (0, controllerGrafo_1.getRichiestePerModello)(req, res);
});
app.get('/utenti/richieste_per_singolo_utente', checkToken_1.checkToken, decodeToken_1.decodeToken, (req, res) => {
    (0, controllerGrafo_1.getRichiestePerUtente)(req, res);
});
app.post('/utenti/richieste/approvaRichiesta', checkToken_1.checkToken, decodeToken_1.decodeToken, checkApprovaRichiesta_1.checkRichiestaFormat, (req, res) => {
    (0, controllerGrafo_1.approvaRichiesta)(req, res);
});
app.post('/utenti/richieste/aggiornaGrafo', checkToken_1.checkToken, decodeToken_1.decodeToken, checkGrafoAfterRequest_1.checkFormatUpdateAfterRequest, checkGrafoAfterRequest_1.checkDataUpdateAfterRequest, (req, res) => {
    (0, controllerGrafo_1.updateArcoAfterRequest)(req, res);
});
app.use('/utenti/export', checkToken_1.checkToken, decodeToken_1.decodeToken, checkExport_1.checkExport, (req, res) => {
    (0, controllerGrafo_1.exportRichieste)(req, res);
});
//----------------------------------------------------------------------//
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
