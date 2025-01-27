import {
  Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn
} from 'typeorm';

import { CarPicture } from '../enums/car-picture.enum';
import { Car } from './car.entity';

@Entity()
export class Picture {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Car, (car) => car.pictures)
  car: Car;

  @Column()
  src: string; // URL donde está almacenada la imagen (ej: S3, CloudFront)

  @Column({ nullable: true })
  description?: string;

  @Column()
  title: string;

  @Column()
  type: CarPicture;

  @Column()
  date: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
