import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity()
export class MicroserviceEntity {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    name: string;
    @Column()
    isActive: boolean;
    @Column()
    filePath: string;
}