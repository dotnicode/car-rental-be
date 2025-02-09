import { Picture } from 'src/modules/picture/entities/picture.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Car {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  brand: string;

  @Column()
  model: string;

  @OneToMany(() => Picture, (picture) => picture.car, { nullable: true })
  pictures?: Picture[];

  @Column()
  color: string;

  @Column()
  passengers: number;

  @Column()
  ac: boolean;

  @Column()
  pricePerDay: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
