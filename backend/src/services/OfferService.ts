import { Service } from "typedi";
import { Repository } from "typeorm";
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

  async getAll(): Promise<Offer[]> {
    return this.offerRepository.find();
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
      throw new BadRequestError("Invalid item");
    }

    if (item.status !== ItemStatus.AVAILABLE) {
      throw new BadRequestError("Oops! Seems, the item is already sold");
    }

    if (item.seller_id === userId) {
      throw new BadRequestError("You cannot send an offer for your own item");
    }

    if (data.price > item.price) {
      throw new BadRequestError(
        "Offer price cannot be higher than the original item price"
      );
    }

    const existingOffer = await this.offerRepository.findOne({
      where: {
        item_id: data.item_id,
        user_id: userId,
        price: data.price,
      },
    });
    if (existingOffer) {
      throw new BadRequestError(
        "You have already made an offer with the same price for this item"
      );
    }

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
