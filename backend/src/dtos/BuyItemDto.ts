import { IsNumber } from "class-validator";

export class BuyItemDto {
  @IsNumber()
  itemId: number;
}
