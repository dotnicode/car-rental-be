import { Car } from 'src/modules/car/entities/car.entity';
import { User } from 'src/modules/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Rent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => Car)
  car: Car;

  @OneToOne(() => User)
  user: User;

  @OneToOne(() => User)
  admin: User;

  @Column()
  pricePerDay: number;

  @Column({ nullable: true })
  acceptedDate: Date | null;

  @Column()
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
