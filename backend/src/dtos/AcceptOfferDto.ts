import { IsNotEmpty, IsNumber } from "class-validator";

export class AcceptOfferDto {
  @IsNumber()
  @IsNotEmpty()
  offer_id: number;
}
