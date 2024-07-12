import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/db';
import Book from './book';

class User extends Model {
  public id!: string;
  public username!: string;
  public password!: string;
  public role!: 'admin' | 'user';

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

User.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM('admin', 'user'),
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'User',
});

export default User;
