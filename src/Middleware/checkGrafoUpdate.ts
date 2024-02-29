import { Request, Response, NextFunction } from 'express';
import { Grafo } from '../Model/Grafo';
import { Archi } from '../Model/Archi';

export async function validateGrafoUpdate(req: Request, res: Response, next: NextFunction) {
  const { nome_grafo, id_archi, descrizione, peso } = req.body;

  try{
  
        if(nome_grafo){
            if (typeof nome_grafo !== 'string') {
            return res.status(400).json({ errore: 'Il campo "nome_grafo" deve essere una stringa.' });
            }
            const grafo = await Grafo.findOne({ where: { nome_grafo: nome_grafo } });
            if (!grafo) {
                return res.status(404).json({ errore: 'Grafo non trovato' });
            } 
        }
        if (id_archi){
            if (typeof id_archi !== 'number') {
            return res.status(400).json({ errore: 'Il campo "id_archi" deve essere un numero.' });
            }
            const archi = await Archi.findByPk(id_archi);
            if (!archi || archi === undefined) {
                 return res.status(404).json({ errore: 'Arco non trovato o non presente nel grafo selezionato' });
            } 
        }

        if (descrizione){
            if (typeof descrizione !== 'string') {
                return res.status(400).json({ errore: 'Il campo "descrizione" deve essere una stringa.' });
            }
            if (descrizione === null || descrizione === ''){
                return res.status(400).json({ errore: 'Il campo "descrizione" non puo essere vuoto.' });
            }
        }

        if (peso){
            if (typeof peso !== 'number') {
            return res.status(400).json({ errore: 'Il campo "peso" deve essere un numero.' });
            }
            if (peso === null){
                return res.status(400).json({ errore: 'Il campo "peso" non puo essere vuoto.' });
            }
            if (peso < 0){
                return res.status(400).json({ errore: 'Il campo "peso" non puo essere negativo.' });
            }
        }
        
        next();
        }
   catch (error) {
      return res.status(500).send('Errore del server: ' + error);
  }
}