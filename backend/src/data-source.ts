import { DataSource } from "typeorm";
import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";
import { Item } from "./entity/Item";
import { User } from "./entity/User";
import { Offer } from "./entity/Offer";
import { Category } from "./entity/Category";
import { Purchase } from "./entity/Purchase";

const commonConfig: PostgresConnectionOptions = {
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5432"),
  username: process.env.DB_USERNAME || "postgres",
  password: process.env.DB_PASSWORD || "postgres",
  database: process.env.DB_NAME || "shoplah",
  entities: [Item, User, Offer, Category, Purchase],
};

const developmentConfig: PostgresConnectionOptions = {
  ...commonConfig,
  synchronize: true,
  logging: true,
};

const productionConfig: PostgresConnectionOptions = {
  ...commonConfig,
  synchronize: false,
  logging: false,
};

const config =
  process.env.NODE_ENV === "production" ? productionConfig : developmentConfig;

export const AppDataSource = new DataSource(config);
