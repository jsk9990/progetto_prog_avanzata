
# Progetto: Gestione di Modelli di Ottimizzazione su Grafo
## Indice

1. [Introduzione](#introduzione)
2. [Richieste](#richieste)
3. [Funzionamento principale](#funzionamentoprincipale)
4. [Diagramma UML](#diagramma-uml)
5. [Pattern Utilizzati](#pattern-utilizzati)
6. [Avvio Tramite Docker](#avvio-tramite-docker)
7. [Software Utilizzati](#software-utilizzati)
8. [Autori](#autori)

## Introduzione
![](/IMMAGINI/GRAFO.png)
Questo progetto implementa un sistema per la gestione di modelli di ottimizzazione su grafi, consentendo agli utenti autenticati di creare e valutare tali modelli utilizzando JSON Web Tokens (JWT).Lo scopo è di trovare il percorso minimo del grafo utilizzando l'ALgoritmo Dijkstra.Il sistema simula il concetto di crowd-sourcing, permettendo agli utenti di contribuire attivamente. Abbiamo sviluppato un progetto lato back-end tramite il framework Node.js e Express per la creazione dell'applicazione lato server, sequelize per garantirci che le richieste che facciamo abbiano una sola istanza e Mysql per la creazione del database.

## Diagramma UML

## Casi D'Uso 


## Funzionalità Principali

- **Creazione di Nuovi Modelli:**
    - Gli utenti possono creare nuovi modelli specificando il grafo e i relativi pesi degli archi.
    - La richiesta di creazione viene validata e il costo è calcolato in base al numero di nodi e archi specificati.
    - L'utente deve avere credito sufficiente per creare un modello.

- **Aggiornamento dei Modelli:**
    - Gli utenti possono aggiornare i pesi degli archi nei modelli.
    - Le richieste di aggiornamento possono essere approvate o rifiutate dall'utente creatore del modello.
    - Il costo delle richieste di aggiornamento dipende dal numero di archi da aggiornare.
    - Il nuovo peso degli archi è calcolato tramite una media esponenziale.

- **Visualizzazione delle Richieste:**
    - È possibile visualizzare lo stato delle richieste di aggiornamento di un modello, filtrando per data e stato.
    - È disponibile una rotta per visualizzare le richieste di aggiornamento in sospeso relative ai modelli dell'utente autenticato.

- **Approvazione/Rifiuto delle Richieste:**
    - Solo l'utente creatore del modello può approvare o rifiutare le richieste di aggiornamento, anche in modalità bulk.

- **Esecuzione del Modello:**
    - È possibile eseguire un modello specificando un nodo di partenza e di arrivo.
    - Il costo dell'esecuzione è pari a quello addebitato durante la creazione del modello.

- **Simulazione dei Pesi:**
    - È possibile variare il peso relativo di un arco specificando un valore di inizio, fine e passo di incremento.
    - Vengono restituiti tutti i risultati e il miglior risultato con la configurazione dei pesi utilizzati.

## Richieste

## Pattern Utilizzati



## Avvio Tramite Docker



## Software Utilizzati


## Autori


## Tecnologie Utilizzate

- TypeScript per lo sviluppo del codice.
- JSON Web Tokens (JWT) per l'autenticazione degli utenti.
- Seed di database per inizializzare il credito degli utenti.
- Rotte per l'utente con ruolo admin per ricaricare il credito degli utenti.
