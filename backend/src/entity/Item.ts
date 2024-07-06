import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { User } from "./User";
import { Offer } from "./Offer";
import { ItemStatus } from "./enums";

@Entity("items")
export class Item {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  seller_id: number;

  @ManyToOne(() => User, (user) => user.items)
  seller: User;

  @Column({ type: "varchar", length: 255 })
  title: string;

  @Column("text")
  description: string;

  @Column("integer")
  price: number;

  @Column({
    type: "enum",
    enum: ItemStatus,
    default: ItemStatus.AVAILABLE,
  })
  status: ItemStatus;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => Offer, (offer) => offer.item)
  offers: Offer[];
}
