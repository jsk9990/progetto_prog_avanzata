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
exports.verifiedPropriety = void 0;
const Grafo_1 = require("../Model/Grafo");
const Utente_1 = require("../Model/Utente");
function verifiedPropriety(jwtDecode, id_grafo) {
    return __awaiter(this, void 0, void 0, function* () {
        const grafo = yield Grafo_1.Grafo.findOne({ where: { id_grafo: id_grafo } });
        const utente = yield Utente_1.Utente.findOne({ where: { email: jwtDecode.email, password: jwtDecode.password } });
        if ((grafo === null || grafo === void 0 ? void 0 : grafo.dataValues.id_utente) === (utente === null || utente === void 0 ? void 0 : utente.dataValues.id_utente)) {
            return true;
        }
        else {
            return false;
        }
    });
}
exports.verifiedPropriety = verifiedPropriety;
