import { Model, DataTypes } from "sequelize";
import { sequelize } from '../instances/mysql'

interface adsInstance extends Model {
    id: number,
    idUser: number,
    state: string,
    category: string,
    images: string,
    dateCreated: string,
    title: string,
    price: number,
    priceNegotiable: number,
    description: string,
    views:number,
    status: number

}

export const Ads = sequelize.define<adsInstance>('Ads', {
    id: {
        primaryKey: true,
        autoIncrement:true,
        type: DataTypes.INTEGER
    },
    idUser: {
        type: DataTypes.INTEGER
    },
    state: {
        type: DataTypes.STRING
    },
    category: {
        type: DataTypes.STRING
    },
    images: {
        type: DataTypes.STRING
    },
    dateCreated: {
        type: DataTypes.DATE
    },
    title: {
        type: DataTypes.STRING
    },
    price: {
        type: DataTypes.FLOAT
    },
    priceNegotiable: {
        type: DataTypes.TINYINT,
        defaultValue: 0
    },
    description: {
        type: DataTypes.STRING,
        defaultValue: ''
    },
    views: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    status: {
        type: DataTypes.TINYINT
    }, 
},
{
    tableName: 'ads',
    timestamps: false
}

)