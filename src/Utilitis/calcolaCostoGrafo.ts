import { Request, Response } from 'express';
import { Grafo } from '../Model/Grafo';
import { Utente } from '../Model/Utente';

export async function calcolaCostoGrafo(req: Request, res: Response, utente : any, credito: number, struttura: []) {
    try{
        if (credito >= 0) {
          const costoPerNodo : any = process.env.COSTO_PER_NODO;
          const costoPerArco : any = process.env.COSTO_PER_ARCO;
          if (!costoPerNodo || !costoPerArco) {
          return res.status(400).json ({ message: 'Variabili di ambiente non settate correttamente, verificare il COSTO_PER_NODO/COSOT_PER_ARCO' });
          }
          //Map dei nodi della struttura
          const nodiUnici = new Set();
          struttura.forEach((arco: any) => {
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
          } else if (utente) {
            utente.dataValues.credito = utente.dataValues.credito - costoTotale;
            await utente.setDataValue('credito', utente.dataValues.credito);
            await utente.save();
          }
          
          return costoTotale
        }
        
    }
    catch (error) {
      return res.status(500).json({ message: 'Errore nella creazione del grafo', error: error });
    }
  }