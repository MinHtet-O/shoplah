import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from "typeorm";
import { User } from "./User";
import { Item } from "./Item";
import { OfferStatus } from "./enums";

@Entity("offers")
export class Offer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  item_id: number;

  @ManyToOne(() => Item, (item) => item.offers)
  item: Item;

  @Column()
  user_id: number;

  @ManyToOne(() => User, (user) => user.offers)
  user: User;

  @Column("integer")
  price: number;

  @Column({
    type: "enum",
    enum: OfferStatus,
    default: OfferStatus.PENDING,
  })
  status: OfferStatus;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
