import { Service } from "typedi";
import { AppDataSource } from "../data-source";
import { Item } from "../entity/Item";
import { Offer } from "../entity/Offer";
import { ItemStatus, OfferStatus } from "../entity/enums";
import { DeleteResult } from "typeorm";

@Service()
export class ItemService {
  private itemRepository = AppDataSource.getRepository(Item);
  private offerRepository = AppDataSource.getRepository(Offer);

  async findAll(): Promise<Item[]> {
    return this.itemRepository.find();
  }

  async findOne(id: number): Promise<Item | null> {
    return this.itemRepository.findOne({ where: { id } });
  }

  async create(item: Item): Promise<Item> {
    return this.itemRepository.save(item);
  }

  async update(id: number, itemData: Partial<Item>): Promise<Item | null> {
    await this.itemRepository.update(id, itemData);
    return this.itemRepository.findOne({ where: { id } });
  }

  async delete(id: number): Promise<boolean> {
    const result: DeleteResult = await this.itemRepository.delete(id);
    return (
      result.affected !== null &&
      result.affected !== undefined &&
      result.affected > 0
    );
  }

  async buyItem(itemId: number, buyerId: number): Promise<Item> {
    return AppDataSource.transaction(async (transactionalEntityManager) => {
      const item = await transactionalEntityManager.findOne(Item, {
        where: { id: itemId },
      });
      if (!item) {
        throw new Error("Item not found");
      }
      if (item.status !== ItemStatus.AVAILABLE) {
        throw new Error("Item is not available for purchase");
      }

      item.status = ItemStatus.SOLD;
      await transactionalEntityManager.save(item);

      // Reject all pending offers
      await transactionalEntityManager.update(
        Offer,
        { item: { id: itemId }, status: OfferStatus.PENDING },
        { status: OfferStatus.REJECTED }
      );

      return item;
    });
  }
}
