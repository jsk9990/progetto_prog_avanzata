import { Request, Response } from 'express';
import { Grafo } from '../Model/Grafo';
import { Nodi } from '../Model/Nodi';
import { Archi } from '../Model/Archi';
import { Utente } from '../Model/Utente';
import { Richieste } from '../Model/Richieste';
import Graph from "node-dijkstra"; // Importa la libreria node-dijkstra
import 'dotenv/config'
import { parseJsonText } from 'typescript';
import { Performance } from 'perf_hooks';
import { getGrafoConNodiEArchi } from '../Utilitis/getGrafoConNodiEArchi';
import { convertiArchiInFormatoDijkstra } from '../Utilitis/convertiArchiInFormatoDijkstra';
import { calcolaCostoGrafo } from '../Utilitis/calcolaCostoGrafo';
import { preprareData } from '../Utilitis/prepareDataPerSimulazione';
import { getIDforUpdate } from '../Utilitis/getIDforUpdate';
import { gestioneRichiesta } from '../Utilitis/gestioneRichieste';
import { verifiedPropriety } from '../Utilitis/verifiedPropriety';
import { updateArco } from '../Utilitis/updateArco';
import { Op } from 'sequelize';
import { writeCSV } from '../Utilitis/formatConverter';
import { generatePDF } from '../Utilitis/formatConverter';
import { convertToXML } from '../Utilitis/formatConverter';




//-------------Crea Grafo---------------------------------- 
export async function creaGrafo(req: Request, res: Response) {
  //Dati dal body
  const { nome_grafo, struttura, jwtDecode } = req.body;
  //Trovo utente 
  const utente = await Utente.findOne({ where: { email: jwtDecode.email, password: jwtDecode.password } });
  const id_utente = utente?.getDataValue('id_utente');
  if (!id_utente) {
    return res.status(400).json({ message: 'Utente non trovato' });
  }

  //verifico il credito >0 
  if (utente?.dataValues.credito < 0) {
    return res.status(400).json({ message: 'Credito esaurito: Contattare admin per la ricarica' });
  }

  //richiamo la funzione per il calcolo del costo del grafo secondo le specifiche di traccia 
  const costoTotale = await calcolaCostoGrafo(req, res, utente, utente?.dataValues.credito, struttura);

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
      if (!nodoPartenza) {
        nodoPartenza = await Nodi.create({
          nodo_nome: nodo_partenza,
          id_grafo: nuovoGrafo.dataValues.id_grafo
        });
      }
      let nodoArrivo = await Nodi.findOne({
        where: {
          nodo_nome: nodo_arrivo,
          id_grafo: nuovoGrafo.dataValues.id_grafo
        }
      });
      if (!nodoArrivo) {
        nodoArrivo = await Nodi.create({
          nodo_nome: nodo_arrivo,
          id_grafo: nuovoGrafo.dataValues.id_grafo
        });
      }
      const nuovoArco = await Archi.create({
        id_grafo: nuovoGrafo.dataValues.id_grafo,
        id_nodo_partenza: nodoPartenza.dataValues.id_nodi,
        id_nodo_arrivo: nodoArrivo.dataValues.id_nodi,
        peso
      });
      grafoDijkstra.addNode(nodo_partenza, { [nodo_arrivo]: peso });

      if (!rappresentazione_grafo[nodo_partenza]) {
        rappresentazione_grafo[nodo_partenza] = {};
      }
      rappresentazione_grafo[nodo_partenza][nodo_arrivo] = {
        peso: peso,
        id_arco: nuovoArco.dataValues.id_archi
      }
    }
    return res.status(201).json({
      message: 'Grafo creato con successo',
      grafo: rappresentazione_grafo,
      costo: costoTotale
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Errore nella creazione del grafo',
      error: error
    });
  }
}


//--------------------------Calcola percorso minimo--------------------------
export async function calcolaPercorsoMinimo(req: Request, res: Response) {
  // parametri nel req.body
  const { nome_grafo, nodo_partenza, nodo_arrivo, jwtDecode } = req.body;

  // trovo l'utente tramite il jwt
  const utente = await Utente.findOne({ where: { email: jwtDecode.email, password: jwtDecode.password } });

  // prendo il credito dell'utente
  let creditoUtente: number = utente?.getDataValue('credito');

  // trovo il grafo
  const grafo = await Grafo.findOne({ where: { nome_grafo: nome_grafo } });

  // prendo l'ID del grafo
  const id_grafo = grafo?.getDataValue('id_grafo');

  // prendo il costo del grafo calcolato in fase di creazione del grafo
  const costoGrafo: number = grafo?.getDataValue('costo');

  // Controllo se l'utente ha abbastanza credito per calcolare il percorso minimo
  if (creditoUtente < costoGrafo) {
    res.status(400).json({ message: 'Credito insufficente per generare il grafo. Il credito disponibile è' + creditoUtente });
  } else if (utente) {
    try {
      // Utilizzo funzione per prendere nodi e archi
      const grafo = await getGrafoConNodiEArchi(id_grafo);
      // Utilizzo funzione che formatta i dati nel modo appropriato richiesto dalla libreria

      const grafoDijkstraFormat = convertiArchiInFormatoDijkstra(grafo.archi);

      // Calcola il percorso minimo usando la libreria node-dijkstra

      const startTime = performance.now();

      const grafoDijkstra = new Graph(grafoDijkstraFormat);

      const percorsoMinimo = grafoDijkstra.path(nodo_partenza, nodo_arrivo, { cost: true });

      const endTime = performance.now();

      const tempoDiEsecuzione = endTime - startTime;

      let risultato = JSON.stringify(percorsoMinimo);
      const risultatoJson = JSON.parse(risultato);


      if (risultatoJson.path === null) {
        return res.status(404).json({ message: 'Percorso non trovato' });
      }
      // Aggiorna il credito dell'utente
      if (creditoUtente >= costoGrafo) {
        creditoUtente = creditoUtente - costoGrafo;
        utente.setDataValue('credito', creditoUtente);
        await utente.save();
      }
      // Ritorna il percorso, tempi e costo addebitato
      res.status(200).json({ percorso: percorsoMinimo, tempoEsecuzione: tempoDiEsecuzione, costoAddebbitato: costoGrafo, creditoResiduo: creditoUtente });

    } catch (error) {

      console.error(error);
      res.status(500).json({ message: 'Errore nel calcolo del percorso minimo' });
    }
  }
}

//------------------Simulazione----------------

interface bestResult {
  cost: number;
  path: string[]; // replace with actual type
  configuration: string[];
}


export async function getSimulazione(req: Request, res: Response) {
//prendo i dati dal req.body

  const { nome_grafo, id_arco, nodo_partenza, nodo_arrivo, start_peso, stop_peso, step } = req.body;
//trovo il grafo
  const grafo = await Grafo.findOne({ where: { nome_grafo: nome_grafo } });
  if (!grafo) {
    return res.status(404).json({ error: 'Grafo non trovato' });
  }
//prendo l'id del grafo
  const id_grafo = grafo.dataValues.id_grafo;
//trovo tutti gli archi associati con id, e inizializzo l'array di risultati e di Best result
  const archi = await Archi.findAll({ where: { id_grafo } });
  const archiOriginali = [...archi];
  const risultati = [];
  let bestResult: bestResult = { cost: Infinity, configuration: [], path: [] };
//ciclo per la simulazione 
  try {
    for (let peso = start_peso; peso <= stop_peso; peso += step) {
      // Mappa tutti gli archi e trova quello con l'id specificato
      const arcoTrovato = archi.find(arco => arco.getDataValue('id_archi') === id_arco);
      // Se l'arco è stato trovato, modificare il peso 
      if (arcoTrovato) {
        arcoTrovato.setDataValue('peso', peso);
        //Sostituisci l'arco modificato con l'array originale 
        const index = archiOriginali.findIndex(arco => arco.getDataValue('id_archi') === id_arco);
        if (index !== -1) {
          archiOriginali[index] = arcoTrovato;
        }
      } else {
        console.log(`Nessun arco trovato con ID ${id_arco}`);
      }

      //funzioni per la preparazione del grafo
      const graphData = await preprareData(archiOriginali, id_grafo);


      const grafoDijkstraFormat = convertiArchiInFormatoDijkstra(graphData.archi);

      // Calcola il percorso minimo usando la libreria node-dijkstra
      const grafoSimulato = new Graph(grafoDijkstraFormat);
      const risultato = grafoSimulato.path(nodo_partenza, nodo_arrivo, { cost: true });

      const risultato1 = JSON.parse(JSON.stringify(risultato));

      //inserisco nell'array di risultati
      if (typeof risultato === 'object' && 'cost' in risultato && 'path' in risultato) {
        risultati.push({ peso, cost: risultato1.cost, path: risultato1.path });
      }
      //controllo il best result se deve essere aggiornato con i dati dell'ultima iterazione 
      if (risultato1.cost <= bestResult.cost) {
        bestResult = { cost: risultato1.cost, configuration: [`${peso}`], path: risultato1.path };
      }


    }
  } catch (error) {
    // Log and rethrow any errors encountered
    console.error(error);
    throw error;
  }

  res.json({ risultati, bestResult });
}

//---------------------UPDATE----------------------


export async function updateGrafo(req: Request, res: Response) {
  
  //estrapolo i dati dal req.body e trovo l'id del grafo. Poi richiamo 
  //la funzione necessaria per verificare la proprietà del grafo

  const { nome_grafo, jwtDecode, id_archi, descrizione, peso } = req.body;

  const grafo = await Grafo.findOne({ where: { nome_grafo: nome_grafo } });
  const id_grafo = grafo?.dataValues.id_grafo;


  const verifica = await verifiedPropriety(jwtDecode, id_grafo);


  //se la verifica è andata a buon fine, allora faccio l'update del grafo
  //con la creazione di una richiesta già accettata

  if (verifica === true) {
    const update = await updateArco(id_grafo, id_archi, peso);
    const data = await getIDforUpdate(jwtDecode, id_grafo);
    const richiesta = await Richieste.create({
      id_utente_request: data[0],
      id_utente_response: data[1],
      id_grafo: id_grafo,
      descrizione: descrizione,
      modifiche: {
        "ID arco modificato ": id_archi,
        "peso nuovo ": peso,
        "nome_grafo": nome_grafo
      },
      stato_richiesta: 'accettata'
    });

    res.json({
      message: "Grafo aggiornato con successo", update: update, msg: "Richiesta", richiesta: richiesta
    });
  }


  //nel caso in cui la verifica non è andata a buon fine, ovvero 
  //l'utente loggato non ha i privilegi per effettuare l'update del grafo
  //allora verrà creata una richiesta di pending

  if (verifica === false) {
    const data = await getIDforUpdate(jwtDecode, id_grafo);
    const richiesta = await Richieste.create({
      id_utente_request: data[0],
      id_utente_response: data[1],
      id_grafo: id_grafo,
      descrizione: descrizione,
      modifiche: {
        "ID arco modificato ": id_archi,
        "peso nuovo ": peso,
        "nome_grafo": nome_grafo
      },
    });

    res.json(richiesta);
  }

}

//----------------UPDATE ARCO AFTER REQUEST -----------------

//questa funzione serve per modificare l'arco dopo aver effettuato una richiesta di modifica e questa è stata accettata

export async function updateArcoAfterRequest(req: Request, res: Response) {
  const { jwtDecode, nome_grafo, id_richieste } = req.body;


  const grafo = await Grafo.findOne({ where: { nome_grafo: nome_grafo } });
  const id_grafo = grafo?.dataValues.id_grafo;

  const risultatoRichiesta = await gestioneRichiesta(jwtDecode, id_grafo, id_richieste);

  const richieste = await Richieste.findOne({
    where: {
      id_richieste: id_richieste,
    },
    attributes: ['id_richieste', 'id_grafo', 'id_utente_request', 'id_utente_response', 'descrizione', 'modifiche', 'stato_richiesta']
  });
  const modifiche = richieste?.getDataValue('modifiche');
  const id_archi = modifiche['ID arco modificato '];
  const peso = modifiche['peso nuovo '];
  const nome_grafo_modifiche = modifiche['nome_grafo'];

  try {
    if (nome_grafo === nome_grafo_modifiche) {
      if (risultatoRichiesta === 'accettata') {
        const update = await updateArco(id_grafo, id_archi, peso);
        res.status(200).json({ risultatoRichiesta: risultatoRichiesta, update: update });
      } else if (risultatoRichiesta === 'rifiutata') {
        res.json('Richiesta rifiutata');
      } else {
        res.json('Richiesta in attesa');
      }
    } else {
      return res.status(404).json({ error: 'Nome del grafo non corrispondente' });
    }
  } catch (err) {
    return res.status(500).json({ error: err });
  }
}


//-----------------GET RICHIESTE-----------------------

//Ritorna tutte le richieste di un utente

export async function getRichieste(req: Request, res: Response) {
  const { jwtDecode, nome_grafo } = req.body;
  const utente = await Utente.findOne({ where: { email: jwtDecode.email, password: jwtDecode.password } });
  const id_utente = utente?.dataValues.id_utente;

  const grafo = await Grafo.findOne({ where: { nome_grafo: nome_grafo, id_utente: id_utente } });

  try {
    if (!grafo) {
      return res.json('Grafo non trovato');
    }

    const id_grafo = grafo?.dataValues.id_grafo;

    const richieste = await Richieste.findAll({ where: { id_grafo: id_grafo, id_utente_response: id_utente }, attributes: ['id_richieste', 'id_grafo', 'id_utente_request', 'id_utente_response', 'descrizione', 'modifiche', 'stato_richiesta'] });
    res.status(200).json({ richieste: richieste });
  }
  catch (err) {
    res.json({ error: err, message: 'Grafo non trovato' });
  }


}


//-----------APPROVA RICHIESTA-----------------------

//funzione per l'approvazione di una richiesta in fase di pending

export async function approvaRichiesta(req: Request, res: Response) {
  const { jwtDecode, id_richieste, stato_richiesta } = req.body;
  const utente = await Utente.findOne({ where: { email: jwtDecode.email, password: jwtDecode.password } });
  const id_utente = utente?.dataValues.id_utente;
  if (stato_richiesta === 'accettata') {
    const update = await Richieste.findOne({ where: { id_richieste: id_richieste, id_utente_response: id_utente }, attributes: ['id_richieste', 'id_grafo', 'id_utente_request', 'id_utente_response', 'descrizione', 'modifiche', 'stato_richiesta'] });
    if (update) {
      update.setDataValue('stato_richiesta', 'accettata');
      await update?.save();
    }
    res.status(200).json({ update: update });
  } else if (stato_richiesta === 'rifiutata') {
    const update = await Richieste.findOne({ where: { id_richieste: id_richieste, id_utente_response: id_utente }, attributes: ['id_richieste', 'id_grafo', 'id_utente_request', 'id_utente_response', 'descrizione', 'modifiche', 'stato_richiesta'] });
    if (update) {
      update?.setDataValue('stato_richiesta', 'rifiutata');
      await update?.save();
    }
    res.status(200).json({ update: update });
  }
}


//--------------VIEW RICHIESTE PER DATA -----------------------

//funzione per la visualizzazione delle richieste in base alla data

export async function viewRichiestePerData(req: Request, res: Response) {

  const { jwtDecode, nome_grafo, from, to, stato } = req.body;

  const utente = await Utente.findOne({ where: { email: jwtDecode.email, password: jwtDecode.password } });
  const id_utente = utente?.dataValues.id_utente;

  const grafo = await Grafo.findOne({ where: { nome_grafo: nome_grafo, id_utente: id_utente } });
  const id_grafo = grafo?.dataValues.id_grafo;

  try {

    if (stato === 'accettata') {

      const richieste = await Richieste.findAll({ where: { id_grafo: id_grafo, update_date: { [Op.gte]: from, [Op.lte]: to }, stato_richiesta: 'accettata' }, attributes: ['id_richieste', 'id_grafo', 'id_utente_request', 'id_utente_response', 'descrizione', 'modifiche', 'stato_richiesta'] });
      console.log(richieste);
      if (!richieste) {
        return res.status(404).json({ error: 'Grafo non ha richieste accettate' });
      }
      res.status(200).json({ richieste: richieste });
    }

    if (stato === 'rifiutata') {
      const richieste = await Richieste.findAll({ where: { id_grafo: id_grafo, update_date: { [Op.gte]: from, [Op.lte]: to }, stato_richiesta: 'rifiutata' }, attributes: ['id_richieste', 'id_grafo', 'id_utente_request', 'id_utente_response', 'descrizione', 'modifiche', 'stato_richiesta'] });
      if (!richieste) {
        return res.status(404).json({ error: 'Grafo non ha richieste rifiutate' });
      }
      res.status(200).json({ richieste: richieste });
    }
  } catch (err) {
    res.status(404).json({ error: err });
  }
}

//--------------VIEW RICHIESTE PER MODELLO ---------------------

//funzione per la visualizzazione delle richieste in base al modello

export async function getRichiestePerModello(req: Request, res: Response) {
  const { nome_grafo, jwtDecode } = req.body;
  const grafo = await Grafo.findOne({ where: { nome_grafo: nome_grafo } });
  if (!grafo) {
    return res.status(404).json({ message: 'Grafo con il nome fornito non trovato/ non presente sul database' });
  }
  const id_grafo = grafo?.dataValues.id_grafo;
  const utente = await Utente.findOne({ where: { email: jwtDecode.email, password: jwtDecode.password } });
  const id_utente = utente?.dataValues.id_utente;
  const richieste = await Richieste.findAll({ where: { id_grafo: id_grafo, stato_richiesta: 'pending' }, attributes: ['id_richieste', 'id_grafo', 'id_utente_request', 'id_utente_response', 'descrizione', 'modifiche', 'stato_richiesta'] });
  res.status(200).json({ message: "Richieste in pending per il modello selezionato", richieste: richieste });
}


//-----------------GET RICHIESTE PER UTENTE ------------------------

//funzione per la visualizzazione delle richieste in base all'utente

export async function getRichiestePerUtente(req: Request, res: Response) {
  const { jwtDecode } = req.body;

  const utente = await Utente.findOne({ where: { email: jwtDecode.email, password: jwtDecode.password } });
  const id_utente = utente?.dataValues.id_utente;
  const richieste = await Richieste.findAll({ where: { id_utente_response: id_utente, stato_richiesta: 'pending' }, attributes: ['id_richieste', 'id_grafo', 'id_utente_request', 'id_utente_response', 'descrizione', 'modifiche', 'stato_richiesta'] });

  res.status(200).json({ message: "Richieste in pending per l'utente selezionato", richieste: richieste });

}


//----------------------EXPORT DATA -------------------------------

//funzione per l'esportazione dei dati di richieste in base alla data e allo stato

export async function exportRichieste(req: Request, res: Response) {
  const { jwtDecode, nome_grafo, from, to, stato_richiesta, format } = req.body;

  try {

    const utente = await Utente.findOne({ where: { email: jwtDecode.email, password: jwtDecode.password } });
    const id_utente = utente?.dataValues.id_utente;

    const grafo = await Grafo.findOne({ where: { nome_grafo: nome_grafo, id_utente: id_utente } });
    const id_grafo = grafo?.dataValues.id_grafo;

    const richieste = await Richieste.findAll({ where: { id_grafo: id_grafo, update_date: { [Op.gte]: from, [Op.lte]: to }, stato_richiesta: stato_richiesta }, attributes: ['id_richieste', 'id_grafo', 'id_utente_request', 'id_utente_response', 'descrizione', 'modifiche', 'stato_richiesta'] });


    //res.status(200).json({richieste : richieste});



    const dataValuesOnly = richieste.map((item) => item.dataValues);

    switch (format) {
      case 'csv':
        const csv = writeCSV(dataValuesOnly);
        res.setHeader('Content-Type', 'text/csv');
        res.send(csv);
        break;
      case 'pdf':
        generatePDF(dataValuesOnly).then((pdf) => {
          res.setHeader('Content-Type', 'application/pdf');
          res.send(pdf);
        })
          .catch((err) => {
            res.status(500).json({ error: err });
          });

        break;
      case 'xml':
        const xml = convertToXML(dataValuesOnly);
        res.setHeader('Content-Type', 'application/xml');
        res.send(xml);
        break;
      case 'json':
      default:
        res.json(richieste);
        break;
    }
  }
  catch (err) {
    res.json({ error: err, message: 'Errore interno' });
  }

}