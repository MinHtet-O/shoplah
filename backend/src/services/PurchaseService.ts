import { Service } from "typedi";
import { Repository, FindOptionsWhere, Not, Or } from "typeorm";
import { Purchase } from "../entity/Purchase";
import { AppDataSource } from "../data-source";
import { NotFoundError, ForbiddenError } from "routing-controllers";

@Service()
export class PurchaseService {
  private purchaseRepository: Repository<Purchase>;

  constructor() {
    this.purchaseRepository = AppDataSource.getRepository(Purchase);
  }

  async getAll(
    userId: number,
    filters: Partial<Purchase> = {}
  ): Promise<Purchase[]> {
    const where: FindOptionsWhere<Purchase>[] = [
      { ...filters, buyer_id: userId },
      { ...filters, seller_id: userId },
    ];

    return this.purchaseRepository.find({ where });
  }

  async getOne(id: number, userId: number): Promise<Purchase> {
    const purchase = await this.purchaseRepository.findOne({ where: { id } });

    if (!purchase) {
      throw new NotFoundError("Purchase not found");
    }

    if (purchase.buyer_id !== userId && purchase.seller_id !== userId) {
      throw new ForbiddenError("you are not authorized to view this purchase");
    }

    return purchase;
  }
}
