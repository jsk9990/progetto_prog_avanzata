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
exports.verificaGrafoConnesso = exports.verificaStrutturaGrafo = void 0;
const Grafo_1 = require("../Model/Grafo");
function verificaStrutturaGrafo(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const grafo = req.body;
        // Verifica che il nome del grafo sia già presente nel db 
        const nomeGrafo = yield Grafo_1.Grafo.findOne({ where: { nome_grafo: grafo.nome_grafo } });
        if (nomeGrafo) {
            return res.status(400).json({ errore: 'Questo nome è gia presente nel database, si prega di scegliere un altro nome' });
        }
        // Verifica che il nome del grafo sia presente e sia una stringa
        if (typeof grafo.nome_grafo !== 'string') {
            return res.status(400).json({ errore: 'Il campo "nome_grafo" deve essere una stringa.' });
        }
        // Verifica che la struttura sia un array
        if (!Array.isArray(grafo.struttura)) {
            return res.status(400).json({ errore: 'Il campo "struttura" deve essere un array.' });
        }
        // Verifica che ogni elemento dell'array abbia la struttura corretta
        for (const nodo of grafo.struttura) {
            if (typeof nodo.nodo_partenza !== 'string' ||
                typeof nodo.nodo_arrivo !== 'string' ||
                typeof nodo.peso !== 'number') {
                return res.status(400).json({ errore: 'Ogni elemento della "struttura" deve essere un oggetto con i campi "nodo_partenza", "nodo_arrivo" entrambi di tipo stringa,  e "peso" di tipo number.' });
            }
        }
        // Se tutto va bene, passa al prossimo middleware
        next();
    });
}
exports.verificaStrutturaGrafo = verificaStrutturaGrafo;
/*

export function verificaGrafoConnesso(req: Request, res: Response, next: NextFunction) {
    const grafo: Grafo = req.body;
    const nodi = new Set<string>();
    const mappaAdiacenza = new Map<string, Set<string>>();
  
    // Costruisce un set di nodi e una mappa di adiacenza
    grafo.struttura.forEach(arco => {
      nodi.add(arco.nodo_partenza);
      nodi.add(arco.nodo_arrivo);
  
      if (!mappaAdiacenza.has(arco.nodo_partenza)) {
        mappaAdiacenza.set(arco.nodo_partenza, new Set<string>());
      }
      mappaAdiacenza.get(arco.nodo_partenza)?.add(arco.nodo_arrivo);
    });
  
    // Funzione di utilità per eseguire una ricerca in profondità (DFS)
    function dfs(nodoAttuale: string, visitati: Set<string>) {
      visitati.add(nodoAttuale);
      mappaAdiacenza.get(nodoAttuale)?.forEach(vicino => {
        if (!visitati.has(vicino)) {
          dfs(vicino, visitati);
        }
      });
    }
  
    // Verifica che il grafo sia completamente connesso
    for (const nodo of nodi) {
      const visitati = new Set<string>();
      dfs(nodo, visitati);
  
      // Se il numero di nodi visitati è diverso dal numero totale di nodi, il grafo non è connesso
      if (visitati.size !== nodi.size) {
        return res.status(400).json({ errore: 'Il grafo fornito non è completamente connesso.' });
      }
    }
  
    // Se tutto va bene, passa al prossimo middleware
    next();
  }

  */
function verificaGrafoConnesso(req, res, next) {
    const grafo = req.body;
    const nodi = new Set();
    const mappaAdiacenza = new Map();
    // Costruisce un set di nodi e una mappa di adiacenza
    grafo.struttura.forEach(arco => {
        var _a, _b;
        nodi.add(arco.nodo_partenza);
        nodi.add(arco.nodo_arrivo);
        if (!mappaAdiacenza.has(arco.nodo_partenza)) {
            mappaAdiacenza.set(arco.nodo_partenza, new Set());
        }
        (_a = mappaAdiacenza.get(arco.nodo_partenza)) === null || _a === void 0 ? void 0 : _a.add(arco.nodo_arrivo);
        // Aggiunta del percorso inverso per considerare il grafo non orientato
        if (!mappaAdiacenza.has(arco.nodo_arrivo)) {
            mappaAdiacenza.set(arco.nodo_arrivo, new Set());
        }
        (_b = mappaAdiacenza.get(arco.nodo_arrivo)) === null || _b === void 0 ? void 0 : _b.add(arco.nodo_partenza);
    });
    // Funzione di utilità per eseguire una ricerca in profondità (DFS)
    function dfs(nodoAttuale, visitati) {
        var _a;
        visitati.add(nodoAttuale);
        (_a = mappaAdiacenza.get(nodoAttuale)) === null || _a === void 0 ? void 0 : _a.forEach(vicino => {
            if (!visitati.has(vicino)) {
                dfs(vicino, visitati);
            }
        });
    }
    // Verifica che il grafo sia completamente connesso
    const visitati = new Set();
    dfs(Array.from(nodi)[0], visitati); // Inizia la DFS dal primo nodo
    // Se il numero di nodi visitati è diverso dal numero totale di nodi, il grafo non è connesso
    if (visitati.size !== nodi.size) {
        return res.status(400).json({ errore: 'Il grafo fornito non è completamente connesso.' });
    }
    // Se tutto va bene, passa al prossimo middleware
    next();
}
exports.verificaGrafoConnesso = verificaGrafoConnesso;
