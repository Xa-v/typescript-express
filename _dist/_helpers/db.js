"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const promise_1 = __importDefault(require("mysql2/promise"));
const sequelize_1 = require("sequelize");
// Load environment variables from .env file
dotenv_1.default.config();
// Initialize db object with the necessary properties
const db = {
    Sequelize: sequelize_1.Sequelize, // Sequelize class reference
    sequelize: {}, // Temporary empty object until the Sequelize instance is created
};
exports.default = db;
initialize();
function initialize() {
    return __awaiter(this, void 0, void 0, function* () {
        const { host, port, user, password, database } = process.env;
        // Ensure required environment variables are set
        if (!host || !port || !user || !password || !database) {
            console.error('Missing one or more required environment variables');
            throw new Error('Missing one or more required environment variables');
        }
        console.log('Database Configuration:', { host, port, user, password, database });
        try {
            // Connect to MySQL (without specifying the database initially)
            const connection = yield promise_1.default.createConnection({
                host,
                port: Number(port),
                user,
                password,
            });
            console.log('Successfully connected to MySQL server');
            // Ensure the database exists, create if necessary
            yield connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);
            console.log(`Database ${database} is ready`);
            yield connection.end(); // Close the initial connection (since we're now using Sequelize)
        }
        catch (err) {
            console.error('Error connecting to MySQL:');
            return; // Exit if the database connection failed
        }
        try {
            // Create Sequelize instance with the database details
            const sequelize = new sequelize_1.Sequelize(database, user, password, {
                dialect: 'mysql',
                host,
                port: Number(port),
                logging: console.log, // This logs all SQL queries to the console (helpful for debugging)
            });
            // Assign Sequelize instance to the db object
            db.sequelize = sequelize;
            // Initialize your models (e.g., User)
            const UserModel = require('../users/user.model')(sequelize);
            db.User = UserModel;
            // Sync all models with the database
            yield sequelize.sync({ alter: true });
            console.log('Sequelize synced successfully');
        }
        catch (err) {
            console.error('Error initializing Sequelize or syncing models:');
        }
    });
}
