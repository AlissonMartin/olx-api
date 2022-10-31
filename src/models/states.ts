import { Model, DataTypes } from "sequelize";
import { sequelize } from '../instances/mysql'

export interface StatesInstance extends Model {
    id:number,
    name:string
}

export const States = sequelize.define<StatesInstance>('State', {
    id: {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER
    },
    name: {
        type: DataTypes.STRING
    }
},
{
    tableName:'states',
    timestamps: false
}
)