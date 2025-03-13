"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
module.exports = (sequelize) => {
    const attributes = {
        id: { type: sequelize_1.DataTypes.UUID, defaultValue: sequelize_1.DataTypes.UUIDV4, primaryKey: true, allowNull: false },
        username: { type: sequelize_1.DataTypes.STRING, allowNull: false },
        passwordHash: { type: sequelize_1.DataTypes.STRING, allowNull: false },
        name: { type: sequelize_1.DataTypes.STRING, allowNull: false },
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
    class User extends sequelize_1.Model {
    }
    User.init(attributes, Object.assign(Object.assign({}, options), { sequelize }));
    return User;
};
