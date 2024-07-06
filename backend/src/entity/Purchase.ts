import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
} from "typeorm";
import { User } from "./User";
import { Item } from "./Item";
import { PurchaseType } from "./enums";

@Entity("purchases")
export class Purchase {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  item_id: number;

  @OneToOne(() => Item, (item) => item.purchase)
  @JoinColumn({ name: "item_id" })
  item: Item;

  @Column()
  buyer_id: number;

  @ManyToOne(() => User, (user) => user.purchases)
  @JoinColumn({ name: "buyer_id" })
  buyer: User;

  @Column()
  seller_id: number;

  @ManyToOne(() => User, (user) => user.sales)
  @JoinColumn({ name: "seller_id" })
  seller: User;

  @Column("int")
  price: number;

  @Column({
    type: "enum",
    enum: PurchaseType,
    default: PurchaseType.DIRECT_PURCHASE,
  })
  type: PurchaseType;

  @CreateDateColumn()
  created_at: Date;

  @Column({ type: "timestamp" })
  purchased_at: Date;
}
