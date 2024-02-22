import { Request, Response } from 'express';
import { Grafo} from '../Model/Grafo';
import { Nodi } from '../Model/Nodi';
import { Archi } from '../Model/Archi';
import { Utente } from '../Model/Utente';
import Graph from "node-dijkstra"; // Importa la libreria node-dijkstra
import { getGrafoConNodiEArchi, convertiArchiInFormatoDijkstra } from './controllerGrafo1';
import { json } from 'sequelize';
import { arch } from 'os';



async function preprareData (arco: any, id_grafo: number): Promise<any> {
  const grafo = await Grafo.findByPk(id_grafo);
    if (!grafo) {
      throw new Error('Grafo non trovato');
    }

    // Fetch all nodes and edges associated with the graph
    const nodi = await Nodi.findAll({ where: { id_grafo } });
    const archi = arco;
    const risultato = {
      archi: archi.map((arco:any) => {
        // Find the start and end node for each edge
        const nodoPartenza = nodi.find(nodo => nodo.getDataValue('id_nodi') === arco.getDataValue('id_nodo_partenza'));
        const nodoArrivo = nodi.find(nodo => nodo.getDataValue('id_nodi') === arco.getDataValue('id_nodo_arrivo'));
        // Return the edge with its weight
        return {
          [nodoPartenza?.getDataValue('nodo_nome')]: {
            [nodoArrivo?.getDataValue('nodo_nome')]: arco.getDataValue('peso'),
          }
        };
      }),
    };
    return risultato;
    }
  

/*-------------DANIELE--------------------------

function preparazioneGrafo(arco: any){
  const graphData: { [key: string]: { [key: string]: number } } = {};
  arco.forEach((arco: any) => {
    if (!graphData[arco.id_nodo_partenza]) {
      graphData[arco.id_nodo_partenza] = {};
    }

    graphData[arco.id_nodo_partenza][arco.id_nodo_arrivo] = arco.peso;
  })
  return graphData;
}
*/ //--------------------------------------------------------------------
/*
export async function getSimulazione(req: Request, res: Response) {
  const { id_grafo, id_arco, nodo_partenza, nodo_arrivo, start_peso, stop_peso, step } = req.body;

  const grafo = await Grafo.findByPk(id_grafo);
  const nodi = await Nodi.findAll({ where: { id_grafo } });
  const archi = await Archi.findAll({ where: { id_grafo } });
  const risultati = [];
  console.log(archi);
  let bestResult : any = {cost : Infinity, configuration: null, path : []}; 

  try {
    for (let peso = start_peso; peso <= stop_peso; peso += step) {
     // Mappa tutti gli archi e trova quello con l'id specificato
     const arcoSimulato = archi.map((arco: any) => {
      const arcoSemplice = arco.get ? arco.get({ plain: true }) : arco; // Gestisce sia oggetti Sequelize che normali oggetti JS
      if (arcoSemplice.id === id_arco) {
          return { ...arcoSemplice, peso }; // Aggiorna il peso per l'arco specificato
      }
      return arcoSemplice; // Restituisce l'arco non modificato per gli altri archi
      });
      const graphData = preparazioneGrafo(arcoSimulato);

      //console.log(graphData);
      const grafoSimulato = new Graph(graphData);
      const risultato = grafoSimulato.path(nodo_partenza, nodo_arrivo, { cost: true });
      if (typeof risultato === 'object' && 'cost' in risultato && 'path' in risultato) {
        risultati.push({ peso, cost: risultato.cost, path: risultato.path });

        if (risultato.cost < bestResult.cost) {
            bestResult = { cost: risultato.cost, configuration: peso, path: risultato.path };
        }
    }

      console.log(risultato);
      risultati.push(risultato);

    }

    // Send the results back in the response
    
  } catch (error) {
    // Log and rethrow any errors encountered
    console.error(error);
    throw error;
  }
  
  res.json({risultati});
}
*/ // -----------------------------------------DANIELE SOPRA ---------------------------------



export async function getSimulazione(req: Request, res: Response) {
  const { id_grafo, id_arco, nodo_partenza, nodo_arrivo, start_peso, stop_peso, step } = req.body;

  const grafo = await Grafo.findByPk(id_grafo);
  const nodi = await Nodi.findAll({ where: { id_grafo } });
  const archi = await Archi.findAll({ where: { id_grafo } });
  const archiOriginali = [...archi];
  const risultati = [];
  //best result = array vuoto

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

    //console.log(archiOriginali);
    const graphData = await preprareData(archiOriginali , id_grafo);

    //console.log('GraphData: ' + graphData);
    const grafoDijkstraFormat =  await convertiArchiInFormatoDijkstra(graphData.archi);
    //console.log('Grafo dijkstra format: ' + grafoDijkstraFormat);
    const grafoSimulato = new Graph(grafoDijkstraFormat);
    const risultato = grafoSimulato.path(nodo_partenza, nodo_arrivo, { cost: true });

    const risultato1 = JSON.parse(JSON.stringify(risultato));
    

    if (typeof risultato === 'object' && 'cost' in risultato && 'path' in risultato) {
      risultati.push({ peso, cost: risultato1.cost, path: risultato1.path });
    }
    // if ( risultato1.cost <= bestResult.cost) {
    //     bestResult = { cost: risultato1.cost, configuration: peso, path: risultato1.path };
    //}
    // mandare nel res anche best result
    
  }} catch (error) {
    // Log and rethrow any errors encountered
    console.error(error);
    throw error;
  }
  
  res.json({risultati});
}
