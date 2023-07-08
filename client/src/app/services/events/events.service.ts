import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventsService {
  
  private baseUrl = 'http://localhost:3000/api/events';

  constructor(private http: HttpClient) {}


  addEvent(event:any): Observable<any>{
    return this.http.post(`${this.baseUrl}/add-event`,event);
  }

  getAllUpcomingEvents(): Observable<any>{
    const date = new Date();
    return this.http.get(`${this.baseUrl}/upcoming-event?date=${date}`);
  }

  getAllPastEvents(): Observable<any>{
    const date = new Date();
    return this.http.get(`${this.baseUrl}/past-event?date=${date}`);
  }

  getEventById(id: string): Observable<any>{
    return this.http.get(`${this.baseUrl}/${id}`);
  }

  addAttendance(email:string, eventId: string): Observable<any>{
    var today = new Date();
    var time = today.getHours() + ":" + today.getMinutes();
    return this.http.post(`${this.baseUrl}/attendance/${eventId}`,{email,time});
  }

  getAttendance(eventId: string):Observable<any>{
    return this.http.get(`${this.baseUrl}/attendance/${eventId}`);
  }
}
