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
exports.updateArco = void 0;
const Archi_1 = require("../Model/Archi");
require("dotenv/config");
function updateArco(id_grafo, id_archi, peso) {
    return __awaiter(this, void 0, void 0, function* () {
        const alpha = process.env.ALPHA ? (parseFloat(process.env.ALPHA) >= 0 && parseFloat(process.env.ALPHA) <= 1 ? parseFloat(process.env.ALPHA) : 0.8) : 0.8;
        const arco = yield Archi_1.Archi.findByPk(id_archi);
        const calcolo = alpha * (arco === null || arco === void 0 ? void 0 : arco.dataValues.peso) + (1 - alpha) * peso;
        arco === null || arco === void 0 ? void 0 : arco.update({ peso: calcolo });
        yield (arco === null || arco === void 0 ? void 0 : arco.save());
        const archi_aggiornati = yield Archi_1.Archi.findAll({ where: { id_grafo: id_grafo } });
        const risultato = JSON.parse(JSON.stringify(archi_aggiornati));
        return risultato;
    });
}
exports.updateArco = updateArco;
