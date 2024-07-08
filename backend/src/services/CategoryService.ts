import { Service } from "typedi";
import { Repository } from "typeorm";
import { Category } from "../entity/Category";
import { AppDataSource } from "../data-source";
import {
  NotFoundError,
  BadRequestError,
  ForbiddenError,
} from "routing-controllers";
import { CategoryCreationDto } from "../dtos/CategoryCreation";
import { User } from "../entity/User";

@Service()
export class CategoryService {
  private categoryRepository: Repository<Category>;
  private userRepository: Repository<User>;

  constructor() {
    this.categoryRepository = AppDataSource.getRepository(Category);
    this.userRepository = AppDataSource.getRepository(User);
  }

  async getAll(filters: Partial<Category> = {}): Promise<Category[]> {
    return this.categoryRepository.find({
      where: filters,
    });
  }

  async getOne(id: number): Promise<Category> {
    const category = await this.categoryRepository.findOne({ where: { id } });
    if (!category) {
      throw new NotFoundError("Category not found");
    }
    return category;
  }

  async create(data: CategoryCreationDto, userId: number): Promise<Category> {
    const existingCategory = await this.categoryRepository.findOne({
      where: { name: data.name },
    });
    if (existingCategory) {
      throw new BadRequestError("Category with this name already exists");
    }

    const newCategory = this.categoryRepository.create({
      ...data,
    });
    return this.categoryRepository.save(newCategory);
  }

  async update(
    id: number,
    data: Partial<Category>,
    userId: number
  ): Promise<Category> {
    const category = await this.getOne(id);

    Object.assign(category, data);
    return this.categoryRepository.save(category);
  }

  async delete(id: number, userId: number): Promise<boolean> {
    const category = await this.categoryRepository.findOne({ where: { id } });
    if (!category) {
      throw new NotFoundError("Category not found");
    }

    const result = await this.categoryRepository.delete(id);
    return (
      result.affected !== undefined &&
      result.affected !== null &&
      result.affected > 0
    );
  }
}
