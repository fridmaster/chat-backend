import { Model, DataTypes } from "sequelize";
import { sequelize } from './dbConnection'

export class Message extends Model {
  public id!: string;
  public userId!: string;
  public readonly text!: string;
  public readonly userName!: string;
  //
}

Message.init(
  {
    id: {
      type: new DataTypes.STRING(128),
      primaryKey: true
    },
    userId: {
      type: new DataTypes.STRING(128),
      allowNull: false
    },
    text: {
      type: new DataTypes.STRING(128),
      allowNull: false
    },
    userName: {
      type: new DataTypes.STRING(128),
      allowNull: false
    }
  },
  {
    tableName: "messages",
    sequelize: sequelize // this bit is important
  }

);