import { User } from "../entity/User";
import { Item } from "../entity/Item";
import { Offer } from "../entity/Offer";
import { OfferStatus } from "../entity/enums";
import { faker } from "@faker-js/faker";
import { AppDataSource } from "../data-source";

export const seedOffers = async () => {
  const userRepository = AppDataSource.getRepository(User);
  const itemRepository = AppDataSource.getRepository(Item);
  const offerRepository = AppDataSource.getRepository(Offer);

  // Fetch all users and items
  const users = await userRepository.find();
  const items = await itemRepository.find();

  if (users.length === 0 || items.length === 0) {
    throw new Error("Required entities not found for seeding offers");
  }

  const offers = [];

  for (const item of items) {
    const numOffers = faker.number.int({ min: 1, max: 10 }); // Generate between 1 to 10 offers per item

    // Filter users to exclude the seller
    const potentialBuyers = users.filter((user) => user.id !== item.seller_id);

    for (let i = 0; i < numOffers; i++) {
      const user = faker.helpers.arrayElement(potentialBuyers);
      const price = faker.number.int({ min: 1, max: item.price - 1 });

      offers.push({
        item: item,
        item_id: item.id, // Ensure item_id is set
        user: user,
        user_id: user.id, // Ensure user_id is set
        price: price,
        status: OfferStatus.PENDING,
      });
    }
  }

  // Save offers to the database
  await offerRepository.save(offers);
};
