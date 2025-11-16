import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity()
export class MicroserviceModel {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    name: string;
    @Column()
    isActive: boolean;
    @Column()
    filePath: string;
}