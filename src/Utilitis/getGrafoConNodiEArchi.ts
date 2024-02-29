import { Grafo } from "../Model/Grafo";
import { Archi } from "../Model/Archi";
import { Nodi } from "../Model/Nodi";


export async function getGrafoConNodiEArchi(id_grafo: number): Promise<any> {
    try {
      // Fetch the graph by its primary key
      const grafo = await Grafo.findByPk(id_grafo);
      if (!grafo) {
        throw new Error('Grafo non trovato');
      }
  
      // Fetch all nodes and edges associated with the graph
      const nodi = await Nodi.findAll({ where: { id_grafo } });
      const archi = await Archi.findAll({ where: { id_grafo } });
  
      // Format the data into JSON
      const risultato = {
        archi: archi.map(arco => {
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
    } catch (error) {
      // Log and rethrow any errors encountered
      console.error('Errore durante il recupero del grafo:', error);
      throw error;
    }
  }