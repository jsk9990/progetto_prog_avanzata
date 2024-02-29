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
exports.preprareData = void 0;
const Grafo_1 = require("../Model/Grafo");
const Nodi_1 = require("../Model/Nodi");
function preprareData(arco, id_grafo) {
    return __awaiter(this, void 0, void 0, function* () {
        const grafo = yield Grafo_1.Grafo.findByPk(id_grafo);
        if (!grafo) {
            throw new Error('Grafo non trovato');
        }
        // Fetch all nodes and edges associated with the graph
        const nodi = yield Nodi_1.Nodi.findAll({ where: { id_grafo } });
        const archi = arco;
        const risultato = {
            archi: archi.map((arco) => {
                // Find the start and end node for each edge
                const nodoPartenza = nodi.find(nodo => nodo.getDataValue('id_nodi') === arco.getDataValue('id_nodo_partenza'));
                const nodoArrivo = nodi.find(nodo => nodo.getDataValue('id_nodi') === arco.getDataValue('id_nodo_arrivo'));
                // Return the edge with its weight
                return {
                    [nodoPartenza === null || nodoPartenza === void 0 ? void 0 : nodoPartenza.getDataValue('nodo_nome')]: {
                        [nodoArrivo === null || nodoArrivo === void 0 ? void 0 : nodoArrivo.getDataValue('nodo_nome')]: arco.getDataValue('peso'),
                    }
                };
            }),
        };
        return risultato;
    });
}
exports.preprareData = preprareData;
