import { Car } from 'src/modules/car/entities/car.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PictureType } from '../enums/picture-type.enum';

@Entity()
export class Picture {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Car, (car) => car.pictures, { nullable: true })
  car?: Car;

  @Column()
  fileKey: string;

  @Column()
  src: string;

  @Column({ nullable: true })
  description?: string;

  @Column()
  title: string;

  @Column()
  type: PictureType;

  @Column()
  date: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
