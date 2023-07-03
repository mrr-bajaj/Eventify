import { Injectable } from '@angular/core';
import { EventModel } from 'src/app/models/event';

@Injectable({
  providedIn: 'root'
})
export class EventsService {

  constructor() { }

  events:EventModel[] = [];

  addEvent(event:EventModel){
    this.events.push(event);
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
