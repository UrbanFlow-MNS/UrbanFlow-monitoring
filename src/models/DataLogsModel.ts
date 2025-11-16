export interface DataLogsModels {
    id: number;
    isApi: boolean;
    targetId: number;
    dateOfData: Date;
    numberOfConnection: number;
    event: string;
}