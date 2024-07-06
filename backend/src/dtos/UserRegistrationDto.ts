import {
  IsString,
  IsEmail,
  MinLength,
  MaxLength,
  IsNotEmpty,
} from "class-validator";

export class UserRegistrationDto {
  @MinLength(3, { message: "Username must be at least 3 characters long" })
  @MaxLength(20, { message: "Username must not exceed 20 characters" })
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsEmail({}, { message: "Invalid email format" })
  @IsNotEmpty()
  email: string;

  @MinLength(8, { message: "Password must be at least 8 characters long" })
  @MaxLength(20, { message: "Password must not exceed 20 characters" })
  @IsString()
  @IsNotEmpty()
  password: string;
}
