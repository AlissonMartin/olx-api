import { Model, DataTypes } from "sequelize";
import { sequelize } from '../instances/mysql'

interface adsInstance extends Model {
    id: number,
    idUser: number,
    idState: number,
    idCategory: number,
    images: string,
    dateCreated: Date,
    tilte: string,
    price: number,
    priceNegotiable: Boolean,
    views:number,
    status: string

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
    idState: {
        type: DataTypes.INTEGER
    },
    idCategory: {
        type: DataTypes.INTEGER
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
    views: {
        type: DataTypes.INTEGER
    },
    status: {
        type: DataTypes.STRING
    }, 
},
{
    tableName: 'ads',
    timestamps: false
}

)