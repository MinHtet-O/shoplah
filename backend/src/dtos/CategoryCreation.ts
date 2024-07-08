import { IsString, Length } from "class-validator";

export class CategoryCreationDto {
  @IsString()
  @Length(1, 255)
  name: string;
}
