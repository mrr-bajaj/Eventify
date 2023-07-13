import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventsService {
  
  private baseUrl = 'http://localhost:3000/api/events';

  constructor(private http: HttpClient) {}


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

  getAllAttendendEventsOfEmployeeByEmail(email:string):Observable<any>{
    return this.http.get(`${this.baseUrl}/attendance/employee/${email}`);
  }
}
