import {
  IsString,
  IsInt,
  MinLength,
  MaxLength,
  IsPositive,
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
  description: string;

  @IsInt()
  @IsPositive({ message: "Price must be a positive integer" })
  price: number;
}
