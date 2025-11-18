import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"


export class UserAccountModel {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    name: string;
    @Column()
    firstName: string;
    @Column()
    email: string;
}