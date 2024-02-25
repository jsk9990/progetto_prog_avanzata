
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
## /home 
![](/IMMAGINI/home.png)
###  /login
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
##  /sign_in 
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
![](/IMMAGINI/utenti.png)
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
![](/IMMAGINI/aggiorna3.png)
##  /simulazione
![](/IMMAGINI/simulazione.png)
##  /admin 
![](/IMMAGINI/ADMIN.png)
## /admin_ricarica_credito
![](/IMMAGINI/ADMIN2.png)

## Database 
![](/IMMAGINI/DATABASE.png)
MySQL è un sistema di gestione di database relazionale (RDBMS) open source basato sul linguaggio di programmazione SQL (Structured Query Language).È uno dei sistemi di gestione di database più popolari e ampiamente utilizzati al mondo. 
### Installazione 
Inanzitutto andiamo ad istallare mysql da terminale.I comandi fanno riferimento ad un sistema operativo Linux su Ubuntu 20.04.
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
| /utenti | GET | Accedo nel area Utente |
| /creagrafo | POST | Creo il grafo  |
| /aggiorna | PUT |Aggiorno il grafo esistente |
| /admin | GET | Accedo nell'area admin se ho i giusti privilegi |
| /simulazione | POST | Creazione del grafo e calcolo del percorso minimo  |
| /view_richieste | GET |Visualizzo tutte le richieste dell'utente corrispondente |
| /accetta_rifiuta | POST | Le richieste in pending possono diventare  accettate o rifiutate|
| /aggiorna2 | POST | Aggiorno pesi dopo che la richiesta è stata accettata|

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
### Installazione Docker su Ubuntu 20.04
L’installazione di Docker sul vostro sistema Linux con Ubuntu 20.04 prevede solo pochi passaggi.
#### Primo passaggio: preparare il sistema
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
#### Secondo passaggio: aggiungere il repository di Docker
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
#### Terzo passaggio: installare Docker Engine
Ora potete scaricare Docker Engine su Ubuntu 20.04. Anche questo può essere fatto attraverso il terminale. Se desiderate installare la versione attuale di Docker sul vostro sistema, eseguite il seguente comando:
```
sudo apt-get install docker-ce docker-ce-cli containerd.io
```
Al termine dell’installazione potete avviare il container Docker “Hello World” tramite riga di comando per accertarvi che tutto sia andato a buon fine:
```
sudo docker run hello-world
```


## Software Utilizzati


## Autori
### GIUSEPPE de STASIO
### ANDREA LANGIOTTI 


## Tecnologie Utilizzate


