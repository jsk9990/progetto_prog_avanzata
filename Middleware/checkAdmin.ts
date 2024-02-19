import { Request, Response, NextFunction } from 'express';
import { Utente } from '../Model/Utente';
import { decodeToken } from './decodeToken';

export async function checkAdmin(auth: any,req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if(!token){
        return res.status(401).json({ error: 'Token non fornito' });
    }
    const decoded = decodeToken(token);

    if(!decoded){
        return res.status(401).json({ error: 'Token non valido' });
    }

    const utente = await Utente.findOne({ where: { email: decoded.email, password: decoded.password } });
    console.log(utente);
    if (!utente) {
      return res.status(401).json({ error: 'Utente non trovato' });
    }
    
    if (!utente.dataValues.privilegi) {
      res.status(401).json({ error: 'Utente non autorizzato' });
    } 
    next();


  }
   catch (error) {
    res.status(500).send('Errore: ' + error);
  }
}
