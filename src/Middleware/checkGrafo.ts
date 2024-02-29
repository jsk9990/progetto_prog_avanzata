import { Request, Response, NextFunction } from 'express';
import { Grafo } from '../Model/Grafo';

interface Nodo {
  nodo_partenza: string;
  nodo_arrivo: string;
  peso: number;
}

interface Grafo {
  nome_grafo: string; 
  struttura: Nodo[];
}

export async function verificaStrutturaGrafo(req: Request, res: Response, next: NextFunction) {
  
  const grafo: Grafo = req.body;

  // Verifica che il nome del grafo sia già presente nel db 
  const nomeGrafo = await Grafo.findOne({ where: { nome_grafo: grafo.nome_grafo } });

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
}

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
  
      // Aggiunta del percorso inverso per considerare il grafo non orientato
      if (!mappaAdiacenza.has(arco.nodo_arrivo)) {
        mappaAdiacenza.set(arco.nodo_arrivo, new Set<string>());
      }
      mappaAdiacenza.get(arco.nodo_arrivo)?.add(arco.nodo_partenza);
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
    const visitati = new Set<string>();
    dfs(Array.from(nodi)[0], visitati); // Inizia la DFS dal primo nodo
  
    // Se il numero di nodi visitati è diverso dal numero totale di nodi, il grafo non è connesso
    if (visitati.size !== nodi.size) {
      return res.status(400).json({ errore: 'Il grafo fornito non è completamente connesso.' });
    }
  
    // Se tutto va bene, passa al prossimo middleware
    next();
  }
  