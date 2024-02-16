import {DataTypes,Sequelize} from 'sequelize'; //importo sequelize 
import {singleton}  from './Singleton'; //import singleton 

const sequelize: Sequelize = singleton.getConnection();

export const Nodi = sequelize.define('Nodi', {
    id_nodi: {
        type:DataTypes.INTEGER(),
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    id_grafo: {
        type: DataTypes.STRING(45),
        allowNull: false,
        references: {
            model: Grafo,
            key: 'id_grafo'
          }
    },
    nodo_nome: {
        type:DataTypes.STRING(45),
        allowNull: false
    },
},

{ 
    timestamps: false,
    freezeTableName: true
}); 

module.exports = { Nodi: Nodi };
