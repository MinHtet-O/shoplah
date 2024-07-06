import { AppDataSource } from "../data-source";
import { Category } from "../entity/Category";

export async function seedCategories() {
  const categoryRepository = AppDataSource.getRepository(Category);

  const categoryCount = await categoryRepository.count();

  if (categoryCount === 0) {
    const categories = [
      { name: "Electronics" },
      { name: "Books" },
      { name: "Clothing" },
    ];

    await categoryRepository.save(categories);

    console.log("Database seeded with initial categories.");
  } else {
    console.log("Database already has categories, skipping seed.");
  }
}
