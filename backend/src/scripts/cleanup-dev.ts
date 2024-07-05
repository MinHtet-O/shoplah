import { AppDataSource } from "../data-source";

async function cleanupDevEnvironment() {
  try {
    await AppDataSource.initialize();

    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();

    // Get all table names in the current schema
    const tables = await queryRunner.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_type = 'BASE TABLE'
        `);

    // Drop each table
    for (const { table_name } of tables) {
      await queryRunner.query(`DROP TABLE IF EXISTS "${table_name}" CASCADE`);
      console.log(`Dropped table: ${table_name}`);
    }

    console.log("All tables have been dropped successfully.");
  } catch (error) {
    console.error("Error during cleanup:", error);
  } finally {
    await AppDataSource.destroy();
  }
}

cleanupDevEnvironment();
