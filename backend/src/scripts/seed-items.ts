import { AppDataSource } from "../data-source";
import { Item } from "../entity/Item";
import { User } from "../entity/User";
import { Category } from "../entity/Category";
import { ItemStatus, ItemCondition } from "../entity/enums";
import { faker } from "@faker-js/faker";

export async function seedItems() {
  const itemRepository = AppDataSource.getRepository(Item);
  const userRepository = AppDataSource.getRepository(User);
  const categoryRepository = AppDataSource.getRepository(Category);

  const itemCount = await itemRepository.count();

  if (itemCount === 0) {
    const users = await userRepository.find();
    const categories = await categoryRepository.find();

    if (users.length === 0 || categories.length === 0) {
      console.error(
        "Users or categories not found. Please seed users and categories first."
      );
      return;
    }

    const numberOfItems = 40; // Specify the number of items you want to generate
    const items = [];

    for (let i = 0; i < numberOfItems; i++) {
      const randomUser = faker.helpers.arrayElement(users);
      const randomCategory = faker.helpers.arrayElement(categories);
      const randomCondition = faker.helpers.arrayElement(
        Object.values(ItemCondition)
      );

      items.push({
        seller_id: randomUser.id,
        category_id: randomCategory.id,
        title: faker.commerce.productName(),
        description: faker.lorem.sentence(),
        price: faker.number.int({ min: 5, max: 100 }),
        status: ItemStatus.AVAILABLE,
        condition: randomCondition,
        brand: faker.company.name(),
        image: "",
      } as Item);
    }

    await itemRepository.save(items);

    console.log(`Database seeded with ${numberOfItems} items.`);
  } else {
    console.log("Database already has items, skipping seed.");
  }
}
