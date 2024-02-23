
# Progetto: Gestione di Modelli di Ottimizzazione su Grafo
![](/IMMAGINI/GRAFO.png)
## Indice
1. [Introduzione](#introduzione)
2. [Casi D'Uso ](#CasiD'Uso)
3. [Diagramma UML](#diagrammaUML)
4. [Database](#Database)
5. [Richieste](#richieste)
6. [Configurazioni iniziali](#configurazioni)
7. [Pattern Utilizzati](#pattern-utilizzati)
8. [Avvio Tramite Docker](#avvio-tramite-docker)
9.  [Software Utilizzati](#software-utilizzati)
10.[Autori](#autori)

## Introduzione
Questo progetto implementa un sistema per la gestione di modelli di ottimizzazione su grafi, consentendo agli utenti autenticati di creare e valutare tali modelli utilizzando JSON Web Tokens (JWT).Lo scopo è di trovare il percorso minimo del grafo utilizzando l'ALgoritmo Dijkstra.Il sistema simula il concetto di crowd-sourcing, permettendo agli utenti di contribuire attivamente. Abbiamo sviluppato un progetto lato back-end tramite il framework Node.js e Express per la creazione dell'applicazione lato server, sequelize per garantirci che le richieste che facciamo abbiano una sola istanza e Mysql per la creazione del database.

## Casi D'Uso
![](/IMMAGINI/USECASE1.png)
![](/IMMAGINI/USECASE2.png)

- **Login e SignIn:**
    - l'utente non registrato deve creare un account
    - l'utente gia registrato deve accedere all'area utenti con email e password 

- **Creazione di Nuovi Modelli:**
    - Gli utenti possono creare nuovi modelli specificando il grafo e i relativi pesi degli archi.
    - La richiesta di creazione viene validata e il costo è calcolato in base al numero di nodi e archi specificati.
    - L'utente deve avere credito sufficiente per creare un modello.

- **Aggiornamento dei Modelli:**
    - Gli utenti possono aggiornare i pesi degli archi nei modelli.
    - Le richieste di aggiornamento possono essere approvate o rifiutate dall'utente creatore del modello.
    - Il costo delle richieste di aggiornamento dipende dal numero di archi da aggiornare.
    - Il nuovo peso degli archi è calcolato tramite una media esponenziale.
    - Se l'utente non è proprietario deve inviare una richiesta e se accettata può aggiornare il grafo

- **Visualizzazione delle Richieste:**
    - È possibile visualizzare lo stato delle richieste di aggiornamento di un modello, puo essere pending,accettato e/o rifiutato

- **Approvazione/Rifiuto delle Richieste:**
    - Solo l'utente creatore del modello può approvare o rifiutare le richieste di aggiornament

- **Simulazione dei Pesi:**
    - È possibile variare il peso relativo di un arco considerando un valore di inizio, fine e passo di incremento.
    - Vengono restituiti tutti i risultati e il miglior risultato(best result) con la configurazione dei pesi utilizzati.
## Diagramma UML
## Database 
![](/IMMAGINI/DATABASE.png)
MySQL è un sistema di gestione di database relazionale (RDBMS) open source basato sul linguaggio di programmazione SQL (Structured Query Language).Per poterlo utilizzare abbiamo bisogno dell'istallazione. 

È uno dei sistemi di gestione di database più popolari e ampiamente utilizzati al mondo. Per poterlo utilizzare occore creare un account:
```
//Aggiorno sistema e installo MySql
$ sudo apt update
$ sudo apt update
//verifico se installazione sia corretta
$ sudo mysqld --version
```
Ora vado a creare un account 
```
$ mysql
$ CREATE USER 'username'@'localhost' IDENTIFIED BY 'password';
//Gestione dei privilegi di accesso al databaseù
$ GRANT ALL PRIVILEGES ON *.* TO ‘username’@'localhost';
```
Dopo aver creato un account abbiamo bisogno di fare un Data Import, dopodichè aggiorniamo lo schema del database e possiamo visualizzarlo nella finestra di destra. Ora possiamo creare dei file dove è possibile fare delle query. 
![](/IMMAGINI/DATABASE.png)
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
