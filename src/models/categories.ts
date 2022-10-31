import { Model, DataTypes } from "sequelize";
import { sequelize } from '../instances/mysql'

interface categoriesInstance extends Model {
    id: number,
    name: string,
    slug: string
}

export const Categories = sequelize.define<categoriesInstance>('Categories', {
    id: {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER
    },
    name: {
        type: DataTypes.STRING
    },
    slug: {
        type:DataTypes.STRING
    }
},
    {
        tableName: 'categories',
        timestamps: false
    }

)