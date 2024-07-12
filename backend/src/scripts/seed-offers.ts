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

    // Track users who have already made an offer for this item
    const usersWithOffers = new Set<number>();

    for (let i = 0; i < numOffers; i++) {
      const user = faker.helpers.arrayElement(potentialBuyers);

      // Skip if this user has already made an offer for this item
      if (usersWithOffers.has(user.id)) continue;

      const price = faker.number.int({ min: 1, max: item.price - 1 });

      // Check if an existing offer by the same user for the same item exists
      const existingOffer = await offerRepository.findOne({
        where: {
          item: { id: item.id },
          user: { id: user.id },
        },
      });

      if (existingOffer) {
        // Cancel the existing offer
        existingOffer.status = OfferStatus.CANCELLED;
        await offerRepository.save(existingOffer);
      }

      // Create the new offer
      const newOffer = offerRepository.create({
        item: item,
        user: user,
        price: price,
        status: OfferStatus.PENDING,
      });
      offers.push(newOffer);

      // Mark this user as having made an offer for this item
      usersWithOffers.add(user.id);
    }
  }

  // Save new offers to the database
  await offerRepository.save(offers);
};
