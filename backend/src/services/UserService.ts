import { Service } from "typedi";
import { Repository } from "typeorm";
import { User } from "../entity/User";
import { AppDataSource } from "../data-source";
import { NotFoundError, BadRequestError } from "routing-controllers";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import { excludeFields } from "../utils/queryUtils";
import { UserRegistrationDto } from "../dtos/UserRegistrationDto";
import { UserLoginDto } from "../dtos/UserLoginDto";

@Service()
export class UserService {
  private userRepository: Repository<User>;

  constructor() {
    this.userRepository = AppDataSource.getRepository(User);
  }

  async getOne(id: number): Promise<Partial<User>> {
    const userMetadata = this.userRepository.metadata;
    const user = await this.userRepository.findOne({
      where: { id },
      select: excludeFields(userMetadata, ["password_hash", "created_at"]),
    });

    if (!user) {
      throw new NotFoundError("User not found");
    }

    return user;
  }
}
