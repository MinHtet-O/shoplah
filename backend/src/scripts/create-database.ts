import { Client } from "pg";
import { AppDataSource } from "../data-source";
import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";

export async function createDatabaseIfNotExists() {
  const options = AppDataSource.options as PostgresConnectionOptions;
  const client = new Client({
    host: options.host as string,
    port: options.port as number,
    user: options.username as string,
    password: options.password as string,
    database: "postgres", // Connect to default postgres database
  });

  try {
    await client.connect();
    const result = await client.query(
      `SELECT EXISTS(SELECT datname FROM pg_catalog.pg_database WHERE datname = '${options.database}')`
    );

    if (!result.rows[0].exists) {
      await client.query(`CREATE DATABASE ${options.database}`);
      console.log(`Database ${options.database} created.`);
    } else {
      console.log(`Database ${options.database} already exists.`);
    }
  } catch (error) {
    console.error("Error creating database:", error);
    throw error;
  } finally {
    await client.end();
  }
}
