import { Request, Response } from 'express';
import { Grafo} from '../Model/Grafo';
import { Nodi } from '../Model/Nodi';
import { Archi } from '../Model/Archi';
import { Utente } from '../Model/Utente';
import Graph from "node-dijkstra"; // Importa la libreria node-dijkstra


/*


// Funzione asincrona per creare un grafo
export async function creaGrafo(req : Request, res : Response) {
  // Estrai il nome del grafo e la struttura dal JSON
  const { nome_grafo, struttura } = req.body;

  // Crea un nuovo grafo nel database
  const nuovoGrafo = await Grafo.create({ nome_grafo });

  // Crea una nuova istanza del grafo di node-dijkstra
  const grafoDijkstra = new Graph();

  // Itera attraverso la struttura del grafo
  for (const arco of struttura) {
    const { nodo_partenza, nodo_arrivo, peso } = arco;

    // Crea i nodi di partenza e di arrivo nel database
    const nodoPartenza = await Nodi.create({ nodo_nome: nodo_partenza, id_grafo: nuovoGrafo.id_grafo });
    const nodoArrivo = await Nodi.create({ nodo_nome: nodo_arrivo, id_grafo: nuovoGrafo.id_grafo });

    // Crea l'arco nel database
    await Archi.create({
      id_grafo: nuovoGrafo.id_grafo,
      id_nodo_partenza: nodoPartenza.id_nodi,
      id_nodo_arrivo: nodoArrivo.id_nodi,
      peso
    });

    // Aggiungi l'arco al grafo di node-dijkstra
    grafoDijkstra.addNode(nodo_partenza, { [nodo_arrivo]: peso });
  }

  // Ritorna il grafo creato
  return res.status(201).json({
    message: 'Grafo creato con successo',
    grafo: grafoDijkstra
  });

  // Restituzione del grafo creato
  
});
}
*/

export async function creaGrafo(req: Request, res: Response) {
  const { nome_grafo, struttura, id_utente } = req.body;

  try {
    const nuovoGrafo = await Grafo.create({ nome_grafo, id_utente });
    const rappresentazione_grafo : any = {};
    
    const grafoDijkstra = new Graph();

    for (const arco of struttura) {
      const { nodo_partenza, nodo_arrivo, peso } = arco;
      const nodoPartenza = await Nodi.create({ nodo_nome: nodo_partenza, id_grafo: nuovoGrafo.dataValues.id_grafo });
      const nodoArrivo = await Nodi.create({ nodo_nome: nodo_arrivo, id_grafo: nuovoGrafo.dataValues.id_grafo });
      await Archi.create({
        id_grafo: nuovoGrafo.dataValues.id_grafo,
        id_nodo_partenza: nodoPartenza.dataValues.id_nodi,
        id_nodo_arrivo: nodoArrivo.dataValues.id_nodi,
        peso
      });
      grafoDijkstra.addNode(nodo_partenza, { [nodo_arrivo]: peso });

      if (!rappresentazione_grafo[nodo_partenza]) {
        rappresentazione_grafo[nodo_partenza] = {};
      }
      rappresentazione_grafo[nodo_partenza][nodo_arrivo] = peso;


    }

    return res.status(201).json({
      message: 'Grafo creato con successo',
      grafo: rappresentazione_grafo
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Errore nella creazione del grafo',
      error: error
    });
  }
}




