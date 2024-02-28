
import { Grafo} from '../Model/Grafo';
import { Nodi } from '../Model/Nodi';

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