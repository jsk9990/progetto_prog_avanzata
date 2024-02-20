import { Request, Response } from 'express';
import { Grafo} from '../Model/Grafo';
import { Nodi } from '../Model/Nodi';
import { Archi } from '../Model/Archi';
import { Utente } from '../Model/Utente';
import Graph from "node-dijkstra"; // Importa la libreria node-dijkstra



//Crea Grafo 
export async function creaGrafo(req: Request, res: Response) {
  //Dati dal body
  const { nome_grafo, struttura, jwtDecode } = req.body;
  console.log('Dati: ' + nome_grafo, struttura, jwtDecode);
  //Trovo utente 
  const utente = await Utente.findOne({ where: { email: jwtDecode.email, password: jwtDecode.password } });
  const id_utente = utente?.getDataValue('id_utente');
  if (!id_utente) {
    return res.status(400).json({ message: 'Utente non trovato' });
  }
  console.log ('L utente è: ' +utente); 
  console.log ('L id utente è: ' + id_utente)
  //verifico il credito >0 
  if (utente?.dataValues.credito < 0) {
    return res.status(400).json({ message: 'Credito esaurito: Contattare admin per la ricarica' });
  }
  // calcolo costo grafo 
  if (utente?.dataValues.credito >= 0) {
    const costoPerNodo = 0.10;
    const costoPerArco = 0.02;
    //Map dei nodi della struttura
    const nodiUnici = new Set();
    struttura.forEach((arco: any) => {
      nodiUnici.add(arco.nodo_partenza);
      nodiUnici.add(arco.nodo_arrivo);
    });
    const numeroNodi = nodiUnici.size;
    //Map degli archi
    const numeroArchi = struttura.length;
    //calcolo costo totale
    const costoTotale = (numeroArchi * costoPerArco) + (numeroNodi * costoPerNodo);
    //aggiornamento credito utente 
    if (utente?.dataValues.credito < costoTotale) {
      console.log ('Credito vecchio: ' + utente?.dataValues.credito);
      return res.status(400).json({ message: 'Credito insufficente per generare il grafo. Il credito disponibile è' + utente?.dataValues.credito });
    } else if (utente) {
      utente.dataValues.credito = utente.dataValues.credito - costoTotale;
      await utente.setDataValue('credito', utente.dataValues.credito);
      await utente.save();
      console.log('Credito nuovo: ' + utente.dataValues.credito);
    }
    //creazione del grafo 
    try {
      const nuovoGrafo = await Grafo.create({ nome_grafo, id_utente });
      const rappresentazione_grafo: any = {};

      const grafoDijkstra = new Graph();

      for (const arco of struttura) {
        const { nodo_partenza, nodo_arrivo, peso } = arco;
        const nodoPartenza = await Nodi.create({ nodo_nome: nodo_partenza, id_grafo: nuovoGrafo.dataValues.id_grafo });
        const nodoArrivo = await Nodi.create({ nodo_nome: nodo_arrivo, id_grafo: nuovoGrafo.dataValues.id_grafo });
        await Archi.create({
          id_grafo: nuovoGrafo.dataValues.id_grafo,
          id_nodo_partenza: nodoPartenza.dataValues.id_nodi,
          id_nodo_arrivo: nodoArrivo.dataValues.id_nodi,
          peso
        });
        grafoDijkstra.addNode(nodo_partenza, { [nodo_arrivo]: peso });

        if (!rappresentazione_grafo[nodo_partenza]) {
          rappresentazione_grafo[nodo_partenza] = {};
        }
        rappresentazione_grafo[nodo_partenza][nodo_arrivo] = peso;


      }


      return res.status(201).json({
        message: 'Grafo creato con successo',
        grafo: rappresentazione_grafo
      });
    } catch (error) {
      return res.status(500).json({
        message: 'Errore nella creazione del grafo',
        error: error
      });
    }
  }
}


//Visuaizza Grafo  
export async function VisualizzaGrafo (id_utente : any) {
  //Trovo utente 
  const utente = await Utente.findByPk(id_utente);
  const lista_grafi = await Grafo.findAll({ where: { id_utente } });
  console.log("Utente :" + utente?.dataValues.email + "puoi modificare i seguenti grafi: \n" + lista_grafi)


}
export async function AggiornaGrafo (req: any,res: any) {
  const { id_utente, nome, nodo1, nodo2 , peso } = req.body;

  console.log(req.body); // stampa i dati della richiesta

  const grafo = await Grafo.findOne({ where: { nome_grafo: nome } });

  if (!grafo) {
    return res.status(404).send("Grafo non trovato");
  }

  const archi = await Archi.findAll({ where: { id_grafo: grafo.dataValues.id_grafo } });

  for (let arco of archi) {
  
    const nodiPartenza = await Nodi.findAll({
      where: {
        id_grafo: grafo.dataValues.id_grafo,
        id_nodi: arco.dataValues.id_nodo_partenza
      }
    });
    const nodiArrivo = await Nodi.findAll({
      where: {
        id_grafo: grafo.dataValues.id_grafo,
        id_nodi: arco.dataValues.id_nodo_arrivo
      }
    });
    
    
    console.log("Nodo partenza: "+JSON.stringify(nodiPartenza, null, 2));
    console.log("Nodo arrivo: "+JSON.stringify(nodiArrivo, null, 2));
    await Archi.update(
          { peso: req.body.peso },
          {
            where: {
              id_grafo: grafo.dataValues.id_grafo,
              id_nodo_partenza: arco.dataValues.id_nodo_partenza,
              id_nodo_arrivo: arco.dataValues.id_nodo_arrivo
            }
          }
        );
        console.log("Sono riuscito ad aggiornare peso");
      }
    }