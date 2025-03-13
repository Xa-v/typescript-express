import dotenv from 'dotenv';
import mysql from 'mysql2/promise';
import { Sequelize } from 'sequelize';

// Load environment variables from .env file
dotenv.config();

// Define an interface for the database object
interface Db {
  [key: string]: any;
  Sequelize: typeof Sequelize;
  sequelize: Sequelize;
  User?: any;
}

// Initialize db object with the necessary properties
const db: Db = {
  Sequelize,      // Sequelize class reference
  sequelize: {} as Sequelize, // Temporary empty object until the Sequelize instance is created
}; 

export default db;

initialize();

async function initialize() {
  const { host, port, user, password, database } = process.env;

  // Ensure required environment variables are set
  if (!host || !port || !user || !password || !database) {
    console.error('Missing one or more required environment variables');
    throw new Error('Missing one or more required environment variables');
  }
 
  console.log('Database Configuration:', { host, port, user, password, database });

  try {
    // Connect to MySQL (without specifying the database initially)
    const connection = await mysql.createConnection({
      host,
      port: Number(port),
      user,
      password,
    });

    console.log('Successfully connected to MySQL server');

    // Ensure the database exists, create if necessary
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);
    console.log(`Database ${database} is ready`);

    await connection.end(); // Close the initial connection (since we're now using Sequelize)
  } catch (err) {
    console.error('Error connecting to MySQL:');
    return; // Exit if the database connection failed
  }

  try {
    // Create Sequelize instance with the database details
    const sequelize = new Sequelize(database!, user!, password!, {
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
    await sequelize.sync({ alter: true });
    console.log('Sequelize synced successfully');
  } catch (err) {
    console.error('Error initializing Sequelize or syncing models:');
  }
}
