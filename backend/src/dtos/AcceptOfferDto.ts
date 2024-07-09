import { IsNotEmpty, IsNumber } from "class-validator";

export class AcceptOfferDto {
  @IsNumber()
  @IsNotEmpty()
  item_id: number;

  @IsNumber()
  @IsNotEmpty()
  offer_id: number;
}
