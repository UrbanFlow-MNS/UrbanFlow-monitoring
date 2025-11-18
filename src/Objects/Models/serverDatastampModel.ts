import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity()
export class ServerDatastampModel {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    serverName: string;
    @Column()
    timestamp: Date;
    @Column()
    cpuPercent: number;
    @Column()
    gpuPercent: number;
    @Column()
    ramUsage: number;
    @Column()
    internalTemp: number;
}