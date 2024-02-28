import { Request, Response } from 'express';
import { Grafo} from '../Model/Grafo';
import { Nodi } from '../Model/Nodi';
import { Archi } from '../Model/Archi';
import { Utente } from '../Model/Utente';
import Graph from "node-dijkstra"; // Importa la libreria node-dijkstra
import 'dotenv/config'



import { parseJsonText } from 'typescript';
import { Performance } from 'perf_hooks';
import { getGrafoConNodiEArchi } from '../Utilitis/getGrafoConNodiEArchi';
import { convertiArchiInFormatoDijkstra } from '../Utilitis/convertiArchiInFormatoDijkstra';
import { calcolaCostoGrafo } from '../Utilitis/calcolaCostoGrafo';



//-------------Crea Grafo---------------------------------- 
export async function creaGrafo(req: Request, res: Response) {
  //Dati dal body
  const { nome_grafo, struttura, jwtDecode } = req.body;
  //Trovo utente 
  const utente = await Utente.findOne({ where: { email: jwtDecode.email, password: jwtDecode.password } });
  const id_utente = utente?.getDataValue('id_utente');
  if (!id_utente) {
    return res.status(400).json({ message: 'Utente non trovato' });
  }

  //verifico il credito >0 
  if (utente?.dataValues.credito < 0) {
    return res.status(400).json({ message: 'Credito esaurito: Contattare admin per la ricarica' });
  }

  //richiamo la funzione per il calcolo del costo del grafo secondo le specifiche di traccia 
  const costoTotale = await calcolaCostoGrafo(req, res, utente, utente?.dataValues.credito, struttura);

    //creazione del grafo 
    try {
      const nuovoGrafo = await Grafo.create({ nome_grafo, id_utente, costo: costoTotale });
      const rappresentazione_grafo: any = {};

      const grafoDijkstra = new Graph();

      for (const arco of struttura) {
        const { nodo_partenza, nodo_arrivo, peso } = arco;
        let nodoPartenza = await Nodi.findOne({ 
            where: { 
              nodo_nome: nodo_partenza,
              id_grafo: nuovoGrafo.dataValues.id_grafo 
            }
            });
            if (!nodoPartenza){
              nodoPartenza = await Nodi.create({ 
                nodo_nome: nodo_partenza,
                id_grafo: nuovoGrafo.dataValues.id_grafo });
        } 
        let nodoArrivo = await Nodi.findOne({ 
          where: { 
            nodo_nome: nodo_arrivo,
            id_grafo: nuovoGrafo.dataValues.id_grafo 
          }
          });
            if (!nodoArrivo){
              nodoArrivo = await Nodi.create({ 
                nodo_nome: nodo_arrivo,
                id_grafo: nuovoGrafo.dataValues.id_grafo });
            } 
        const nuovoArco = await Archi.create({
          id_grafo: nuovoGrafo.dataValues.id_grafo,
          id_nodo_partenza: nodoPartenza.dataValues.id_nodi,
          id_nodo_arrivo: nodoArrivo.dataValues.id_nodi,
          peso
        });
        grafoDijkstra.addNode(nodo_partenza, { [nodo_arrivo]: peso });

        if (!rappresentazione_grafo[nodo_partenza]) {
          rappresentazione_grafo[nodo_partenza] = {};
        }
        rappresentazione_grafo[nodo_partenza][nodo_arrivo] = {
          peso: peso,
          id_arco : nuovoArco.dataValues.id_archi
        }
      }
      return res.status(201).json({
        message: 'Grafo creato con successo',
        grafo: rappresentazione_grafo, 
        costo : costoTotale
      });
    } catch (error) {
      return res.status(500).json({
        message: 'Errore nella creazione del grafo',
        error: error
      });
    }
  }

  export async function calcolaPercorsoMinimo(req: Request, res: Response) {
    // parametri nel req.body
    const { nome_grafo, nodo_partenza, nodo_arrivo, jwtDecode } = req.body;
  
    // trovo l'utente tramite il jwt
    const utente = await Utente.findOne({ where: { email: jwtDecode.email, password: jwtDecode.password } });
  
    // prendo il credito dell'utente
    let creditoUtente : number = utente?.getDataValue('credito');
  
    // trovo il grafo
    const grafo = await Grafo.findOne({ where: { nome_grafo: nome_grafo } });
  
    // prendo l'ID del grafo
    const id_grafo = grafo?.getDataValue('id_grafo');
  
    // prendo il costo del grafo calcolato in fase di creazione del grafo
    const costoGrafo : number= grafo?.getDataValue('costo');
  
    // Controllo se l'utente ha abbastanza credito per calcolare il percorso minimo
    if (creditoUtente < costoGrafo) {
      res.status(400).json({ message: 'Credito insufficente per generare il grafo. Il credito disponibile è' + creditoUtente });
    } else if (utente) {
      try {
        // Utilizzo funzione per prendere nodi e archi
        const grafo = await getGrafoConNodiEArchi(id_grafo);
        // Utilizzo funzione che formatta i dati nel modo appropriato richiesto dalla libreria
  
        const grafoDijkstraFormat = convertiArchiInFormatoDijkstra(grafo.archi);
  
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
        // Aggiorna il credito dell'utente
        if (creditoUtente >= costoGrafo) {
          creditoUtente = creditoUtente - costoGrafo;
          utente.setDataValue('credito', creditoUtente);
          await utente.save();
        }
        // Ritorna il percorso, tempi e costo addebitato
        res.status(200).json({ percorso: percorsoMinimo, tempoEsecuzione: tempoDiEsecuzione, costoAddebbitato: costoGrafo, creditoResiduo: creditoUtente });
  
      } catch (error) {
  
        console.error(error);
        res.status(500).json({ message: 'Errore nel calcolo del percorso minimo' });
      }  
    }
  }
