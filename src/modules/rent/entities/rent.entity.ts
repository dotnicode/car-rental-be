import { Car } from 'src/modules/car/entities/car.entity';
import { User } from 'src/modules/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Rent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Car, (car) => car.rents)
  @JoinColumn()
  car: Car;

  @ManyToOne(() => User, (user) => user.rents)
  @JoinColumn()
  user: User;

  @ManyToOne(() => User, (admin) => admin.adminRents)
  @JoinColumn()
  admin: User;

  @Column()
  pricePerDay: number;

  @Column({ nullable: true })
  acceptedDate?: Date;

  @Column({ default: false })
  rejected: boolean;

  @Column()
  startingDate: Date;

  @Column()
  endingDate: Date;

  @Column()
  dueDate: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
