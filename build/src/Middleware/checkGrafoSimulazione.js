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
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkVerificaRequisiti = exports.checkGrafoSimulazione = void 0;
const Grafo_1 = require("../Model/Grafo");
const Archi_1 = require("../Model/Archi");
const Nodi_1 = require("../Model/Nodi");
function checkGrafoSimulazione(req, res, next) {
    const body = req.body;
    switch (true) {
        case (typeof body.nome_grafo !== 'string'):
            return res.status(400).json({ message: 'Nome del grafo non corretto' });
        case (typeof body.id_arco !== 'number'):
            return res.status(400).json({ message: 'ID arco non corretto' });
        case (typeof body.nodo_partenza !== 'string'):
            return res.status(400).json({ message: 'Nodo di partenza non corretto' });
        case (typeof body.nodo_arrivo !== 'string'):
            return res.status(400).json({ message: 'Nodo di arrivo non corretto' });
        case (typeof body.start_peso !== 'number'):
            return res.status(400).json({ message: 'Peso di partenza non corretto' });
        case (typeof body.stop_peso !== 'number'):
            return res.status(400).json({ message: 'Peso di arrivo non corretto' });
        case (typeof body.step !== 'number'):
            return res.status(400).json({ message: 'Step non corretto' });
        default:
            break;
    }
    if (body.start_peso > body.stop_peso) {
        return res.status(400).json({ message: 'start_peso deve essere minore o uguale a to stop_peso' });
    }
    if (body.step <= 0) {
        return res.status(400).json({ message: 'step deve essere maggiore di 0' });
    }
    next();
}
exports.checkGrafoSimulazione = checkGrafoSimulazione;
function checkVerificaRequisiti(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const body = req.body;
        const grafo = yield Grafo_1.Grafo.findOne({ where: { nome_grafo: body.nome_grafo } });
        if (!grafo) {
            return res.status(404).json({ error: `Non esiste un grafo con nome :    ${body.nome_grafo} ` });
        }
        const archi = yield Archi_1.Archi.findAll({ where: { id_grafo: grafo.dataValues.id_grafo } });
        const arcoTrovato = archi.find(arco => arco.getDataValue('id_archi') === body.id_arco);
        if (!arcoTrovato) {
            return res.status(404).json({ error: `Arco con ID ${body.id_arco} non trovato o non presente nel grafo` });
        }
        const nodi = yield Nodi_1.Nodi.findAll({ where: { id_grafo: grafo.dataValues.id_grafo } });
        const nodiTrovato = nodi.find(nodi => nodi.getDataValue('nodo_nome') === body.nodo_partenza);
        if (!nodiTrovato) {
            return res.status(404).json({ error: `Nodo di partenzacon nome ${body.nodo_partenza} non trovato o non presente nel grafo` });
        }
        const nodoTrovato = nodi.find(nodi => nodi.getDataValue('nodo_nome') === body.nodo_arrivo);
        if (!nodoTrovato) {
            return res.status(404).json({ error: `Nodo di arrivo con nome ${body.nodo_partenza} non trovato o non presente nel grafo` });
        }
        next();
    });
}
exports.checkVerificaRequisiti = checkVerificaRequisiti;
