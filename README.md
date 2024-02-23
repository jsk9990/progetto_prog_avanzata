
# Progetto: Gestione di Modelli di Ottimizzazione su Grafo
![](/IMMAGINI/GRAFO.png)
## 📚 Indice

- [🚀 Introduzione](#introduzione)
- [💼 Casi D'Uso](#CasiD'Uso)
- [📐 Diagramma UML](#diagrammaUML)
- [💽 Database](#Database)
- [🔀 Rotte](#rotte)
- [⚙️ Configurazioni iniziali](#configurazioni)
- [🧩 Pattern Utilizzati](#pattern-utilizzati)
- [🐳 Avvio Tramite Docker](#avvio-tramite-docker)
- [🛠️ Software Utilizzati](#software-utilizzati)
- [👥 Autori](#autori)
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
MySQL è un sistema di gestione di database relazionale (RDBMS) open source basato sul linguaggio di programmazione SQL (Structured Query Language).È uno dei sistemi di gestione di database più popolari e ampiamente utilizzati al mondo. Inanzitutto andiamo ad istallare mysql da terminale.I comandi fanno riferimento ad un sistema operativo Linux.
```
//Aggiorno il sistema e installo MySql
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
Dopo aver creato un account abbiamo bisogno di fare un 'Data Import',qui abbiamo bisogno di specificare che lavoriamo il locale http://localhost:/ nella porta 3036. Dopodichè aggiorniamo lo schema del database.Ora possiamo creare dei file dove è possibile fare delle 'query', questo ci aiuta a visualizzare il contenuto del database. 

Per poter visualizzare il server Mysql sia attivo ,o meno, occorre usare i seguenti comandi:
```
$ sudo service mysql star
$ sudo service mysql status
```
![](/IMMAGINI/DATABASE1.png)
## Rotte
![](/IMMAGINI/ROTTE.png)

| Rotta | Tipo | Descrizione |
| ----- | ---- | ----------- |
| /home | GET | Ci connettiamo al database |
| /login | POST | Accedo tramite credeziali  |
| /sign_in | POST | Creo un account |
| /utente | GET | Accedo nel area Utente |
| /creagrafo | POST | Creo il grafo  |
| /aggiorna | PUT |Aggiorno il grafo esistente |
| /richieste | GET |Accedo nell'area Richieste |
| /admin | GET | Accedo nell'area admin se ho i giusti privilegi |
| /simulazione | POST | Creazione del grafo e calcolo del percorso minimo  |
| /view_richieste | GET |Visualizzo tutte le richieste dell'utente corrispondente |
| /accetta_rifiuta | PUT | Le richieste in pending possono diventare  accettate o rifiutate|
## Configurazioni iniziali

Questo è un progetto basato su Node.js e TypeScript. Qui sono riportati i passaggi per configurare il tuo progetto.

### Configurazione Iniziale
Inizia inizializzando il tuo progetto con npm. Questo creerà un file `package.json` per il tuo progetto.
```
npm init -y
```
### Installazione Dipendenze
Il tuo progetto ha bisogno di alcune dipendenze, tra cui Express per il server web e TypeScript per la scrittura di codice JavaScript tipizzato. Installa queste dipendenze con il seguente comando:
```
npm install express typescript @types/node @types/express
```
### Configurazione TypeScript
TypeScript ha bisogno di un file di configurazione, chiamato tsconfig.json, per funzionare correttamente. Crea questo file e aggiungi il seguente codice:
```
{
  "compilerOptions": {
    "target": "es6",
    "module": "commonjs",
    "outDir": "./dist",
    "strict": true
  }
}
```
### Configurazione Nodemon & TypeScript
Nodemon è uno strumento che aiuta a sviluppare applicazioni basate su node.js rilevando automaticamente i cambiamenti dei file e riavviando il server. TypeScript è un superset di JavaScript che aggiunge tipi statici. Questi possono essere installati come dipendenze di sviluppo con i seguenti comandi:
```
npm install --save-dev nodemon
npm install --save-dev ts-node
```
### Modifica package.json
Infine, è necessario modificare il file package.json per aggiungere un comando start che avvia il tuo progetto con Nodemon e TypeScript. Questo permette di eseguire il tuo progetto con il comando npm start.
```
 "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "nodemon --exec ts-node app.ts"
  }
```
## Pattern Utilizzati



## Avvio Tramite Docker



## Software Utilizzati


## Autori


## Tecnologie Utilizzate

- TypeScript per lo sviluppo del codice.
- JSON Web Tokens (JWT) per l'autenticazione degli utenti.
- Seed di database per inizializzare il credito degli utenti.
- Rotte per l'utente con ruolo admin per ricaricare il credito degli utenti.
