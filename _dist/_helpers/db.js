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
exports.db = void 0;
exports.initializeDb = initializeDb;
require("reflect-metadata");
const dotenv_1 = __importDefault(require("dotenv"));
const typeorm_1 = require("typeorm");
const employee_entity_1 = require("../employees/employee.entity");
const department_entity_1 = require("../departments/department.entity");
// Load environment variables from .env file
dotenv_1.default.config();
exports.db = {
    dataSource: {},
};
/**
 * Creates the target database if it does not exist.
 * Uses a master connection to the default MySQL database.
 */
function createDatabaseIfNeeded(typeOrmConfig) {
    return __awaiter(this, void 0, void 0, function* () {
        if (typeOrmConfig.type !== "mysql") {
            throw new Error("Auto-creation is only supported for MySQL.");
        }
        // Create a master connection using the default 'mysql' database.
        const masterDataSource = new typeorm_1.DataSource(Object.assign(Object.assign({}, typeOrmConfig), { database: "mysql", entities: [] }));
        try {
            yield masterDataSource.initialize();
            console.log("Connected to master database.");
            yield masterDataSource.query(`CREATE DATABASE IF NOT EXISTS \`${typeOrmConfig.database}\``);
            console.log(`Database "${typeOrmConfig.database}" created successfully (or already exists).`);
        }
        catch (error) {
            console.error("Error creating database:", error.message);
            throw error;
        }
        finally {
            yield masterDataSource.destroy();
        }
    });
}
function initializeDb() {
    return __awaiter(this, void 0, void 0, function* () {
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
            type: "mysql",
            host: HOST,
            port: Number(PORT),
            username: USER,
            password: PASSWORD,
            database: DATABASE,
            synchronize: true, // Auto-sync schema (use with caution in production)
            logging: true,
            entities: [employee_entity_1.Employee, department_entity_1.Department],
        };
        try {
            // Create the database if it does not exist
            yield createDatabaseIfNeeded(typeOrmConfig);
        }
        catch (err) {
            console.error("Error during database creation:", err);
            throw err;
        }
        try {
            // Initialize the primary TypeORM DataSource with the target database
            const dataSource = new typeorm_1.DataSource(typeOrmConfig);
            yield dataSource.initialize();
            console.log("TypeORM DataSource has been initialized");
            // Assign DataSource instance to the db object
            exports.db.dataSource = dataSource;
        }
        catch (err) {
            console.error("Error initializing TypeORM DataSource:", err);
            throw err;
        }
    });
}
