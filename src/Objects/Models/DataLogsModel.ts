import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity()
export class DataLogsModels {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    isApi: boolean;
    @Column()
    targetId: number;
    @Column()
    dateOfData: Date;
    @Column()
    numberOfConnection: number;
    @Column()
    event: string;
}