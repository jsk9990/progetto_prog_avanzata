import { Request, Response } from 'express';
import { Grafo} from '../Model/Grafo';
import { Nodi } from '../Model/Nodi';
import { Archi } from '../Model/Archi';
import { Utente } from '../Model/Utente';
import Graph from "node-dijkstra"; // Importa la libreria node-dijkstra
import path from 'path';
import { parseJsonText } from 'typescript';
import { Performance } from 'perf_hooks';



async function getGrafoConNodiEArchi(id_grafo: number): Promise<any> {
  try {
    // Fetch the graph by its primary key
    const grafo = await Grafo.findByPk(id_grafo);
    if (!grafo) {
      throw new Error('Grafo non trovato');
    }

    // Fetch all nodes and edges associated with the graph
    const nodi = await Nodi.findAll({ where: { id_grafo } });
    const archi = await Archi.findAll({ where: { id_grafo } });

    // Format the data into JSON
    const risultato = {
      archi: archi.map(arco => {
        // Find the start and end node for each edge
        const nodoPartenza = nodi.find(nodo => nodo.getDataValue('id_nodi') === arco.getDataValue('id_nodo_partenza'));
        const nodoArrivo = nodi.find(nodo => nodo.getDataValue('id_nodi') === arco.getDataValue('id_nodo_arrivo'));
        // Return the edge with its weight
        return {
          [nodoPartenza?.getDataValue('nodo_nome')]: {
            [nodoArrivo?.getDataValue('nodo_nome')]: arco.getDataValue('peso'),
          }
        };
      }),
    };

    return risultato;
  } catch (error) {
    // Log and rethrow any errors encountered
    console.error('Errore durante il recupero del grafo:', error);
    throw error;
  }
}



  
function convertiArchiInFormatoDijkstra(archi: any[]): { [key: string]: { [key: string]: number } } {
  const grafoDijkstra: { [key: string]: { [key: string]: number } } = {};

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






export async function calcolaPercorsoMinimo(req: Request, res: Response) {
  const { id_grafo, nodo_partenza, nodo_arrivo, jwtDecode } = req.body;
  const utente = await Utente.findOne({ where: { email: jwtDecode.email, password: jwtDecode.password } });
  let creditoUtente : number = utente?.getDataValue('credito');
  const grafo = await Grafo.findOne({ where: { id_grafo } });
  const costoGrafo : number= grafo?.getDataValue('costo');

  if (creditoUtente < costoGrafo) {
    res.status(400).json({ message: 'Credito insufficente per generare il grafo. Il credito disponibile è' + creditoUtente });
  } else if (utente) {
    try {
      const grafo = await getGrafoConNodiEArchi(id_grafo);
      const grafoDijkstraFormat = convertiArchiInFormatoDijkstra(grafo.archi);

      const costoPerNodo = 0.10;
      const costoPerArco = 0.02;

      // Calcola il percorso minimo usando la libreria node-dijkstra

      const startTime = performance.now();

      const grafoDijkstra = new Graph(grafoDijkstraFormat);

      const percorsoMinimo = grafoDijkstra.path(nodo_partenza, nodo_arrivo, { cost: true });

      const endTime = performance.now();

      const tempoDiEsecuzione = endTime - startTime;

      let risultato = JSON.stringify(percorsoMinimo);
      const risultatoJson = JSON.parse(risultato);


      if (risultatoJson.path === null) {
        return res.status(404).json({ message: 'Percorso non trovato' });
      }
      if (creditoUtente >= costoGrafo) {
        creditoUtente = creditoUtente - costoGrafo;
        utente.setDataValue('credito', creditoUtente);
        await utente.save();
      }
      res.status(200).json({ percorso: percorsoMinimo, tempoEsecuzione: tempoDiEsecuzione, costoAddebbitato: costoGrafo, creditoResiduo: creditoUtente });

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Errore nel calcolo del percorso minimo' });
    }
     
      
      
    }

  
}
 