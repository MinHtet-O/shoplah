import { AppDataSource } from "../data-source";
import { createDatabaseIfNotExists } from "./create-database";
import { seedUsers } from "./seed-users";
import { seedItems } from "./seed-items";
import { seedCategories } from "./seed-categories";
import { seedOffers } from "./seed-offers";

async function devSetup() {
  try {
    await createDatabaseIfNotExists();
    await AppDataSource.initialize();
    await seedUsers();
    await seedCategories();
    await seedItems();
    await seedOffers();
    console.log("Development setup completed successfully.");
  } catch (error) {
    console.error("Error during development setup:", error);
  } finally {
    await AppDataSource.destroy(); // Close the connection
  }
}

devSetup();
