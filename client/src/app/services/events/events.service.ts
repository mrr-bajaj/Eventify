import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventsService {
  
  private baseUrl = 'http://localhost:3000/api/events';
  private pieUpdateSubject = new Subject<boolean>();
  private totalUpcomingEventCount: number = 0;
  private totalPastEventCount: number = 0;
  
  constructor(private http: HttpClient) {}
  
  sendPieDataEvent(data: boolean) {
    this.pieUpdateSubject.next(data);
  }

  getPieDataEvent() {
    return this.pieUpdateSubject.asObservable();
  }
  
  addEvent(event:any): Observable<any>{
    return this.http.post(`${this.baseUrl}/add-event`,event);
  }

  editEvent(eventId: string, event: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/edit-event/${eventId}`, event);
  }

  deleteEvent(eventId: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/delete-event/${eventId}`);
  }

  getAllUpcomingEvents(): Observable<any>{
    const date = new Date();
    return this.http.get(`${this.baseUrl}/upcoming-event?date=${date}`)
        .pipe(tap(resData => {
        // Compare function for sorting by date property
        const compareDates = (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime();

        // Sort the array by the date property
        resData.sort(compareDates);
        this.totalUpcomingEventCount = resData.length;
    }));
  }

  getAllPastEvents(): Observable<any>{
    const date = new Date();
    return this.http.get(`${this.baseUrl}/past-event?date=${date}`)
    .pipe(tap(resData => {
      // Compare function for sorting by date property
      const compareDates = (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime();

      // Sort the array by the date property
      resData.sort(compareDates);
      this.totalPastEventCount = resData.length;
    }));
  }

  getEventById(id: string): Observable<any>{
    return this.http.get(`${this.baseUrl}/${id}`);
  }

  addRegistration(email:string,eventId: string):Observable<any>{
    return this.http.post(`${this.baseUrl}/register/${eventId}`,{email});
  }

  addAttendance(email:string, eventId: string): Observable<any>{
    var today = new Date();
    var time = today.getHours() + ":" + today.getMinutes();
    return this.http.post(`${this.baseUrl}/attendance/${eventId}`,{email,time});
  }

  getAttendance(eventId: string):Observable<any>{
    return this.http.get(`${this.baseUrl}/attendance/${eventId}`);
  }

  getRegistration(eventId: string):Observable<any>{
    return this.http.get(`${this.baseUrl}/register/${eventId}`);
  }

  getAllAttendendEventsOfEmployeeByEmail(email:string):Observable<any>{
    return this.http.get(`${this.baseUrl}/attendance/employee/${email}`);
  }

  getAllRegisteredEventsOfEmployeeByEmail(email:string):Observable<any>{
    return this.http.get(`${this.baseUrl}/register/employee/${email}`);
  }

  getTotalEventCount(){
    return this.totalPastEventCount + this.totalUpcomingEventCount;
  }

  getTotalPastEventCount(){
    return this.totalPastEventCount;
  }

  getTotalUpcomingEventCount(){
    return this.totalUpcomingEventCount;
  }
}
