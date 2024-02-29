
export function convertiArchiInFormatoDijkstra(archi: any[]): { [key: string]: { [key: string]: number } } {
    const grafoDijkstra: { [key: string]: { [key: string]: number } } = {};
  
    archi.forEach(arco => {
      const nodoPartenza = Object.keys(arco)[0];
      const nodoArrivo = Object.keys(arco[nodoPartenza])[0];
      const peso = arco[nodoPartenza][nodoArrivo];
  
      if (!grafoDijkstra[nodoPartenza]) {
        grafoDijkstra[nodoPartenza] = {};
      }
  
      grafoDijkstra[nodoPartenza][nodoArrivo] = peso;
    });
  
    return grafoDijkstra;
  }

  