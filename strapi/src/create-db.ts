import { Client } from 'pg';
import chalk from 'chalk';

const DATABASE_USERNAME = process.env.DATABASE_USERNAME || 'strapi';
const DATABASE_PASSWORD = process.env.DATABASE_PASSWORD || 'strapi_pass';
const DATABASE_HOST = process.env.DATABASE_HOST || 'localhost';
const DATABASE_PORT = parseInt(process.env.DATABASE_PORT || '5432', 10);
const DATABASE_NAME = process.env.DATABASE_NAME || 'strapi_db';

async function ensureDatabaseExists(): Promise<void> {
  const checkClient = new Client({
    user: DATABASE_USERNAME,
    host: DATABASE_HOST,
    password: DATABASE_PASSWORD,
    port: DATABASE_PORT,
    database: 'postgres', // default DB for checking
  });
  try {
    console.log("Connecting to database");
    await checkClient.connect();

    console.log("Getting databases");
    const res = await checkClient.query(
      `SELECT 1 FROM pg_database WHERE datname = $1`,
      [DATABASE_NAME]
    );

    if (res.rowCount === 0) {
      console.log(chalk.yellow(`Database "${DATABASE_NAME}" not found. Creating...`));
      await checkClient.query(`CREATE DATABASE "${DATABASE_NAME}"`);
      console.log(chalk.green(`Database "${DATABASE_NAME}" created.`));
    } else {
      console.log(chalk.cyan(`Database "${DATABASE_NAME}" already exists.`));
    }

    await checkClient.end();
  } catch (err) {
    console.error(chalk.red('Failed to check/create database:'), err);
    process.exit(1);
  }
}

ensureDatabaseExists();