import { Service } from "typedi";
import { FindManyOptions, FindOptionsWhere, Not, Repository } from "typeorm";
import { Item } from "../entity/Item";
import { Offer } from "../entity/Offer";
import { Category } from "../entity/Category";
import { ItemStatus, OfferStatus, PurchaseType } from "../entity/enums";
import {
  NotFoundError,
  BadRequestError,
  ForbiddenError,
} from "routing-controllers";
import { AppDataSource } from "../data-source";
import { excludeFields } from "../utils/queryUtils";
import { User } from "../entity/User";
import { ItemCreationDto } from "../dtos/ItemCreationDto";
import { Purchase } from "../entity/Purchase";

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
    // Define the where object with a more flexible type
    const where: { [key: string]: any } = {};

    // Process filters to handle _ne (not equal) and other operators
    for (const [key, value] of Object.entries(filters)) {
      const [field, operator] = key.split("-");
      if (operator === "ne") {
        where[field] = Not(value);
      } else {
        where[key] = value;
      }
    }

    return this.itemRepository.find({ where: where as any });
  }

  async getOne(id: number): Promise<Partial<Item>> {
    const itemMetadata = this.itemRepository.metadata;
    const userMetadata = this.userRepository.metadata;
    const categoryMetadata = this.categoryRepository.metadata;

    const item = await this.itemRepository.findOne({
      where: { id },
      relations: ["category", "seller", "offers"],
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

  async create(data: ItemCreationDto, userId: number): Promise<Item> {
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

  async acceptOffer(
    itemId: number,
    offerId: number,
    userId: number
  ): Promise<Item> {
    return AppDataSource.transaction(async (transactionalEntityManager) => {
      const item = await transactionalEntityManager.findOne(Item, {
        where: { id: itemId },
        relations: ["offers"],
      });

      if (!item) {
        throw new NotFoundError("Item not found");
      }

      if (item.seller_id !== userId) {
        throw new ForbiddenError(
          "Only the seller can accept offers for this item"
        );
      }

      if (item.status !== ItemStatus.AVAILABLE) {
        throw new BadRequestError("Item is not available for sale");
      }

      const acceptedOffer = item.offers.find((offer) => offer.id === offerId);

      if (!acceptedOffer) {
        throw new NotFoundError("Offer not found for this item");
      }

      if (acceptedOffer.status !== OfferStatus.PENDING) {
        throw new BadRequestError("This offer is no longer pending");
      }

      const purchase = new Purchase();
      purchase.item_id = itemId;
      purchase.buyer_id = acceptedOffer.user_id;
      purchase.seller_id = item.seller_id;
      purchase.price = acceptedOffer.price;
      purchase.type = PurchaseType.OFFER_ACCEPTED;
      purchase.purchased_at = new Date();
      await transactionalEntityManager.save(purchase);

      item.status = ItemStatus.SOLD;
      item.purchase = purchase;
      await transactionalEntityManager.save(item);

      acceptedOffer.status = OfferStatus.ACCEPTED;
      await transactionalEntityManager.save(acceptedOffer);

      // Reject all other offers
      await transactionalEntityManager.update(
        Offer,
        { item: { id: itemId }, status: OfferStatus.PENDING, id: Not(offerId) },
        { status: OfferStatus.REJECTED }
      );

      return item;
    });
  }

  async buyItem(itemId: number, buyerId: number): Promise<Item> {
    return AppDataSource.transaction(async (transactionalEntityManager) => {
      const item = await transactionalEntityManager.findOne(Item, {
        where: { id: itemId },
        relations: ["purchase"],
      });

      if (!item) {
        throw new NotFoundError("item not found");
      }
      if (item.status !== ItemStatus.AVAILABLE || item.purchase) {
        throw new ForbiddenError("item is not available for purchase");
      }
      if (item.seller_id === buyerId) {
        throw new ForbiddenError("you cannot buy your item");
      }

      const purchase = new Purchase();
      purchase.item_id = itemId;
      purchase.buyer_id = buyerId;
      purchase.seller_id = item.seller_id;
      purchase.price = item.price;
      purchase.type = PurchaseType.DIRECT_PURCHASE;
      purchase.purchased_at = new Date();
      await transactionalEntityManager.save(purchase);

      item.status = ItemStatus.SOLD;
      item.purchase = purchase;
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
