import { Sequelize, DataTypes, Model, Optional } from 'sequelize';

interface UserAttributes {
  id: string;
  username: string;
  passwordHash: string;
  name: string;
}

interface UserCreationAttributes extends Optional<UserAttributes, 'id'> {}

module.exports = (sequelize: Sequelize) => {
  const attributes = {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true, allowNull: false },
    username: { type: DataTypes.STRING, allowNull: false },
    passwordHash: { type: DataTypes.STRING, allowNull: false },
    name: { type: DataTypes.STRING, allowNull: false },
  };

  const options = {
    defaultScope: {
      attributes: { exclude: ['passwordHash'] },
    },
    scopes: {
      withHash: { attributes: [] },
    },
  };

  // Define the User model with the proper typing
  class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
    id!: string;
    username!: string;
    passwordHash!: string;
    name!: string;
  }

  User.init(attributes, { ...options, sequelize });

  return User;
};
