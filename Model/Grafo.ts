import {DataTypes,Sequelize} from 'sequelize'; //importo sequelize 
import {Singleton}  from './Singleton'; //import singleton 


const sequelize: Sequelize = Singleton.getConnection();

export const Grafo = sequelize.define('Grafo', {
    id_grafo: {
        type:DataTypes.INTEGER(),
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    id_utente: { 
        type:DataTypes.INTEGER(),
        autoIncrement: true,
        allowNull: false,
        references: {
            model: 'Utente', // Nome della tabella di riferimento
            key: 'id_utente' // Chiave primaria nella tabella di riferimento
        }
    },
    nome_grafo: {
        type: DataTypes.STRING(45),
        allowNull: false
    }
  
},
{ 
    timestamps: false,
    freezeTableName: true
}); 

module.exports = { Grafo: Grafo };