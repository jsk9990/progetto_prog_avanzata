import { Sequelize } from "sequelize";


export class singleton {
    private static instance: singleton;
    private connection: Sequelize;
    private constructor() {
        this.connection = new Sequelize('Blog','jsk','jsk',{
            host : 'localhost',
            dialect : 'mysql'
        }); 
    }; 


    public static getConnection(): Sequelize {
        if (!singleton.instance) {
            singleton.instance = new singleton();
        }
        
        return singleton.instance.connection;   
            
        };    

}