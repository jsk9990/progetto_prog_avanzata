"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertiArchiInFormatoDijkstra = void 0;
function convertiArchiInFormatoDijkstra(archi) {
    const grafoDijkstra = {};
    archi.forEach(arco => {
        const nodoPartenza = Object.keys(arco)[0];
        const nodoArrivo = Object.keys(arco[nodoPartenza])[0];
        const peso = arco[nodoPartenza][nodoArrivo];
        if (!grafoDijkstra[nodoPartenza]) {
            grafoDijkstra[nodoPartenza] = {};
        }
        grafoDijkstra[nodoPartenza][nodoArrivo] = peso;
    });
    return grafoDijkstra;
}
exports.convertiArchiInFormatoDijkstra = convertiArchiInFormatoDijkstra;
