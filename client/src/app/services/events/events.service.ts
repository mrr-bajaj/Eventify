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

  events:EventModel[] = [];

  addEvent(event:any): Observable<any>{
    this.events.push(event);
    return this.http.post(`${this.baseUrl}/add-event`,event);
  }

  getAllEvents(){
    return this.events.slice();
  }

  getAllUpcomingEvents(){
    const today = new Date();

    const filteredEvents = this.events.filter((event: EventModel) => {
      const eventDate = new Date(event.eventDate);
      // Compare the event date with today's date
      return eventDate >= today;
    });

    return filteredEvents;
  }

  getAllPastEvents(){
    const today = new Date();

    const filteredEvents = this.events.filter((event: EventModel) => {
      const eventDate = new Date(event.eventDate);
      // Compare the event date with today's date
      return eventDate < today;
    });

    return filteredEvents;
  }
}
