import { Request, Response, NextFunction } from 'express';
import { Grafo } from '../Model/Grafo'; 
import { Nodi } from '../Model/Nodi';


interface GrafoRequest {
    nome_grafo: string;
    nodo_partenza: string;
    nodo_arrivo: string;
  }
  

export async function checkGrafoEsecuzione (req: Request, res: Response, next: NextFunction) {

  const { nome_grafo, nodo_partenza, nodo_arrivo } : GrafoRequest = req.body;

  // Verifica la struttura del JSON
  if (typeof nome_grafo !== 'string' || typeof nodo_partenza !== 'string' || typeof nodo_arrivo !== 'string') {
    return res.status(400).json({ error: 'Struttura del JSON non valida' });
  }
  
  try {
    // Verifica la presenza dei nodi nel grafo
    const grafo = await Grafo.findOne({ where: { nome_grafo: nome_grafo } });

    
    if (!grafo) {
      return res.status(404).json({ error: `Non esiste un grafo con nome :    ${nome_grafo} ` });
    }
    
    const id_grafo = grafo.getDataValue('id_grafo');

    const nodoPartenza = await Nodi.findOne({ where: { id_grafo : id_grafo, nodo_nome : nodo_partenza } }); 

    
    const nodoArrivo = await Nodi.findOne({ where: { id_grafo : id_grafo, nodo_nome : nodo_arrivo } });
    
    

    if (!nodoPartenza || !nodoArrivo ) {
      return res.status(404).json({ error: 'Nodo di partenza o di arrivo non presente nel grafo' });
    }
    
    // Se tutto è corretto, continua con il prossimo middleware
    next();
    
  } catch (error) {
    return res.status(500).json({ error: 'Errore del server' });
  }
};
