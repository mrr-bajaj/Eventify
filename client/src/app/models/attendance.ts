export interface Attendance{
  eventId ?: string;
  employees: [
    {
      email: string,
      time: string
    }
  ]
}