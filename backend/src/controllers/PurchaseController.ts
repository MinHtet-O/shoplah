import {
  JsonController,
  Get,
  Param,
  QueryParams,
  CurrentUser,
  Authorized,
} from "routing-controllers";
import { Service } from "typedi";
import { PurchaseService } from "../services/PurchaseService";
import { User } from "../entity/User";

@JsonController("/purchases")
@Service()
export class PurchaseController {
  constructor(private purchaseService: PurchaseService) {}

  @Authorized()
  @Get()
  getAll(@QueryParams() filters: any, @CurrentUser() user: User) {
    return this.purchaseService.getAll(user.id, filters);
  }

  @Authorized()
  @Get("/:id")
  getOne(@Param("id") id: number, @CurrentUser() user: User) {
    return this.purchaseService.getOne(id, user.id);
  }
}
