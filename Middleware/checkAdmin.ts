import { Request, Response, NextFunction } from 'express';
import { Utente } from '../Model/Utente';

export async function checkAdmin(auth: any,req: Request, res: Response, next: NextFunction) {
  
  const {jwtDecode} = req.body;
  
  try {

    const utente = await Utente.findOne({ where: { email: jwtDecode.email, password: jwtDecode.password } });
    if (!utente) {
      return res.status(401).json({ error: 'Utente non trovato' });
    }
    
    if (utente.dataValues.privilegi === false) {
      res.status(401).json({ error: 'Utente non autorizzato' });
    } 
    next();

  }
   catch (error) {
    res.status(500).send('Errore: ' + error);
  }
}
