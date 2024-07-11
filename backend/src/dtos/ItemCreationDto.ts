import {
  IsString,
  IsInt,
  MinLength,
  MaxLength,
  IsPositive,
  IsNotEmpty,
} from "class-validator";

export class ItemCreationDto {
  @IsInt()
  category_id: number;

  @IsString()
  @MinLength(3, { message: "Title must be at least 3 characters long" })
  @MaxLength(255, { message: "Title must not exceed 255 characters" })
  title: string;

  @IsString()
  @MinLength(10, { message: "Description must be at least 10 characters long" })
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  condition: string;

  @IsString()
  @IsNotEmpty()
  brand: string;

  @IsInt()
  @IsPositive({ message: "Price must be a positive integer" })
  price: number;
}
