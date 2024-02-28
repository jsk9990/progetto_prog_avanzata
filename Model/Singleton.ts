import { Sequelize } from "sequelize";
import 'dotenv/config';

const dbName = process.env.DB_NAME!;
const dbUser = process.env.DB_USER!;
const dbPassword = process.env.DB_PASS!;

if(!dbName || !dbUser || !dbPassword){
    throw new Error('Missing database credentials');
}


export class Singleton {
    private static instance: Singleton;
    private connection: Sequelize;
    private constructor() {
        this.connection = new Sequelize(dbName,dbUser,dbPassword,{
            host : 'localhost',
            dialect : 'mysql'
        }); 
    }; 


    public static getConnection(): Sequelize {
        if (!Singleton.instance) {
            Singleton.instance = new Singleton();
        }
        
        return Singleton.instance.connection;   
            
        };    

}