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
exports.calcolaCostoGrafo = void 0;
function calcolaCostoGrafo(req, res, utente, credito, struttura) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (credito >= 0) {
                const costoPerNodo = process.env.COSTO_PER_NODO;
                const costoPerArco = process.env.COSTO_PER_ARCO;
                if (!costoPerNodo || !costoPerArco) {
                    return res.status(400).json({ message: 'Variabili di ambiente non settate correttamente, verificare il COSTO_PER_NODO/COSOT_PER_ARCO' });
                }
                //Map dei nodi della struttura
                const nodiUnici = new Set();
                struttura.forEach((arco) => {
                    nodiUnici.add(arco.nodo_partenza);
                    nodiUnici.add(arco.nodo_arrivo);
                });
                const numeroNodi = nodiUnici.size;
                //Map degli archi
                const numeroArchi = struttura.length;
                //calcolo costo totale
                const costoTotale = (numeroArchi * costoPerArco) + (numeroNodi * costoPerNodo);
                //aggiornamento credito utente 
                if (credito < costoTotale) {
                    //console.log ('Credito vecchio: ' + utente?.dataValues.credito);
                    return res.status(400).json({ message: 'Credito insufficente per generare il grafo. Il credito disponibile è', credito: credito });
                }
                else if (utente) {
                    utente.dataValues.credito = utente.dataValues.credito - costoTotale;
                    yield utente.setDataValue('credito', utente.dataValues.credito);
                    yield utente.save();
                }
                return costoTotale;
            }
        }
        catch (error) {
            return res.status(500).json({ message: 'Errore nella creazione del grafo', error: error });
        }
    });
}
exports.calcolaCostoGrafo = calcolaCostoGrafo;
