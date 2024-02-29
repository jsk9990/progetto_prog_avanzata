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
exports.gestioneRichiesta = void 0;
const Richieste_1 = require("../Model/Richieste");
function gestioneRichiesta(jwtDecode, id_grafo, id_richieste) {
    return __awaiter(this, void 0, void 0, function* () {
        const richieste = yield Richieste_1.Richieste.findOne({
            where: {
                id_richieste: id_richieste,
            },
            attributes: ['id_richieste', 'id_grafo', 'id_utente_request', 'id_utente_response', 'descrizione', 'modifiche', 'stato_richiesta']
        });
        if ((richieste === null || richieste === void 0 ? void 0 : richieste.getDataValue('stato_richiesta')) === 'accettata') {
            return richieste === null || richieste === void 0 ? void 0 : richieste.getDataValue('stato_richiesta');
        }
        else if ((richieste === null || richieste === void 0 ? void 0 : richieste.getDataValue('stato_richiesta')) === 'rifiutata') {
            return richieste === null || richieste === void 0 ? void 0 : richieste.getDataValue('stato_richiesta');
        }
        else {
            return richieste === null || richieste === void 0 ? void 0 : richieste.getDataValue('stato_richiesta');
        }
    });
}
exports.gestioneRichiesta = gestioneRichiesta;
