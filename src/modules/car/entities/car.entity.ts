import {
  Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn
} from 'typeorm';

import { Picture } from './picture.entity';

@Entity()
export class Car {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  brand: string;

  @Column()
  model: string;

  @OneToMany(() => Picture, (picture) => picture.car)
  pictures: Picture[];

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
