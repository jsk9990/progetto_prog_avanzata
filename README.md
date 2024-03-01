
# Progetto: Gestione di Modelli di Ottimizzazione su Grafo
![](/IMMAGINI/GRAFO.png)
## 📚 Indice

- [🚀 Introduzione](#introduzione)
- [💼 Casi D'Uso](#CasiD'Uso)
- [🔀 Rotte](#rotte)
- [📐 Diagramma UML](#diagrammaUML)
- [💽 Database](#Database)
- [🛠️ Grafo](#Grafo)
- [⚙️ Configurazioni iniziali](#configurazioni)
- [🧩 Pattern Utilizzati](#pattern-utilizzati)
- [🧩 Programmazione Asincrona](#pattern-utilizzati)
- [🐳 Docker](#avvio-tramite-docker)
- [🛠️ Software Utilizzati](#software-utilizzati)
- [👥 Autori](#autori)
## Introduzione
Questo progetto implementa un sistema per la gestione di **modelli di ottimizzazione** su grafi, consentendo agli utenti autenticati di creare e valutare tali modelli utilizzando JSON Web Tokens (**JWT**).Lo scopo è di trovare il percorso minimo del grafo utilizzando l'ALgoritmo Dijkstra.Il sistema simula il concetto di **crowd-sourcing**, permettendo agli utenti di contribuire attivamente. Abbiamo sviluppato un progetto lato **back-end** tramite il framework **Node.js** e **Express** per la creazione dell'applicazione lato server, **Singleton** per garantire che l'istanza delle richieste siano uniche e **Mysql** per la creazione del database, tramite un linguaggio di programmazione **TypeScript**.

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
## Rotte
![](/IMMAGINI/ROTTE.png)
| Rotta | Tipo | Descrizione |
| ----- | ---- | ----------- |
| /home | GET | Ci connettiamo al database |
| /login | POST | Accedo tramite credeziali  |
| /sign_in | POST | Creo un account |
| /utenti | GET | Accedo nel area Utente |
| /creagrafo | POST | Creo il grafo  |
| /aggiorna | PUT |Aggiorno il grafo esistente |
| /admin | GET |Preleva tutti gli utenti  |
| /ricaricaCredito| POST | Ricarica credito dell'utente  |
| /simulazione | POST | Creazione del grafo e calcolo del percorso minimo con variazione di peso dell'arco  |
| /view_richieste | GET |Visualizzo tutte le richieste dell'utente corrispondente |
| /richieste_per_singolo_modello | GET |Visualizzo tutte le richieste rispetto al modello |
| /richieste_per_singolo_utente | GET |Visualizzo tutte le richieste dell'utente corrispondente |
| /accetta_rifiuta | POST | Le richieste in pending possono diventare  accettate o rifiutate|
| /aggiorna2 | POST | Aggiorno pesi dopo che la richiesta è stata accettata|
| /esecuzione | POST | Creazione del grafo e calcolo del percorso minimo  |
|/export| USE |Esposto file in formati differenti: csv,pdf,xml e json|

## Diagramma UML
## /home 
![](/IMMAGINI/home.png)
### /login
![](/IMMAGINI/login.png)
#### INPUT: 
```
{ 
    "email": "andrea.com",
    "password": "andrea"
}
```
#### OUTPUT: 
```
{
    "message": "Login effettuato con successo",
    "message2": "Ecco il tuo token:",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFuZHJlYS5jb20iLCJwYXNzd29yZCI6ImFuZHJlYSIsImlhdCI6MTcwODg3MDY2Nn0.bNRx9dQJkTuVm-idRpNKp6qMXMFHhyRNR5x2pxIxUTg"
}
```
## /sign_in 
![](/IMMAGINI/sign.png)
#### INPUT: 
```
{ 
    "email": "andrea.com",
    "password": "andrea",
    "credito" : 70,
    "privilegi": true 
}
```
#### OUTPUT: 
```
{
    "message": "I dati sono stati inseriti con successo",
    "utente": {
        "create_time": "2024-02-25T14:15:06.629Z",
        "id_utente": 3,
        "email": "andrea.com",
        "password": "andrea",
        "credito": 70,
        "privilegi": true
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFuZHJlYS5jb20iLCJwYXNzd29yZCI6ImFuZHJlYSIsImlhdCI6MTcwODg3MDUwNn0.jrgJA8F_7lSk4XU-1igbDWKhjV9CriGj4xMv_O2bWQQ"
}
```    
##  /utenti 
![](/IMMAGINI/utente.png)
#### OUTPUT: 
```
[
    
    {
        "id_utente": 1,
        "email": "andrea@andrea.com",
        "password": "andrea",
        "credito": 70,
        "privilegi": true,
        "create_time": "2024-02-25T14:52:47.000Z"
    },
    {
        "id_utente": 2,
        "email": "giuseppe@giuseppe.com",
        "password": "giuseppe",
        "credito": 98,
        "privilegi": true,
        "create_time": "2024-02-25T14:55:15.000Z"
    }
]
```    
## /creagrafo 
![](/IMMAGINI/creagrafo.png)
#### INPUT: 
```
{
    "nome_grafo": "grafo giuseppe",
    "struttura": [
        {
            "nodo_partenza": "Naruto",
            "nodo_arrivo": "Sasuke",
            "peso": 5
        },
        {
            "nodo_partenza": "Sasuke",
            "nodo_arrivo": "Itachi",
            "peso": 1
        },
        {
            "nodo_partenza": "Itachi",
            "nodo_arrivo": "Kisame",
            "peso": 3
        },
        {
            "nodo_partenza": "Kisame",
            "nodo_arrivo": "Naruto",
            "peso": 2
        }
    ]
}
```
![](/IMMAGINI/GRAFOO.png)
#### OUTPUT: 
```
{
    "message": "Grafo creato con successo",
    "grafo": {
        "Naruto": {
            "Sasuke": 5
        },
        "Sasuke": {
            "Itachi": 1
        },
        "Itachi": {
            "Kisame": 3
        },
        "Kisame": {
            "Naruto": 2
        }
    },
    "costo": 0.48000000000000004
}
```
##  /aggiorna 
#### CASO1: UTENTE E' PROPRIETARIO
![](/IMMAGINI/aggiorna1.png)
#### CASO1: UTENTE NON E' PROPRIETARIO
![](/IMMAGINI/aggiorna2.png)

##  /view_richieste 
![](/IMMAGINI/view-richieste.png)

##  /accetta_rifiuta 
![](/IMMAGINI/accetta-rifiuta.png)

##  /aggiorna2
![](/IMMAGINI/AGGIORNA3.png)

## /esecuzione 
![](/IMMAGINI/esecuzione.png)

#### INPUT: 
```
{ 
    "nome_grafo": "grafo giuseppe 5", 
    "nodo_partenza": "Naruto", 
    "nodo_arrivo": "Kisame" 
}
```
#### OUTPUT :
```
{
    "percorso": {
        "path": [
            "Naruto",
            "Sasuke",
            "Itachi",
            "Kisame"
        ],
        "cost": 9
    },
    "tempoEsecuzione": 0.11963500001002103,
    "costoAddebbitato": 0.48,
    "creditoResiduo": 23.56
}
```

##  /simulazione
![](/IMMAGINI/simulazione.png)

#### INPUT: 
```
{
    "nome_grafo": 12,
    "id_arco" : 42,
    "nodo_partenza" : "Goku",  
    "nodo_arrivo" : "Gohan", 
    "start_peso": 1,
    "stop_peso" :  5,
    "step" : 1
}
```
#### OUTPUT :
```
 {
    "risultati": [
        {
            "peso": 1,
            "cost": 1,
            "path": [
                "Goku",
                "Gohan"
            ]
        },
        {
            "peso": 2,
            "cost": 2,
            "path": [
                "Goku",
                "Gohan"
            ]
        },
        {
            "peso": 3,
            "cost": 3,
            "path": [
                "Goku",
                "Gohan"
            ]
        },
        {
            "peso": 4,
            "cost": 3,
            "path": [
                "Goku",
                "Trunks",
                "Vegeta",
                "Gohan"
            ]
        },
        {
            "peso": 5,
            "cost": 3,
            "path": [
                "Goku",
                "Trunks",
                "Vegeta",
                "Gohan"
            ]
        }
    ],
    "bestResult": {
        "cost": 1,
        "configuration": [
            "1"
        ],
        "path": [
            "Goku",
            "Gohan"
        ]
    }
}
```
![](/IMMAGINI/1.png)
![](/IMMAGINI/2.png)
##  /admin 
![](/IMMAGINI/ADMIN.png)

## /ricarica_credito
![](/IMMAGINI/ADMIN1.png)
#### INPUT: 
```
{
    "utente_da_ricaricare": "giuseppe@giuseppe.com", 
    "nuovo_credito" : 25
}
```
#### OUTPUT :
```
{
    "message": "Il credito è stato aggiornato con successo con successo: \n",
    "index": {
        "id_utente": 6,
        "email": "giuseppe@giuseppe.com",
        "password": "giuseppe",
        "credito": 25,
        "privilegi": true,
        "create_time": "2024-02-25T14:55:15.000Z"
    }
}
```
## Database 
![](/IMMAGINI/DATABASE.png)

MySQL è un sistema di gestione di database relazionale (RDBMS) open source basato sul linguaggio di programmazione SQL (Structured Query Language).È uno dei sistemi di gestione di database più popolari e ampiamente utilizzati al mondo. 

## Configurazioni iniziali
Questo è un progetto basato su Node.js e TypeScript. Qui sono riporta tutti i passaggi per configurare il progetto.
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
Infine, è necessario modificare il file package.json. Aggiungere il comando start che avvia il tuo progetto con Nodemon e TypeScript.Questo permette di eseguire il tuo progetto con il comando npm start.
```
 "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "nodemon --exec ts-node app.ts"
  }
```
## Grafo
Per testare la nostra applicazione creiamo due grafi con 8 nodi e 16 archi e verifichiamo se l 'algoritmo di Dijkstra funziona correttamente. Per poter visualizzare il file Json , aprire il file: [grafo.json](grafo.json).
![](/IMMAGINI/grafo1.png)
![](/IMMAGINI/grafo2.png)
## Pattern Utilizzati
### Chain of Responsability 
La chain Responsability è uno dei pattern comportamentali che ci permette di metter in comunicazione diversi oggetti tra loro .La chain Responsability ci permette di passare una richiesta attraverso una catena di handler. Nel momento un  handler  riceve una richiesta;deve decide se processare la richiesta o passarla all'handler successivo.Sotto viene riportato il diagramma delle sequenze della catena delle responsabilità.
![](/IMMAGINI/cor.png)
Middleware: Le funzioni di middleware costituiscono la spina dorsale di un'applicazione Express.js. Queste funzioni possono intercettare le richieste in arrivo ed eseguire azioni prima di passarle al middleware successivo o di restituire una risposta. I middleware possono essere utilizzati per vari scopi, come l'autenticazione, la registrazione, la gestione degli errori e altro ancora.
![](/IMMAGINI/middlware.png)

### Singleton 
I design pattern mettono a disposizione agli sviluppatori dei metodi che vanno a risolvere problemi ricorrenti.Il singleton pattern appartiene alla categoria dei modelli creazionali.Questo pattern vien utilizzato nella applicazioni che hanno bisogno di una singola instanza di una data classe. Questo ci permette di lavorare sempre con lo stesso dato. Se ad esempio si dovesse fare una connessione ad un database ,lavoreremo sempre con lo stesso dato. Non avremmmo connessioni multiple ad un batabase all'interno dell'applicazone. 
```
export class Singleton {
    private static instance: Singleton;
    private connection: Sequelize;
    private constructor() {
        this.connection = new Sequelize('mydb','andrea','*********',{
            host : 'localhost',
            dialect : 'mysql',
            logging: console.log
        }); 
    }; 

    public static getConnection(): Sequelize {
        if (!Singleton.instance) {
            Singleton.instance = new Singleton();
        }
        
        return Singleton.instance.connection;   
            
        };    

}
```
Per poter costruire la classe Singleton ho bisogno Object-Relational Mapping (ORM) per Node.js: Sequelize. È utilizzato per interagire con il database  MySQL e molti altri. Sequelize fornisce vari metodi utili per semplificare le operazioni di database come le query, la migrazione dei dati, la creazione e la gestione delle tabelle.
### Model-View-Controller 
Nel pattern MVC abbiamo tre componenti principali che svolgono compiti diversi:
- **Model** :Contiene la struttura dei dati , cioè contiene tutte le classi necessarie per l'applicazione
- **Controller** :COmponente che gestisce le operazione da svolgere. Qui si creano e si modificano gli oggetti 
- **View** : Qui possiamo visualizzare i i dari. Il client che utilizzerà l'appicazione può solo interagire con la View.
  
#### Pro di MVC:
Il codice più facile da gestire e da riutilizzare, perché suddivide il programma in parti più piccole e indipendenti.Questo permette di avere diverse visualizzazioni dei dati.Inoltre, promuove la creazione di moduli, che sono parti di codice che possono essere facilmente riutilizzate.

#### Contro di MVC:
Il controller può diventare un collo di bottiglia per applicazioni complesse con molte interazioni con l'utente.Può essere difficile da implementare per applicazioni con molte interazioni con l'utente.

## Programmazione Asincrona
Una funzione asincrona è una funzione che restituisce una Promessa. Quando chiami una funzione asincrona, essa avvia un'operazione asincrona, restituisce una promessa, e poi continua ad eseguire il codice successivo. Quando l'operazione asincrona è completa, la promessa viene risolta o rifiutata.

Le funzioni asincrone in TypeScript sono definite con la parola chiave async prima della parola chiave function. All'interno di una funzione asincrona, è possibile utilizzare la parola chiave await per mettere in pausa l'esecuzione del codice fino a quando una promessa non viene risolta.

```
export async function creaUtente(req: Request, res: Response) {
try {
    const {  email, password, credito, privilegi, token }  = req.body; 
    const utente = await Utente.create({ email, password, credito, privilegi});
    
    res.json({ message: 'I dati sono stati inseriti con successo', utente, token });
}
catch (error) {
    res.send('Errore:  '+ error);
}
```
Nel esempio, creaUtente è una funzione asincrona che crea un nuovo utente. Utilizza await per aspettare che la funzione Utente.create sia completata prima di procedere. Se Utente.create ha successo, invia una risposta JSON con un messaggio di successo e i dati dell'utente. Se si verifica un errore, invia una risposta con un messaggio di errore.

## Docker
![](/IMMAGINI/docker.png)
**Docker** nasce dalla difficoltà dei sviluppatori di creare un applicazione che è in grado di essere eseguita da tutti i client con sistemi operativi diversi. Docker offre la possibilità di risolvere queste problematiche; automatizza il deployment, la scalabilità e la gestione isolata di applicazioni attraverso l'uso di container.IL Docker per funzionare ha bisogno del **Immagine** Docker cioè un insieme di file, che contiene tutto ciò che è necessario per eseguire un'applicazione, compreso il codice sorgente, le librerie di sistema, le dipendenze e altri file necessari. L'immagine Docker è utilizzata per creare i **Container** Docker in cui l'applicazione viene effettivamente eseguita.

### Installazione Docker su Ubuntu 20.04
L’installazione di Docker fa riferimento al sistema operativo Ubuntu 20.04 e prevede solo pochi passaggi.
#### 1°: preparare il sistema
In primo luogo, accertatevi che il vostro sistema e tutti i pacchetti siano aggiornati. A tal fine, inserite i seguenti comandi nel vostro terminale per aggiornare il sistema:
```
sudo apt-get update
sudo apt-get upgrade
```
Qualora sia già stata utilizzata una versione di anteprima o beta di Docker, occorre rimuoverla prima di iniziare l’installazione di Docker, compresi tutti i file creati con quella versione:
```
sudo apt remove docker-desktop
rm -r $HOME/.docker/desktop
sudo rm /usr/local/bin/com.docker.cli
sudo apt purge docker-desktop
```
#### 2°: aggiungere il repository di Docker
Per l’installazione di Docker e per gli aggiornamenti successivi, è indispensabile utilizzare un repository che deve essere prima aggiunto al sistema. Per questo, bisogna prima installare i seguenti pacchetti:
```
sudo apt-get install \
    ca-certificates \
    curl \
    gnupg \
    lsb-release
```
A questo punto possiamo aggiungere la chiave GPG di Docker al nostro sistema:
```
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
```
Per concludere, dovete configurare il repository Docker con il seguente comando:
```
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
```
#### 3°: installare Docker Engine
Ora potete scaricare Docker Engine su Ubuntu 20.04. Anche questo può essere fatto attraverso il terminale. Se desiderate installare la versione attuale di Docker sul vostro sistema, eseguite il seguente comando:
```
sudo apt-get install docker-ce docker-ce-cli containerd.io
```
Al termine dell’installazione potete avviare il container Docker “Hello World” tramite riga di comando per accertarvi che tutto sia andato a buon fine:
```
sudo docker run hello-world
```
### Avvio tramite Docker

## 1. Preparazione di TypeScript

Per usare il comando `build`per costruire il Docker devo prima modificare il file `tsconfig.json`:

```
{
    "compilerOptions": {
        "target": "ES6",
        "esModuleInterop": true,
        "module": "CommonJS",
        "outDir": "./build",
        "rootDir": "./",
        "strict": truec
    }
}
```

## 2. Comandi per l'esecuzione di TypeScript
 Nel tuo package.json, è importante indicare come il docker avviera la nostra applicazione
```
 "scripts": {
    "prod" : "node app.ts",
    "dev" : "nodemon --exec ts-node app.ts",
    "build": "tsc",
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "nodemon --exec ts-node app.ts"
  } 
```
## 3. Dockerfile
Creo il file Dockerfile con il seguente contenuto:
```
# .......Development Stage.......
FROM node:20-alpine as development
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install -g npm@latest
RUN npm config set fetch-retry-maxtimeout 600000 
RUN npm install
RUN npm install -g ts-node
COPY . .
RUN npm run build

# .......Production Stage.......
FROM node:20-alpine as production
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --only=production
COPY . .
COPY --from=development /app/build ./build
CMD npm run prod
```

## 4. Docker Compose

Definisci il file docker-compose.yml:

```
version: '3.8'
services:
  mysql_server:
    # Configurazioni MySQL...
  app:
    # Configurazioni per il servizio app...
```
## 5. Creo credenziali per Account Mysql
Creo un nuovo account e concedo i privilegi.
```
CREATE USER 'nuovo_utente'@'localhost' IDENTIFIED BY 'password';
GRANT privilegio1, privilegio2 ON database_tabella TO 'nuovo_utente'@'localhost';
FLUSH PRIVILEGES;
```
Per poter visualizzare il server Mysql sia attivo ,o meno, occorre usare i seguenti comandi:
```
$ sudo service mysql star
$ sudo service mysql status
```

## 6. Costruzione del progetto

Esegui il comando per la costruzione del progetto:
```
npm run build
```
## 7. Creazione e avvio del container
Esegui il seguente comando per creare e avviare il container:
```
docker-compose up --build 
```
## 8. Controllo se Docker Container e Docker Immagine sono state create correttamente.
```
docker ps -a 
docker inspect progetto_prog_avanzata_app
docker image ls
``` 

## Software Utilizzati
- **Visual Studio Code**: Editor di codice multipiattaforma sviluppato da Microsoft, offre funzionalità come debugging, controllo Git.
- **TypeScript**: Linguaggio di programmazione open source sviluppato da Microsoft che estende JavaScript aggiungendo tipi statici e classi.
- **Node.js**: Ambiente di runtime open source per JavaScript, consente di eseguire codice JavaScript lato server per lo sviluppo di applicazioni web.
- **Express**: Framework per applicazioni web Node.js, fornisce un insieme di funzionalità per creare applicazioni web e mobile in modo rapido ed efficiente.
- **Docker** : Gestore di container
- **Postman** : Software per l'API Testing
## Autori
- [GIUSEPPE de STASIO](https://github.com/jsk9990)
- [ANDREA LANGIOTTI](https://github.com/Langiott)



