import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

export async function checkToken(req: Request, res: Response, next: NextFunction) {
  // Estrai l'header di autorizzazione
  const authHeader = req.headers['authorization'];
  // Se l'header è presente, dividi il valore in "Bearer" e il token effettivo
  const token = authHeader && authHeader.split(' ')[1];

  // Se il token non è presente, restituisci un errore
  if (token == null) {
    return res.status(401).json({ error: 'Token non fornito' });
  }

  // Verifica il token
  try {
    jwt.verify(token, 'il_tuo_segreto', (err: any, decoded: any) => {
      if (err) {
        // Se c'è un errore nella verifica del token, restituisci un errore
        return res.status(401).json({ error: 'Token non valido' });
      }
      // Se il token è valido, continua con la prossima funzione middleware
      next();
    });
  } catch (error) {
    res.status(500).send('Errore: ' + error);
  }
}
