

import { Request, Response, NextFunction } from 'express';
import { Grafo } from '../Model/Grafo';
import { Richieste } from '../Model/Richieste';

export function checkFormatUpdateAfterRequest(req: Request, res: Response, next: NextFunction) {
  const { nome_grafo, id_richieste } = req.body;

  if (typeof nome_grafo !== 'string' || typeof id_richieste !== 'number') {
    return res.status(400).json({ error: 'Formato del JSON non valido. "nome_grafo" deve essere una stringa e "id_richieste" deve essere un numero.' });
  }

  next();
}

export async function checkDataUpdateAfterRequest (req: Request, res: Response, next: NextFunction) {
  const { nome_grafo, id_richieste } = req.body;

  const grafo = await Grafo.findOne({ where: { nome_grafo: nome_grafo } });
  if (!grafo) {
    return res.status(404).json({ error: 'Grafo non trovato / Nome del grafo inserito non valido' });
  }

  const richiesta = await Richieste.findOne({ where: { id_richieste: id_richieste } , attributes: ['id_richieste', 'id_grafo', 'id_utente_request', 'id_utente_response', 'descrizione', 'modifiche', 'stato_richiesta'] });
  
  if (!richiesta) {
    return res.status(404).json({ error: 'Richiesta non trovata / Id richiesta inserito non valido' });
  } 

  next();
  
}
