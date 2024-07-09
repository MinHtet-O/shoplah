import { IsNumber } from "class-validator";

export class BuyItemDto {
  @IsNumber()
  item_id: number;
}
