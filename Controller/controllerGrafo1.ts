import { Request, Response } from 'express';
import { Grafo} from '../Model/Grafo';

import { Utente } from '../Model/Utente';
import Graph from "node-dijkstra"; // Importa la libreria node-dijkstra
import { getGrafoConNodiEArchi } from '../Utilitis/getGrafoConNodiEArchi';
import { convertiArchiInFormatoDijkstra } from '../Utilitis/convertiArchiInFormatoDijkstra';
import { parseJsonText } from 'typescript';
import { Performance } from 'perf_hooks';



export async function calcolaPercorsoMinimo(req: Request, res: Response) {
  const { nome_grafo, nodo_partenza, nodo_arrivo, jwtDecode } = req.body;
  const utente = await Utente.findOne({ where: { email: jwtDecode.email, password: jwtDecode.password } });
  let creditoUtente : number = utente?.getDataValue('credito');
  const grafo = await Grafo.findOne({ where: { nome_grafo: nome_grafo } });
  const id_grafo = grafo?.getDataValue('id_grafo');
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
 