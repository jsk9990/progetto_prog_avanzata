import { Sequelize } from "sequelize";


export class Singleton {
    private static instance: Singleton;
    private connection: Sequelize;
    private constructor() {
        this.connection = new Sequelize('Blog','jsk','jsk',{
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