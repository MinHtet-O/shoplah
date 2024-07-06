import { IsNotEmpty, IsNumber } from "class-validator";

export class AcceptOfferDto {
  @IsNumber()
  @IsNotEmpty()
  itemId: number;

  @IsNumber()
  @IsNotEmpty()
  offerId: number;
}
