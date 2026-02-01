import { Entity, PrimaryGeneratedColumn, Column, Timestamp } from 'typeorm';

@Entity()
export class ServerDatastampEntity {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    serverName: string;
    @Column({ type: 'timestamp' })
    timestamp: Timestamp;
    @Column()
    cpuPercent: number;
    @Column()
    gpuPercent: number;
    @Column()
    ramUsage: number;
    @Column()
    internalTemp: number;
}