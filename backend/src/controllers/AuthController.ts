import { JsonController, Post, Body } from "routing-controllers";
import { Service } from "typedi";
import { AuthService } from "../services/AuthService";
import { UserRegistrationDto } from "../dtos/UserRegistrationDto";
import { UserLoginDto } from "../dtos/UserLoginDto";

@JsonController("/auth")
@Service()
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post("/register")
  async register(@Body() userData: UserRegistrationDto) {
    const user = await this.authService.register(userData);
    return { message: "User registered successfully", userId: user.id };
  }

  @Post("/login")
  async login(@Body() loginData: UserLoginDto) {
    return this.authService.login(loginData);
  }
}
