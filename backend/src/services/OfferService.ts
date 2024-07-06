import { Service } from "typedi";
import { AppDataSource } from "../data-source";
import { Offer } from "../entity/Offer";
import { Item } from "../entity/Item";
import { OfferStatus, ItemStatus } from "../entity/enums";
import { Not } from "typeorm";

@Service()
export class OfferService {
  private offerRepository = AppDataSource.getRepository(Offer);
  private itemRepository = AppDataSource.getRepository(Item);

  async findAll(): Promise<Offer[]> {
    return this.offerRepository.find();
  }

  async findOne(id: number): Promise<Offer | null> {
    return this.offerRepository.findOne({ where: { id } });
  }

  async create(offer: Offer): Promise<Offer> {
    return this.offerRepository.save(offer);
  }

  async acceptOffer(offerId: number): Promise<Offer> {
    return AppDataSource.transaction(async (transactionalEntityManager) => {
      const offer = await transactionalEntityManager.findOne(Offer, {
        where: { id: offerId },
        relations: ["item"],
      });
      if (!offer) {
        throw new Error("Offer not found");
      }
      if (offer.status !== OfferStatus.PENDING) {
        throw new Error("Offer is not in a pending state");
      }

      offer.status = OfferStatus.ACCEPTED;
      await transactionalEntityManager.save(offer);

      // Update item status
      offer.item.status = ItemStatus.SOLD;
      await transactionalEntityManager.save(offer.item);

      // Reject all other pending offers for this item
      await transactionalEntityManager.update(
        Offer,
        {
          item: { id: offer.item.id },
          status: OfferStatus.PENDING,
          id: Not(offerId),
        },
        { status: OfferStatus.REJECTED }
      );

      return offer;
    });
  }

  async rejectOffer(offerId: number): Promise<Offer> {
    const offer = await this.offerRepository.findOne({
      where: { id: offerId },
    });
    if (!offer) {
      throw new Error("Offer not found");
    }
    offer.status = OfferStatus.REJECTED;
    return this.offerRepository.save(offer);
  }
}
