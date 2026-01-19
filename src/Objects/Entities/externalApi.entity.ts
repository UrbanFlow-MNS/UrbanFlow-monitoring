import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity()
export class ExternalApiEntity {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    name: string;
    @Column()
    url: string;
    @Column()
    isActive: boolean;
    @Column()
    version: string;
}