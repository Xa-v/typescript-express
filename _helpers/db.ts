import "reflect-metadata";
import dotenv from "dotenv";
import { DataSource } from "typeorm";
import { Employee } from "../employees/employee.entity";
import { Department } from "../departments/department.entity";

// Load environment variables from .env file
dotenv.config();

// Define an interface for the database object
interface Db {
  dataSource: DataSource;
}

export const db: Db = {
  dataSource: {} as DataSource,
};


async function createDatabaseIfNeeded(typeOrmConfig: any): Promise<void> {
  if (typeOrmConfig.type !== "mysql") {
    throw new Error("Auto-creation is only supported for MySQL.");
  }


  const masterDataSource = new DataSource({
    ...typeOrmConfig,
    database: "mysql",
  });

  try {
    await masterDataSource.initialize();
    console.log("Connected to master database.");
    await masterDataSource.query(
      `CREATE DATABASE IF NOT EXISTS \`${typeOrmConfig.database}\``
    );
    console.log(
      `Database "${typeOrmConfig.database}" created successfully (or already exists).`
    );
  } catch (error: any) {
    console.error("Error creating database:", error.message);
    throw error;
  } finally {
    await masterDataSource.destroy();
  }
}

export async function initializeDb() {
  // Destructure environment variables using capital letters
  const { HOST, PORT, USER, PASSWORD, DATABASE } = process.env;

  // Ensure required environment variables are set
  if (!HOST || !PORT || !USER || !PASSWORD || !DATABASE) {
    console.error("Missing one or more required environment variables");
    throw new Error("Missing one or more required environment variables");
  }

  console.log("Database Configuration:", {
    HOST,
    PORT,
    USER,
    PASSWORD,
    DATABASE,
  });

  // Build the TypeORM configuration object
  const typeOrmConfig = {
    type: "mysql" as const,
    host: HOST,
    port: Number(PORT),
    username: USER,
    password: PASSWORD,
    database: DATABASE,
    synchronize: true, // Auto-sync schema (use with caution in production)
    logging: true,
    entities: [Employee, Department],
  };

  try {
    // Create the database if it does not exist
    await createDatabaseIfNeeded(typeOrmConfig);
  } catch (err) {
    console.error("Error during database creation:", err);
    throw err;
  }

  try {
    // Initialize the primary TypeORM DataSource with the target database
    const dataSource = new DataSource(typeOrmConfig);
    await dataSource.initialize();
    console.log("TypeORM DataSource has been initialized");

    // Assign DataSource instance to the db object
    db.dataSource = dataSource;
  } catch (err) {
    console.error("Error initializing TypeORM DataSource:", err);
    throw err;
  }
}
