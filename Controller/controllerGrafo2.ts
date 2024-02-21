type SimulationResult = {
  weight: number;
  result: any; // Sostituire con il tipo appropriato per il risultato della simulazione
};

type BestResult = {
  bestWeight: number;
  bestOutcome: any; // Sostituire con il tipo appropriato per il risultato della simulazione
};

async function simulateWeightChange(start: number, stop: number, step: number): Promise<{results: SimulationResult[], bestResult: BestResult}> {
  if (start >= stop || step <= 0) {
    throw new Error('Range non ammissibile: start deve essere minore di stop e step deve essere maggiore di 0');
  }

  let results: SimulationResult[] = [];
  let bestResult: BestResult = { bestWeight: start, bestOutcome: null }; // Inizializzare con il tipo appropriato per il risultato della simulazione

  for (let weight = start; weight <= stop; weight += step) {
    const result = await runSimulation(weight); // Sostituire con la funzione di simulazione effettiva
    results.push({ weight, result });

    // Aggiornare il bestResult se necessario
    if (isBetterResult(result, bestResult.bestOutcome)) { // Sostituire con la logica per determinare il "miglior risultato"
      bestResult = { bestWeight: weight, bestOutcome: result };
    }
  }

  // Restituzione dei risultati in formato JSON
  return { results, bestResult };
}

// Funzione di esempio per eseguire la simulazione (da sostituire con la logica effettiva)
async function runSimulation(weight: number): Promise<any> {
  // Simulazione del risultato (esempio)
  return new Promise(resolve => setTimeout(() => resolve(`Risultato per peso ${weight}`), 1000));
}

// Funzione di esempio per determinare se un risultato è migliore di un altro (da sostituire con la logica effettiva)
function isBetterResult(newResult: any, currentBestResult: any): boolean {
  // Logica per confrontare i risultati (esempio)
  return true; // Sostituire con la logica di confronto appropriata
}

// Esempio di utilizzo della funzione
simulateWeightChange(1, 2, 0.05)
  .then(simulationData => {
    console.log('Risultati della simulazione:', simulationData.results);
    console.log('Miglior risultato:', simulationData.bestResult);
  })
  .catch(error => {
    console.error('Errore durante la simulazione:', error);
  });
