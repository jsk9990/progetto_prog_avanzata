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
exports.getIDforUpdate = void 0;
const Grafo_1 = require("../Model/Grafo");
const Utente_1 = require("../Model/Utente");
function getIDforUpdate(jwtDecode, id_grafo) {
    return __awaiter(this, void 0, void 0, function* () {
        const utente = yield Utente_1.Utente.findOne({ where: { email: jwtDecode.email, password: jwtDecode.password } });
        const id_utente_request = utente === null || utente === void 0 ? void 0 : utente.getDataValue('id_utente');
        const grafo = yield Grafo_1.Grafo.findOne({ where: { id_grafo: id_grafo } });
        const id_utente_response = grafo === null || grafo === void 0 ? void 0 : grafo.getDataValue('id_utente');
        let id = [];
        return id = [id_utente_request, id_utente_response];
    });
}
exports.getIDforUpdate = getIDforUpdate;
