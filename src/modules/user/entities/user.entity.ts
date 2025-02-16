import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Role } from 'src/common/enums/role.enum';
import { Document } from 'src/modules/document/entities/document.entity';
import { Rent } from 'src/modules/rent/entities/rent.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  dob: Date;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  address?: string;

  @Column({ nullable: true })
  country?: string;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.CLIENT,
  })
  role: Role;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Document, (document) => document.user)
  documents: Document[];

  @OneToMany(() => Rent, (rent) => rent.user)
  rents: Rent[];

  @OneToMany(() => Rent, (rent) => rent.admin)
  adminRents: Rent[];
}
