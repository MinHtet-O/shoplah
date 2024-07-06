import { IsInt, IsPositive } from "class-validator";

export class OfferCreationDto {
  @IsInt()
  item_id: number;

  @IsInt()
  @IsPositive({ message: "Price must be a positive integer" })
  price: number;
}
