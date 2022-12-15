import { Model, DataTypes } from "sequelize";
import { sequelize } from '../instances/mysql'

interface usersInstance extends Model {
    id: number,
    name: string,
    email: string,
    state: string,
    passwordHash: string,
    token: string,
    photo: string
}

export const Users = sequelize.define<usersInstance>('Users',
    {
        id: {
            primaryKey: true,
            autoIncrement:true,
            type: DataTypes.INTEGER
        },
        name: {
            type: DataTypes.STRING
        },
        email: {
            type: DataTypes.STRING
        },
        state: {
            type: DataTypes.STRING
        },
        passwordHash: {
            type: DataTypes.STRING
        },
        token: {
            type: DataTypes.STRING
        },
        photo: {
            type: DataTypes.TEXT
        }
    },
    {
        tableName:'users',
        timestamps: false
    }

)