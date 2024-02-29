import { Request, Response, NextFunction } from 'express';
import { Grafo } from '../Model/Grafo';
import { Archi } from '../Model/Archi';
import { Nodi } from '../Model/Nodi';


interface GrafoInput {
  nome_grafo: string;
  id_arco: number;
  nodo_partenza: string;
  nodo_arrivo: string;
  start_peso: number;
  stop_peso: number;
  step: number;
}

export function checkGrafoSimulazione(req: Request, res: Response, next: NextFunction) {
  const body: GrafoInput = req.body;

switch(true) {
    case (typeof body.nome_grafo !== 'string'):
      return res.status(400).json({ message: 'Nome del grafo non corretto' });
    case (typeof body.id_arco !== 'number'):
      return res.status(400).json({ message: 'ID arco non corretto' });
    case (typeof body.nodo_partenza !== 'string'):
      return res.status(400).json({ message: 'Nodo di partenza non corretto' });
    case (typeof body.nodo_arrivo !== 'string'):
      return res.status(400).json({ message: 'Nodo di arrivo non corretto' });
    case (typeof body.start_peso !== 'number'):
      return res.status(400).json({ message: 'Peso di partenza non corretto' });
    case (typeof body.stop_peso !== 'number'):
      return res.status(400).json({ message: 'Peso di arrivo non corretto' });
    case (typeof body.step !== 'number'):
      return res.status(400).json({ message: 'Step non corretto' });
    default:
      break;
  }

  if (body.start_peso > body.stop_peso) {
    return res.status(400).json({ message: 'start_peso deve essere minore o uguale a to stop_peso' });
  }

  if (body.step <= 0) {
    return res.status(400).json({ message: 'step deve essere maggiore di 0' });
  }
 
  next();
}

export async function checkVerificaRequisiti (req: Request, res: Response, next: NextFunction) {
    const body : GrafoInput = req.body;

    const grafo = await Grafo.findOne({ where: { nome_grafo: body.nome_grafo } });

    if (!grafo) {
      return res.status(404).json({ error: `Non esiste un grafo con nome :    ${body.nome_grafo} ` });
    }

    const archi = await Archi.findAll({ where: { id_grafo: grafo.dataValues.id_grafo } });

    const arcoTrovato = archi.find(arco => arco.getDataValue('id_archi') === body.id_arco);

    if (!arcoTrovato) {
      return res.status(404).json({ error: `Arco con ID ${body.id_arco} non trovato o non presente nel grafo` });
    } 

    const nodi = await Nodi.findAll({ where: { id_grafo: grafo.dataValues.id_grafo } });

    const nodiTrovato = nodi.find (nodi => nodi.getDataValue('nodo_nome') === body.nodo_partenza);
    if (!nodiTrovato) {
        return res.status(404).json({ error: `Nodo di partenzacon nome ${body.nodo_partenza} non trovato o non presente nel grafo` });
    }
      
    const nodoTrovato = nodi.find (nodi => nodi.getDataValue('nodo_nome') === body.nodo_arrivo);
    if (!nodoTrovato) {
        return res.status(404).json({ error: `Nodo di arrivo con nome ${body.nodo_partenza} non trovato o non presente nel grafo` });
    } 
      
    next();
    
}
