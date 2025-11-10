export interface ServerDatastampModel {
    id: number;
    serverName: string;
    timestamp: Date;
    cpuPercent: number;
    gpuPercent: number;
    ramUsage: number;
    internalTemp: number;
}