import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EventModel } from 'src/app/models/event';

@Injectable({
  providedIn: 'root'
})
export class EventsService {
  
  private baseUrl = 'http://localhost:3000/api/events';

  constructor(private http: HttpClient) {}

  pastEvents : EventModel[] = [];
  upcomingEvents : EventModel[] = [];

  addEvent(event:any): Observable<any>{
    return this.http.post(`${this.baseUrl}/add-event`,event);
  }

  getAllUpcomingEvents(){
    const date = new Date();
    return this.http.get(`${this.baseUrl}/upcoming-event?date=${date}`);
  }

  getAllPastEvents(){
    const date = new Date();
    return this.http.get(`${this.baseUrl}/past-event?date=${date}`);
  }
}
