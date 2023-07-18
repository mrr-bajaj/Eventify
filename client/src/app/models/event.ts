export interface EventModel{
  id?:string,
  name: string;
  description: string;
  date: Date;
  startTime: string;
  endTime: string;
  venue: string;
  location: string;
  type: string;
  image: File;
  qrCode?: string;
}