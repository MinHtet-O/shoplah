import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from "typeorm";
import { Item } from "./Item";
import { Offer } from "./Offer";
import { Purchase } from "./Purchase";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", length: 255, unique: true })
  username: string;

  @Column({ type: "varchar", length: 255, unique: true })
  email: string;

  @Column({ type: "varchar", length: 255 })
  password_hash: string;

  @CreateDateColumn()
  created_at: Date;

  @OneToMany(() => Item, (item) => item.seller)
  items: Item[];

  @OneToMany(() => Offer, (offer) => offer.user)
  offers: Offer[];

  @OneToMany(() => Purchase, (purchase) => purchase.buyer)
  purchases: Purchase[];

  @OneToMany(() => Purchase, (purchase) => purchase.seller)
  sales: Purchase[];
}
