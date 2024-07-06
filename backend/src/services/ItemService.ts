import { Service } from "typedi";
import { Repository } from "typeorm";
import { Item } from "../entity/Item";
import { Offer } from "../entity/Offer";
import { Category } from "../entity/Category";
import { ItemStatus, OfferStatus } from "../entity/enums";
import {
  NotFoundError,
  BadRequestError,
  ForbiddenError,
} from "routing-controllers";
import { AppDataSource } from "../data-source";
import { excludeFields } from "../utils/queryUtils";
import { User } from "../entity/User";

@Service()
export class ItemService {
  private itemRepository: Repository<Item>;
  private offerRepository: Repository<Offer>;
  private categoryRepository: Repository<Category>;
  private userRepository: Repository<User>;

  constructor() {
    this.itemRepository = AppDataSource.getRepository(Item);
    this.offerRepository = AppDataSource.getRepository(Offer);
    this.categoryRepository = AppDataSource.getRepository(Category);
    this.userRepository = AppDataSource.getRepository(User);
  }

  async getAll(filters: Partial<Item> = {}): Promise<Item[]> {
    return this.itemRepository.find({
      where: filters,
    });
  }

  async getOne(id: number): Promise<Partial<Item>> {
    const itemMetadata = this.itemRepository.metadata;
    const userMetadata = this.userRepository.metadata;
    const categoryMetadata = this.categoryRepository.metadata;

    const item = await this.itemRepository.findOne({
      where: { id },
      relations: ["category", "seller"],
      select: {
        ...excludeFields(itemMetadata, []),
        category: excludeFields(categoryMetadata, []),
        seller: excludeFields(userMetadata, ["password_hash", "created_at"]),
      },
    });

    if (!item) {
      throw new NotFoundError("Item not found");
    }

    return item;
  }

  async create(data: Partial<Item>, userId: number): Promise<Item> {
    const existingItem = await this.itemRepository.findOne({
      where: { title: data.title, seller_id: userId },
    });
    if (existingItem) {
      throw new BadRequestError(
        "An item with this title already exists for this seller"
      );
    }

    const category = await this.categoryRepository.findOne({
      where: { id: data.category_id },
    });
    if (!category) {
      throw new BadRequestError("Invalid category");
    }

    const newItem = this.itemRepository.create({
      ...data,
      seller_id: userId,
      status: ItemStatus.AVAILABLE,
      category: category,
    });
    return this.itemRepository.save(newItem);
  }

  async update(id: number, data: Partial<Item>, userId: number): Promise<Item> {
    const item = await this.getOne(id);
    if (item.seller_id !== userId) {
      throw new ForbiddenError("Only the owner can edit this item");
    }
    if (item.status !== ItemStatus.AVAILABLE) {
      throw new ForbiddenError("This item can no longer be edited");
    }

    if (data.category_id) {
      const category = await this.categoryRepository.findOne({
        where: { id: data.category_id },
      });
      if (!category) {
        throw new BadRequestError("Invalid category");
      }
      item.category = category;
    }

    Object.assign(item, data);
    return this.itemRepository.save(item);
  }

  async delete(id: number, userId: number): Promise<boolean> {
    const item = await this.itemRepository.findOne({ where: { id } });
    if (!item) {
      throw new NotFoundError("Item not found");
    }
    if (item.seller_id !== userId) {
      throw new ForbiddenError("Only the owner can delete this item");
    }
    if (item.status !== ItemStatus.AVAILABLE) {
      throw new ForbiddenError("This item can no longer be deleted");
    }

    const result = await this.itemRepository.delete(id);
    return (
      result.affected !== undefined &&
      result.affected !== null &&
      result.affected > 0
    );
  }

  async buyItem(itemId: number, buyerId: number): Promise<Item> {
    return AppDataSource.transaction(async (transactionalEntityManager) => {
      const item = await transactionalEntityManager.findOne(Item, {
        where: { id: itemId },
      });
      if (!item) {
        throw new NotFoundError("Item not found");
      }
      if (item.status !== ItemStatus.AVAILABLE) {
        throw new ForbiddenError("Item is not available for purchase");
      }
      if (item.seller_id === buyerId) {
        throw new ForbiddenError("You cannot buy your own item");
      }

      item.status = ItemStatus.SOLD;
      await transactionalEntityManager.save(item);

      await transactionalEntityManager.update(
        Offer,
        { item: { id: itemId }, status: OfferStatus.PENDING },
        { status: OfferStatus.REJECTED }
      );

      return item;
    });
  }
}
