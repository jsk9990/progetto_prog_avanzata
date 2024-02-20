import { Request, Response, NextFunction } from 'express';
import { Utente } from '../Model/Utente';


export async function checkAdmin(req: Request, res: Response, next: NextFunction) {
  const { email, password } = req.body.jwtDecode; 
  console.log('Dati: ' + email, password);
  try {
    const utente = await Utente.findOne({ where: { email: email, password: password } });
    if (!utente) {
      return res.status(401).json({ error: 'Utente non trovato' });
    }
    const privilegi_utenti = utente.getDataValue('privilegi'); 
    if (!utente.dataValues.privilegi) {
      res.status(401).json({ error: 'Utente non autorizzato' });
    } else if (privilegi_utenti !== 'admin') {
      next();  
    }
    
  }
   catch (error) {
    res.status(500).send('Errore: ' + error);
  }
}
