"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.exportRichieste = exports.getRichiestePerUtente = exports.getRichiestePerModello = exports.viewRichiestePerData = exports.approvaRichiesta = exports.getRichieste = exports.updateArcoAfterRequest = exports.updateGrafo = exports.getSimulazione = exports.calcolaPercorsoMinimo = exports.returnGrafo = exports.creaGrafo = void 0;
const Grafo_1 = require("../Model/Grafo");
const Nodi_1 = require("../Model/Nodi");
const Archi_1 = require("../Model/Archi");
const Utente_1 = require("../Model/Utente");
const Richieste_1 = require("../Model/Richieste");
const node_dijkstra_1 = __importDefault(require("node-dijkstra")); // Importa la libreria node-dijkstra
require("dotenv/config");
const getGrafoConNodiEArchi_1 = require("../Utilitis/getGrafoConNodiEArchi");
const convertiArchiInFormatoDijkstra_1 = require("../Utilitis/convertiArchiInFormatoDijkstra");
const calcolaCostoGrafo_1 = require("../Utilitis/calcolaCostoGrafo");
const prepareDataPerSimulazione_1 = require("../Utilitis/prepareDataPerSimulazione");
const getIDforUpdate_1 = require("../Utilitis/getIDforUpdate");
const gestioneRichieste_1 = require("../Utilitis/gestioneRichieste");
const verifiedPropriety_1 = require("../Utilitis/verifiedPropriety");
const updateArco_1 = require("../Utilitis/updateArco");
const sequelize_1 = require("sequelize");
const formatConverter_1 = require("../Utilitis/formatConverter");
const formatConverter_2 = require("../Utilitis/formatConverter");
const formatConverter_3 = require("../Utilitis/formatConverter");
//-------------Crea Grafo---------------------------------- 
function creaGrafo(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        //Dati dal body
        const { nome_grafo, struttura, jwtDecode } = req.body;
        //Trovo utente 
        const utente = yield Utente_1.Utente.findOne({ where: { email: jwtDecode.email, password: jwtDecode.password } });
        const id_utente = utente === null || utente === void 0 ? void 0 : utente.getDataValue('id_utente');
        if (!id_utente) {
            return res.status(400).json({ message: 'Utente non trovato' });
        }
        //verifico il credito >0 
        if ((utente === null || utente === void 0 ? void 0 : utente.dataValues.credito) < 0) {
            return res.status(400).json({ message: 'Credito esaurito: Contattare admin per la ricarica' });
        }
        //richiamo la funzione per il calcolo del costo del grafo secondo le specifiche di traccia 
        const costoTotale = yield (0, calcolaCostoGrafo_1.calcolaCostoGrafo)(req, res, utente, utente === null || utente === void 0 ? void 0 : utente.dataValues.credito, struttura);
        //creazione del grafo 
        try {
            const nuovoGrafo = yield Grafo_1.Grafo.create({ nome_grafo, id_utente, costo: costoTotale });
            const rappresentazione_grafo = {};
            const grafoDijkstra = new node_dijkstra_1.default();
            for (const arco of struttura) {
                const { nodo_partenza, nodo_arrivo, peso } = arco;
                let nodoPartenza = yield Nodi_1.Nodi.findOne({
                    where: {
                        nodo_nome: nodo_partenza,
                        id_grafo: nuovoGrafo.dataValues.id_grafo
                    }
                });
                if (!nodoPartenza) {
                    nodoPartenza = yield Nodi_1.Nodi.create({
                        nodo_nome: nodo_partenza,
                        id_grafo: nuovoGrafo.dataValues.id_grafo
                    });
                }
                let nodoArrivo = yield Nodi_1.Nodi.findOne({
                    where: {
                        nodo_nome: nodo_arrivo,
                        id_grafo: nuovoGrafo.dataValues.id_grafo
                    }
                });
                if (!nodoArrivo) {
                    nodoArrivo = yield Nodi_1.Nodi.create({
                        nodo_nome: nodo_arrivo,
                        id_grafo: nuovoGrafo.dataValues.id_grafo
                    });
                }
                const nuovoArco = yield Archi_1.Archi.create({
                    id_grafo: nuovoGrafo.dataValues.id_grafo,
                    id_nodo_partenza: nodoPartenza.dataValues.id_nodi,
                    id_nodo_arrivo: nodoArrivo.dataValues.id_nodi,
                    peso
                });
                grafoDijkstra.addNode(nodo_partenza, { [nodo_arrivo]: peso });
                if (!rappresentazione_grafo[nodo_partenza]) {
                    rappresentazione_grafo[nodo_partenza] = {};
                }
                rappresentazione_grafo[nodo_partenza][nodo_arrivo] = {
                    peso: peso,
                    id_arco: nuovoArco.dataValues.id_archi
                };
            }
            return res.status(201).json({
                message: 'Grafo creato con successo',
                grafo: rappresentazione_grafo,
                costo: costoTotale
            });
        }
        catch (error) {
            return res.status(500).json({
                message: 'Errore nella creazione del grafo',
                error: error
            });
        }
    });
}
exports.creaGrafo = creaGrafo;
//-------------Ritorno modelli fatti da un utente specifico oppure tutti-----
function returnGrafo(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const risultati = [];
            const grafo = yield Grafo_1.Grafo.findAll();
            for (let i = 0; i < grafo.length; i++) {
                const archi = yield Archi_1.Archi.findAll({ where: { id_grafo: grafo[i].dataValues.id_grafo } });
                const nodi = yield Nodi_1.Nodi.findAll({ where: { id_grafo: grafo[i].dataValues.id_grafo } });
                risultati.push({ nome_grafo: grafo[i].dataValues.nome_grafo, id_utente: grafo[i].dataValues.id_utente, costo: grafo[i].dataValues.costo, id_grafo: grafo[i].dataValues.id_grafo, archi, nodi });
            }
            return res.status(200).json({ grafi: risultati });
        }
        catch (error) {
            return res.status(404).json({ message: 'Nessun grafo nel sistema' });
        }
    });
}
exports.returnGrafo = returnGrafo;
//--------------------------Calcola percorso minimo--------------------------
function calcolaPercorsoMinimo(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        // parametri nel req.body
        const { nome_grafo, nodo_partenza, nodo_arrivo, jwtDecode } = req.body;
        // trovo l'utente tramite il jwt
        const utente = yield Utente_1.Utente.findOne({ where: { email: jwtDecode.email, password: jwtDecode.password } });
        // prendo il credito dell'utente
        let creditoUtente = utente === null || utente === void 0 ? void 0 : utente.getDataValue('credito');
        // trovo il grafo
        const grafo = yield Grafo_1.Grafo.findOne({ where: { nome_grafo: nome_grafo } });
        // prendo l'ID del grafo
        const id_grafo = grafo === null || grafo === void 0 ? void 0 : grafo.getDataValue('id_grafo');
        // prendo il costo del grafo calcolato in fase di creazione del grafo
        const costoGrafo = grafo === null || grafo === void 0 ? void 0 : grafo.getDataValue('costo');
        // Controllo se l'utente ha abbastanza credito per calcolare il percorso minimo
        if (creditoUtente < costoGrafo) {
            res.status(400).json({ message: 'Credito insufficente per generare il grafo. Il credito disponibile è' + creditoUtente });
        }
        else if (utente) {
            try {
                // Utilizzo funzione per prendere nodi e archi
                const grafo = yield (0, getGrafoConNodiEArchi_1.getGrafoConNodiEArchi)(id_grafo);
                // Utilizzo funzione che formatta i dati nel modo appropriato richiesto dalla libreria
                const grafoDijkstraFormat = (0, convertiArchiInFormatoDijkstra_1.convertiArchiInFormatoDijkstra)(grafo.archi);
                // Calcola il percorso minimo usando la libreria node-dijkstra
                const startTime = performance.now();
                const grafoDijkstra = new node_dijkstra_1.default(grafoDijkstraFormat);
                const percorsoMinimo = grafoDijkstra.path(nodo_partenza, nodo_arrivo, { cost: true });
                const endTime = performance.now();
                const tempoDiEsecuzione = endTime - startTime;
                let risultato = JSON.stringify(percorsoMinimo);
                const risultatoJson = JSON.parse(risultato);
                if (risultatoJson.path === null) {
                    return res.status(404).json({ message: 'Percorso non trovato' });
                }
                // Aggiorna il credito dell'utente
                if (creditoUtente >= costoGrafo) {
                    creditoUtente = creditoUtente - costoGrafo;
                    utente.setDataValue('credito', creditoUtente);
                    yield utente.save();
                }
                // Ritorna il percorso, tempi e costo addebitato
                res.status(200).json({ percorso: percorsoMinimo, tempoEsecuzione: tempoDiEsecuzione, costoAddebbitato: costoGrafo, creditoResiduo: creditoUtente });
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ message: 'Errore nel calcolo del percorso minimo' });
            }
        }
    });
}
exports.calcolaPercorsoMinimo = calcolaPercorsoMinimo;
function getSimulazione(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        //prendo i dati dal req.body
        const { nome_grafo, id_arco, nodo_partenza, nodo_arrivo, start_peso, stop_peso, step } = req.body;
        //trovo il grafo
        const grafo = yield Grafo_1.Grafo.findOne({ where: { nome_grafo: nome_grafo } });
        if (!grafo) {
            return res.status(404).json({ error: 'Grafo non trovato' });
        }
        //prendo l'id del grafo
        const id_grafo = grafo.dataValues.id_grafo;
        //trovo tutti gli archi associati con id, e inizializzo l'array di risultati e di Best result
        const archi = yield Archi_1.Archi.findAll({ where: { id_grafo } });
        const archiOriginali = [...archi];
        const risultati = [];
        let bestResult = { cost: Infinity, configuration: [], path: [] };
        //ciclo per la simulazione 
        try {
            for (let peso = start_peso; peso <= stop_peso; peso += step) {
                // Mappa tutti gli archi e trova quello con l'id specificato
                const arcoTrovato = archi.find(arco => arco.getDataValue('id_archi') === id_arco);
                // Se l'arco è stato trovato, modificare il peso 
                if (arcoTrovato) {
                    arcoTrovato.setDataValue('peso', peso);
                    //Sostituisci l'arco modificato con l'array originale 
                    const index = archiOriginali.findIndex(arco => arco.getDataValue('id_archi') === id_arco);
                    if (index !== -1) {
                        archiOriginali[index] = arcoTrovato;
                    }
                }
                else {
                    console.log(`Nessun arco trovato con ID ${id_arco}`);
                }
                //funzioni per la preparazione del grafo
                const graphData = yield (0, prepareDataPerSimulazione_1.preprareData)(archiOriginali, id_grafo);
                const grafoDijkstraFormat = (0, convertiArchiInFormatoDijkstra_1.convertiArchiInFormatoDijkstra)(graphData.archi);
                // Calcola il percorso minimo usando la libreria node-dijkstra
                const grafoSimulato = new node_dijkstra_1.default(grafoDijkstraFormat);
                const risultato = grafoSimulato.path(nodo_partenza, nodo_arrivo, { cost: true });
                const risultato1 = JSON.parse(JSON.stringify(risultato));
                //inserisco nell'array di risultati
                if (typeof risultato === 'object' && 'cost' in risultato && 'path' in risultato) {
                    risultati.push({ peso, cost: risultato1.cost, path: risultato1.path });
                }
                //controllo il best result se deve essere aggiornato con i dati dell'ultima iterazione 
                if (risultato1.cost <= bestResult.cost) {
                    bestResult = { cost: risultato1.cost, configuration: [`${peso}`], path: risultato1.path };
                }
            }
        }
        catch (error) {
            // Log and rethrow any errors encountered
            console.error(error);
            throw error;
        }
        res.json({ risultati, bestResult });
    });
}
exports.getSimulazione = getSimulazione;
//---------------------UPDATE----------------------
function updateGrafo(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        //estrapolo i dati dal req.body e trovo l'id del grafo. Poi richiamo 
        //la funzione necessaria per verificare la proprietà del grafo
        const { nome_grafo, jwtDecode, id_archi, descrizione, peso } = req.body;
        const grafo = yield Grafo_1.Grafo.findOne({ where: { nome_grafo: nome_grafo } });
        const id_grafo = grafo === null || grafo === void 0 ? void 0 : grafo.dataValues.id_grafo;
        const verifica = yield (0, verifiedPropriety_1.verifiedPropriety)(jwtDecode, id_grafo);
        //se la verifica è andata a buon fine, allora faccio l'update del grafo
        //con la creazione di una richiesta già accettata
        if (verifica === true) {
            const update = yield (0, updateArco_1.updateArco)(id_grafo, id_archi, peso);
            const data = yield (0, getIDforUpdate_1.getIDforUpdate)(jwtDecode, id_grafo);
            const richiesta = yield Richieste_1.Richieste.create({
                id_utente_request: data[0],
                id_utente_response: data[1],
                id_grafo: id_grafo,
                descrizione: descrizione,
                modifiche: {
                    "ID arco modificato ": id_archi,
                    "peso nuovo ": peso,
                    "nome_grafo": nome_grafo
                },
                stato_richiesta: 'accettata'
            });
            res.json({
                message: "Grafo aggiornato con successo", update: update, msg: "Richiesta", richiesta: richiesta
            });
        }
        //nel caso in cui la verifica non è andata a buon fine, ovvero 
        //l'utente loggato non ha i privilegi per effettuare l'update del grafo
        //allora verrà creata una richiesta di pending
        if (verifica === false) {
            const data = yield (0, getIDforUpdate_1.getIDforUpdate)(jwtDecode, id_grafo);
            const richiesta = yield Richieste_1.Richieste.create({
                id_utente_request: data[0],
                id_utente_response: data[1],
                id_grafo: id_grafo,
                descrizione: descrizione,
                modifiche: {
                    "ID arco modificato ": id_archi,
                    "peso nuovo ": peso,
                    "nome_grafo": nome_grafo
                },
            });
            res.json(richiesta);
        }
    });
}
exports.updateGrafo = updateGrafo;
//----------------UPDATE ARCO AFTER REQUEST -----------------
//questa funzione serve per modificare l'arco dopo aver effettuato una richiesta di modifica e questa è stata accettata
function updateArcoAfterRequest(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { jwtDecode, nome_grafo, id_richieste } = req.body;
        const grafo = yield Grafo_1.Grafo.findOne({ where: { nome_grafo: nome_grafo } });
        const id_grafo = grafo === null || grafo === void 0 ? void 0 : grafo.dataValues.id_grafo;
        const risultatoRichiesta = yield (0, gestioneRichieste_1.gestioneRichiesta)(jwtDecode, id_grafo, id_richieste);
        const richieste = yield Richieste_1.Richieste.findOne({
            where: {
                id_richieste: id_richieste,
            },
            attributes: ['id_richieste', 'id_grafo', 'id_utente_request', 'id_utente_response', 'descrizione', 'modifiche', 'stato_richiesta']
        });
        const modifiche = richieste === null || richieste === void 0 ? void 0 : richieste.getDataValue('modifiche');
        const id_archi = modifiche['ID arco modificato '];
        const peso = modifiche['peso nuovo '];
        const nome_grafo_modifiche = modifiche['nome_grafo'];
        try {
            if (nome_grafo === nome_grafo_modifiche) {
                if (risultatoRichiesta === 'accettata') {
                    const update = yield (0, updateArco_1.updateArco)(id_grafo, id_archi, peso);
                    res.status(200).json({ risultatoRichiesta: risultatoRichiesta, update: update });
                }
                else if (risultatoRichiesta === 'rifiutata') {
                    res.json('Richiesta rifiutata');
                }
                else {
                    res.json('Richiesta in attesa');
                }
            }
            else {
                return res.status(404).json({ error: 'Nome del grafo non corrispondente' });
            }
        }
        catch (err) {
            return res.status(500).json({ error: err });
        }
    });
}
exports.updateArcoAfterRequest = updateArcoAfterRequest;
//-----------------GET RICHIESTE-----------------------
//Ritorna tutte le richieste di un utente
function getRichieste(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { jwtDecode, nome_grafo } = req.body;
        const utente = yield Utente_1.Utente.findOne({ where: { email: jwtDecode.email, password: jwtDecode.password } });
        const id_utente = utente === null || utente === void 0 ? void 0 : utente.dataValues.id_utente;
        const grafo = yield Grafo_1.Grafo.findOne({ where: { nome_grafo: nome_grafo, id_utente: id_utente } });
        try {
            if (!grafo) {
                return res.json('Grafo non trovato');
            }
            const id_grafo = grafo === null || grafo === void 0 ? void 0 : grafo.dataValues.id_grafo;
            const richieste = yield Richieste_1.Richieste.findAll({ where: { id_grafo: id_grafo, id_utente_response: id_utente }, attributes: ['id_richieste', 'id_grafo', 'id_utente_request', 'id_utente_response', 'descrizione', 'modifiche', 'stato_richiesta'] });
            res.status(200).json({ richieste: richieste });
        }
        catch (err) {
            res.json({ error: err, message: 'Grafo non trovato' });
        }
    });
}
exports.getRichieste = getRichieste;
//-----------APPROVA RICHIESTA-----------------------
//funzione per l'approvazione di una richiesta in fase di pending
function approvaRichiesta(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { jwtDecode, id_richieste, stato_richiesta } = req.body;
        const utente = yield Utente_1.Utente.findOne({ where: { email: jwtDecode.email, password: jwtDecode.password } });
        const id_utente = utente === null || utente === void 0 ? void 0 : utente.dataValues.id_utente;
        if (stato_richiesta === 'accettata') {
            const update = yield Richieste_1.Richieste.findOne({ where: { id_richieste: id_richieste, id_utente_response: id_utente }, attributes: ['id_richieste', 'id_grafo', 'id_utente_request', 'id_utente_response', 'descrizione', 'modifiche', 'stato_richiesta'] });
            if (update) {
                update.setDataValue('stato_richiesta', 'accettata');
                yield (update === null || update === void 0 ? void 0 : update.save());
            }
            res.status(200).json({ update: update });
        }
        else if (stato_richiesta === 'rifiutata') {
            const update = yield Richieste_1.Richieste.findOne({ where: { id_richieste: id_richieste, id_utente_response: id_utente }, attributes: ['id_richieste', 'id_grafo', 'id_utente_request', 'id_utente_response', 'descrizione', 'modifiche', 'stato_richiesta'] });
            if (update) {
                update === null || update === void 0 ? void 0 : update.setDataValue('stato_richiesta', 'rifiutata');
                yield (update === null || update === void 0 ? void 0 : update.save());
            }
            res.status(200).json({ update: update });
        }
    });
}
exports.approvaRichiesta = approvaRichiesta;
//--------------VIEW RICHIESTE PER DATA -----------------------
//funzione per la visualizzazione delle richieste in base alla data
function viewRichiestePerData(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { jwtDecode, nome_grafo, from, to, stato } = req.body;
        const utente = yield Utente_1.Utente.findOne({ where: { email: jwtDecode.email, password: jwtDecode.password } });
        const id_utente = utente === null || utente === void 0 ? void 0 : utente.dataValues.id_utente;
        const grafo = yield Grafo_1.Grafo.findOne({ where: { nome_grafo: nome_grafo, id_utente: id_utente } });
        const id_grafo = grafo === null || grafo === void 0 ? void 0 : grafo.dataValues.id_grafo;
        try {
            if (stato === 'accettata') {
                const richieste = yield Richieste_1.Richieste.findAll({ where: { id_grafo: id_grafo, update_date: { [sequelize_1.Op.gte]: from, [sequelize_1.Op.lte]: to }, stato_richiesta: 'accettata' }, attributes: ['id_richieste', 'id_grafo', 'id_utente_request', 'id_utente_response', 'descrizione', 'modifiche', 'stato_richiesta'] });
                console.log(richieste);
                if (!richieste) {
                    return res.status(404).json({ error: 'Grafo non ha richieste accettate' });
                }
                res.status(200).json({ richieste: richieste });
            }
            if (stato === 'rifiutata') {
                const richieste = yield Richieste_1.Richieste.findAll({ where: { id_grafo: id_grafo, update_date: { [sequelize_1.Op.gte]: from, [sequelize_1.Op.lte]: to }, stato_richiesta: 'rifiutata' }, attributes: ['id_richieste', 'id_grafo', 'id_utente_request', 'id_utente_response', 'descrizione', 'modifiche', 'stato_richiesta'] });
                if (!richieste) {
                    return res.status(404).json({ error: 'Grafo non ha richieste rifiutate' });
                }
                res.status(200).json({ richieste: richieste });
            }
        }
        catch (err) {
            res.status(404).json({ error: err });
        }
    });
}
exports.viewRichiestePerData = viewRichiestePerData;
//--------------VIEW RICHIESTE PER MODELLO ---------------------
//funzione per la visualizzazione delle richieste in base al modello
function getRichiestePerModello(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { nome_grafo, jwtDecode } = req.body;
        const grafo = yield Grafo_1.Grafo.findOne({ where: { nome_grafo: nome_grafo } });
        if (!grafo) {
            return res.status(404).json({ message: 'Grafo con il nome fornito non trovato/ non presente sul database' });
        }
        const id_grafo = grafo === null || grafo === void 0 ? void 0 : grafo.dataValues.id_grafo;
        const utente = yield Utente_1.Utente.findOne({ where: { email: jwtDecode.email, password: jwtDecode.password } });
        const id_utente = utente === null || utente === void 0 ? void 0 : utente.dataValues.id_utente;
        const richieste = yield Richieste_1.Richieste.findAll({ where: { id_grafo: id_grafo, stato_richiesta: 'pending' }, attributes: ['id_richieste', 'id_grafo', 'id_utente_request', 'id_utente_response', 'descrizione', 'modifiche', 'stato_richiesta'] });
        res.status(200).json({ message: "Richieste in pending per il modello selezionato", richieste: richieste });
    });
}
exports.getRichiestePerModello = getRichiestePerModello;
//-----------------GET RICHIESTE PER UTENTE ------------------------
//funzione per la visualizzazione delle richieste in base all'utente
function getRichiestePerUtente(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { jwtDecode } = req.body;
        const utente = yield Utente_1.Utente.findOne({ where: { email: jwtDecode.email, password: jwtDecode.password } });
        const id_utente = utente === null || utente === void 0 ? void 0 : utente.dataValues.id_utente;
        const richieste = yield Richieste_1.Richieste.findAll({ where: { id_utente_response: id_utente, stato_richiesta: 'pending' }, attributes: ['id_richieste', 'id_grafo', 'id_utente_request', 'id_utente_response', 'descrizione', 'modifiche', 'stato_richiesta'] });
        res.status(200).json({ message: "Richieste in pending per l'utente selezionato", richieste: richieste });
    });
}
exports.getRichiestePerUtente = getRichiestePerUtente;
//----------------------EXPORT DATA -------------------------------
//funzione per l'esportazione dei dati di richieste in base alla data e allo stato
function exportRichieste(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { jwtDecode, nome_grafo, from, to, stato_richiesta, format } = req.body;
        try {
            const utente = yield Utente_1.Utente.findOne({ where: { email: jwtDecode.email, password: jwtDecode.password } });
            const id_utente = utente === null || utente === void 0 ? void 0 : utente.dataValues.id_utente;
            const grafo = yield Grafo_1.Grafo.findOne({ where: { nome_grafo: nome_grafo, id_utente: id_utente } });
            const id_grafo = grafo === null || grafo === void 0 ? void 0 : grafo.dataValues.id_grafo;
            const richieste = yield Richieste_1.Richieste.findAll({ where: { id_grafo: id_grafo, update_date: { [sequelize_1.Op.gte]: from, [sequelize_1.Op.lte]: to }, stato_richiesta: stato_richiesta }, attributes: ['id_richieste', 'id_grafo', 'id_utente_request', 'id_utente_response', 'descrizione', 'modifiche', 'stato_richiesta'] });
            //res.status(200).json({richieste : richieste});
            const dataValuesOnly = richieste.map((item) => item.dataValues);
            switch (format) {
                case 'csv':
                    const csv = (0, formatConverter_1.writeCSV)(dataValuesOnly);
                    res.setHeader('Content-Type', 'text/csv');
                    res.send(csv);
                    break;
                case 'pdf':
                    (0, formatConverter_2.generatePDF)(dataValuesOnly).then((pdf) => {
                        res.setHeader('Content-Type', 'application/pdf');
                        res.send(pdf);
                    })
                        .catch((err) => {
                        res.status(500).json({ error: err });
                    });
                    break;
                case 'xml':
                    const xml = (0, formatConverter_3.convertToXML)(dataValuesOnly);
                    res.setHeader('Content-Type', 'application/xml');
                    res.send(xml);
                    break;
                case 'json':
                default:
                    res.json(richieste);
                    break;
            }
        }
        catch (err) {
            res.json({ error: err, message: 'Errore interno' });
        }
    });
}
exports.exportRichieste = exportRichieste;
