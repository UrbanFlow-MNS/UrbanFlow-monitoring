import { PrimaryGeneratedColumn, Column } from "typeorm"

export class UserAccountEntity {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    name: string;
    @Column()
    firstName: string;
    @Column()
    email: string;
}