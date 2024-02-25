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

  console.log('Fino qui almeno arriva' + nome_grafo);
  console.log('Fino qui almeno arriva' + nodo_partenza);
  console.log('Fino qui almeno arriva' + nodo_arrivo);
  
  // Verifica la struttura del JSON
  if (!nome_grafo || !nodo_partenza || !nodo_arrivo) {
    return res.status(400).json({ error: 'Struttura del JSON non valida' });
  }
  
  try {
    // Verifica la presenza dei nodi nel grafo
    const grafo = await Grafo.findOne({ where: { nome_grafo: nome_grafo } });
    
    if (!grafo) {
      return res.status(404).json({ error: `Grafo ${nome_grafo} non trovato` });
    }
    
    const id_grafo = grafo.getDataValue('id_grafo');

    const nodoPartenza = await Nodi.findAll({ where: { id_grafo : id_grafo } }); 
    const nodoArrivo = await Nodi.findAll({ where: { id_grafo : id_grafo } });
    
    if (!nodoPartenza || !nodoArrivo) {
      return res.status(404).json({ error: 'Nodo di partenza o di arrivo non presente nel grafo' });
    }
    
    // Se tutto è corretto, continua con il prossimo middleware
    next();
    
  } catch (error) {
    return res.status(500).json({ error: 'Errore del server' });
  }
};
