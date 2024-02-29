import { Request, Response, NextFunction } from 'express';
import { Grafo } from '../Model/Grafo';

export async function checkExport(req: Request, res: Response, next: NextFunction) {
  const { nome_grafo, from, to, stato_richiesta, format } = req.body;

  // Check if nome_grafo is present
  const grafo = await Grafo.findOne({ where: { nome_grafo: nome_grafo } });
  if (!grafo) {
    return res.status(404).json({ error: 'Grafo non trovato / Nome del grafo inserito non valido ' });
  }

  // Check date format and range
  if (isNaN(Date.parse(from)) || isNaN(Date.parse(to)) || new Date(from) > new Date(to)) {
    return res.status(400).json({ error: 'Formato data non valido o range date incorretto.' });
  }

  // Check stato_richiesta
  if (!['accettata', 'rifiutata', 'in pending'].includes(stato_richiesta)) {
    return res.status(400).json({ error: 'Stato richiesta non valido.' });
  }

  // Check format
  if (!['csv', 'xml', 'pdf', 'json'].includes(format)) {
    return res.status(400).json({ error: 'Formato file non valido.' });
  }

  next();
}
