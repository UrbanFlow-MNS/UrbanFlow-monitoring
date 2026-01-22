
export class DataLogsDto {

  @ApiProperty()
  isApi : boolean;
  @ApiProperty()
  targetId: number;
  @ApiProperty()
  dateOfData: Date;
  @ApiProperty()
  numberOfConnection: number;
  @ApiProperty()
  event: string;

  constructor(isApi : boolean, targetId : number, dateOfData : Date, numberOfConnection : number, event : string) {
    this.isApi = isApi;
    this.targetId = targetId;
    this.dateOfData = dateOfData;
    this.numberOfConnection = numberOfConnection;
    this.event = event;
  }
}