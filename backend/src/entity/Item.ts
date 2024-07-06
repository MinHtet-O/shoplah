import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from "typeorm";
import { User } from "./User";
import { Category } from "./Category";
import { Offer } from "./Offer";
import { ItemStatus } from "./enums";

@Entity("items")
export class Item {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  seller_id: number;

  @ManyToOne(() => User, (user) => user.items)
  @JoinColumn({ name: "seller_id" })
  seller: User;

  @Column()
  category_id: number;

  @ManyToOne(() => Category, (category) => category.items)
  @JoinColumn({ name: "category_id" })
  category: Category;

  @Column({ type: "varchar", length: 255 })
  title: string;

  @Column("text")
  description: string;

  @Column("int")
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
