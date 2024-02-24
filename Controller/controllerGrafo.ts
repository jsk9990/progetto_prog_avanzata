import { Request, Response } from 'express';
import { Grafo} from '../Model/Grafo';
import { Nodi } from '../Model/Nodi';
import { Archi } from '../Model/Archi';
import { Utente } from '../Model/Utente';
import Graph from "node-dijkstra"; // Importa la libreria node-dijkstra
import { Richieste } from '../Model/Richieste';



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
    }

    

    //creazione del grafo 
    try {
      const nuovoGrafo = await Grafo.create({ nome_grafo, id_utente, costo: costoTotale });
      const rappresentazione_grafo: any = {};

      const grafoDijkstra = new Graph();

      for (const arco of struttura) {
        const { nodo_partenza, nodo_arrivo, peso } = arco;
        let nodoPartenza = await Nodi.findOne({ 
            where: { 
              nodo_nome: nodo_partenza,
              id_grafo: nuovoGrafo.dataValues.id_grafo 
            }
            });
            if (!nodoPartenza){
              nodoPartenza = await Nodi.create({ 
                nodo_nome: nodo_partenza,
                id_grafo: nuovoGrafo.dataValues.id_grafo });
        } 
        let nodoArrivo = await Nodi.findOne({ 
          where: { 
            nodo_nome: nodo_arrivo,
            id_grafo: nuovoGrafo.dataValues.id_grafo 
          }
          });
            if (!nodoArrivo){
              nodoArrivo = await Nodi.create({ 
                nodo_nome: nodo_arrivo,
                id_grafo: nuovoGrafo.dataValues.id_grafo });
            } 
        //const nodoPartenza = await Nodi.create({ nodo_nome: nodo_partenza, id_grafo: nuovoGrafo.dataValues.id_grafo });
        //const nodoArrivo = await Nodi.create({ nodo_nome: nodo_arrivo, id_grafo: nuovoGrafo.dataValues.id_grafo });
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
        grafo: rappresentazione_grafo, 
        costo : costoTotale
      });
    } catch (error) {
      return res.status(500).json({
        message: 'Errore nella creazione del grafo',
        error: error
      });
    }
  }
}

/*
export async function verificaProprietario (email: any,nome: any) {
    //const { email, nome, } = req.body
    
    const grafo = await Grafo.findOne({ where: { nome_grafo: nome } }); // non va bene, bisogna trovare tramite l'ID il grafo, perchè possiamo avere diversi grafi con lo stesso nome
    const utente = await Utente.findOne({ where: {email: email } });
    

    const id_utente = utente?.getDataValue('id_utente');
    const id_utente_grafo = grafo?.getDataValue('id_utente');

    console.log('id_utente: '+ id_utente+"\n");
    console.log('id_utente_grado: '+ id_utente_grafo+"\n");

    if (id_utente === id_utente_grafo){
        return true 
    } else {
        return false 
    }

}

export async function AggiornaGrafo (req: any,res: any) {

  const { id_utente, nome, nodo1, nodo2 , peso } = req.body;
  const utente = await Utente.findOne({ where: {id_utente: id_utente } }); // non va bene, perchè non dovresti passarglielo tramite id, ma bensi il tuo email
  const email = utente?.getDataValue('email');
  const grafo = await Grafo.findOne({ where: { nome_grafo: nome } });
  const id_grafo = grafo?.getDataValue('id_grafo');

  const id_utente_grafo = grafo?.getDataValue('id_utente');
  console.log('id_utente: '+ id_utente+' id_utente_grado: '+ id_utente_grafo+"\n");

  if (id_utente === id_utente_grafo){
  console.log(req.body); // stampa i dati della richiesta
  const grafo = await Grafo.findOne({ where: { nome_grafo: nome } });
  if (!grafo) {
    return res.status(404).send("Grafo non trovato");
  }
  const archi = await Archi.findAll({ where: { id_grafo: grafo.dataValues.id_grafo } });
  for (let arco of archi) {
  
        const nodoPartenza = await Nodi.findOne({
        where: {
            id_grafo: grafo.dataValues.id_grafo,
            id_nodi: arco.dataValues.id_nodo_partenza
        }
        });
        const nodoArrivo = await Nodi.findOne({
        where: {
            id_grafo: grafo.dataValues.id_grafo,
            id_nodi: arco.dataValues.id_nodo_arrivo
        }
        });
        const nomeNodoArrivo = nodoArrivo?.getDataValue('nodo_nome');
        const nomeNodoPartenza = nodoPartenza?.getDataValue('nodo_nome');
        

        if (JSON.stringify(nomeNodoPartenza===req.body.nodo1 && JSON.stringify(nomeNodoArrivo)=== req.body.nodo2)){
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
        }
    }
}else{ 
    console.log("Chiedi consenso");
    const descrizione = "L'utente "+id_utente+" Non è proprietario"+"ma vuole modificare il grafo con nome "+nome+" associato utente proprietario "+id_utente_grafo;
    console.log(descrizione);
        try {
        //const { id_utente, nome } = req.body;
        const grafo = await Grafo.findOne({ where: { nome_grafo: nome } });
        const id_grafo1 = grafo?.getDataValue('id_grafo');
        const descrizione = "L'utente "+id_utente+" Non è proprietario"+"ma vuole modificare il grafo con nome "+nome+" associato utente proprietario "+id_utente_grafo;

        const newRichiesta = await Richieste.create({
            id_utente_request: id_utente,
            id_utente_response: id_utente_grafo,
            id_grafo: id_grafo1,
            descrizione: descrizione,
            stato_richiesta: 'pending',
            modifiche: {}
        });
        console.log(newRichiesta);
        } catch (err) {
            console.error(err);
            res.status(500).send('Errore del server');
          }
        
      };
}
*/


