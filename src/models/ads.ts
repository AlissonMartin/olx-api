import { Model, DataTypes } from "sequelize";
import { sequelize } from '../instances/mysql'

interface adsInstance extends Model {
    id: number,
    idUser: number,
    state: string,
    category: string,
    images: [object],
    dateCreated: Date,
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
        type: DataTypes.INTEGER
    },
    priceNegotiable: {
        type: DataTypes.TINYINT
    },
    description: {
        type: DataTypes.STRING
    },
    views: {
        type: DataTypes.INTEGER
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