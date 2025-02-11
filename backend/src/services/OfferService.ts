import { Service } from "typedi";
import { FindManyOptions, FindOptionsWhere, Not, Repository } from "typeorm";
import { Offer } from "../entity/Offer";
import { Item } from "../entity/Item";
import { OfferStatus, ItemStatus } from "../entity/enums";
import {
  NotFoundError,
  BadRequestError,
  ForbiddenError,
} from "routing-controllers";
import { AppDataSource } from "../data-source";
import { OfferCreationDto } from "../dtos/OfferCreationDto"; // Import the DTO

@Service()
export class OfferService {
  private offerRepository: Repository<Offer>;
  private itemRepository: Repository<Item>;

  constructor() {
    this.offerRepository = AppDataSource.getRepository(Offer);
    this.itemRepository = AppDataSource.getRepository(Item);
  }

  async getAll(filters: Partial<Offer> = {}): Promise<Offer[]> {
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

    return this.offerRepository.find({
      relations: ["user"],
      where: where as any,
    });
  }

  async getOne(id: number): Promise<Offer> {
    const offer = await this.offerRepository.findOne({ where: { id } });
    if (!offer) {
      throw new NotFoundError("Offer not found");
    }
    return offer;
  }

  async create(data: OfferCreationDto, userId: number): Promise<Offer> {
    const item = await this.itemRepository.findOne({
      where: { id: data.item_id },
    });
    if (!item) {
      throw new BadRequestError("invalid item");
    }

    if (item.status !== ItemStatus.AVAILABLE) {
      throw new BadRequestError("seems, the item is already sold");
    }

    if (item.seller_id === userId) {
      throw new BadRequestError("you cannot make offer for your item");
    }

    if (data.price >= item.price) {
      throw new BadRequestError("offer price must lower than original price");
    }

    const existingOffer = await this.offerRepository.findOne({
      where: {
        item_id: data.item_id,
        user_id: userId,
        price: data.price,
        status: OfferStatus.PENDING,
      },
    });
    if (existingOffer) {
      throw new BadRequestError("you already offered the same price");
    }

    // Cancel all existing offers for this item by the same user
    await this.offerRepository.update(
      { item_id: data.item_id, user_id: userId, status: OfferStatus.PENDING },
      { status: OfferStatus.CANCELLED }
    );

    const newOffer = this.offerRepository.create({
      ...data,
      user_id: userId,
      status: OfferStatus.PENDING,
      item: item,
    });

    return this.offerRepository.save(newOffer);
  }

  async update(
    id: number,
    data: Partial<Offer>,
    userId: number
  ): Promise<Offer> {
    const offer = await this.getOne(id);
    if (offer.user_id !== userId) {
      throw new ForbiddenError("Only the owner can edit this offer");
    }

    Object.assign(offer, data);
    return this.offerRepository.save(offer);
  }

  async delete(id: number, userId: number): Promise<boolean> {
    const offer = await this.getOne(id);
    if (offer.user_id !== userId) {
      throw new ForbiddenError("Only the owner can delete this offer");
    }

    const result = await this.offerRepository.delete(id);
    return (
      result.affected !== undefined &&
      result.affected !== null &&
      result.affected > 0
    );
  }
}
