import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from "express";

const SECRET_KEY = 'il_tuo_segreto'; // Assicurati di sostituire con la tua chiave segreta

export const decodeToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return res.status(401).json({ error: 'Token non fornito' });
  }
  
  const token = authHeader.split(" ")[1];
  
  try {
    const jwtDecode = jwt.verify(token, SECRET_KEY);
    
    if (jwtDecode) {
      // Aggiungi il payload decodificato alla richiesta se necessario
      req.body.jwtDecode = jwtDecode; 
      next();
    } else {
      res.status(401).json({ error: 'Token non valido' });
    }
  } catch (error) {
    res.status(401).json({ error: 'Token non valido o scaduto' });
  }
};

