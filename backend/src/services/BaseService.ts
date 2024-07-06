import {
  Repository,
  FindManyOptions,
  EntityTarget,
  ObjectLiteral,
  DeepPartial,
  FindOptionsOrder,
} from "typeorm";
import { AppDataSource } from "../data-source";

export interface IPagination {
  offset?: number;
  limit?: number;
}

export interface IDataSort<T> {
  key: keyof T;
  order: "ASC" | "DESC";
}

export class BaseService<T extends ObjectLiteral> {
  protected repository: Repository<T>;

  constructor(entityTarget: EntityTarget<T>) {
    this.repository = AppDataSource.getRepository<T>(entityTarget);
  }

  async getFiltered(
    condition: Partial<T>,
    options?: {
      pagination?: IPagination;
      order?: IDataSort<T>;
      relations?: string[];
    }
  ): Promise<T[]> {
    const findOptions: FindManyOptions<T> = {
      where: condition,
      skip: options?.pagination?.offset,
      take: options?.pagination?.limit,
      order: options?.order
        ? ({ [options.order.key]: options.order.order } as FindOptionsOrder<T>)
        : undefined,
      relations: options?.relations,
    };

    return this.repository.find(findOptions);
  }

  async create(data: DeepPartial<T>): Promise<T> {
    const entity = this.repository.create(data); // Type assertion to T
    return this.repository.save(entity);
  }

  async update(id: number, data: Partial<T>): Promise<T | null> {
    await this.repository.update(id, data);
    return this.repository.findOne({ where: { id } as any });
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.repository.delete(id);
    return (
      result.affected !== undefined &&
      result.affected != null &&
      result.affected > 0
    );
  }
}
