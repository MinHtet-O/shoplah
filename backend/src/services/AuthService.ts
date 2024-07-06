import { Service } from "typedi";
import { Repository } from "typeorm";
import { User } from "../entity/User";
import { AppDataSource } from "../data-source";
import {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} from "routing-controllers";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import { UserRegistrationDto } from "../dtos/UserRegistrationDto";
import { UserLoginDto } from "../dtos/UserLoginDto";

@Service()
export class AuthService {
  private userRepository: Repository<User>;

  constructor() {
    this.userRepository = AppDataSource.getRepository(User);
  }

  async register(userData: UserRegistrationDto): Promise<User> {
    const existingUser = await this.userRepository.findOne({
      where: [{ username: userData.username }, { email: userData.email }],
    });

    if (existingUser) {
      throw new BadRequestError("Username or email already exists");
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const newUser = this.userRepository.create({
      username: userData.username,
      email: userData.email,
      password_hash: hashedPassword,
    });

    return this.userRepository.save(newUser);
  }

  async login(
    loginData: UserLoginDto
  ): Promise<{ user: Partial<User>; token: string }> {
    const user = await this.userRepository.findOne({
      where: { email: loginData.email },
    });

    if (!user) {
      throw new NotFoundError("User not found");
    }

    const isPasswordValid = await bcrypt.compare(
      loginData.password,
      user.password_hash
    );

    if (!isPasswordValid) {
      throw new UnauthorizedError("Invalid password");
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "1h" }
    );

    const { password_hash, ...userWithoutPassword } = user;

    return { user: userWithoutPassword, token };
  }
}
