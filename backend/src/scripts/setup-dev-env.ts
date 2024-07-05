import { Client } from "pg";
import { AppDataSource } from "../data-source";
import { Item } from "../entity/Item";
import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";

async function createDatabaseIfNotExists() {
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

async function seedDatabase() {
  const itemRepository = AppDataSource.getRepository(Item);

  const itemCount = await itemRepository.count();

  if (itemCount === 0) {
    const items = [{ name: "Item 1" }, { name: "Item 2" }, { name: "Item 3" }];

    for (const item of items) {
      await itemRepository.save(item);
    }

    console.log("Database seeded with initial items.");
  } else {
    console.log("Database already has items, skipping seed.");
  }
}

async function devSetup() {
  try {
    await createDatabaseIfNotExists();
    await AppDataSource.initialize();
    await seedDatabase();
    console.log("Development setup completed successfully.");
  } catch (error) {
    console.error("Error during development setup:", error);
  } finally {
    await AppDataSource.destroy(); // Close the connection
  }
}

devSetup();
