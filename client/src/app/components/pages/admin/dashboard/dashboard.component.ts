import { Component } from '@angular/core';
import { EventModel } from 'src/app/models/event';
import { EventsService } from 'src/app/services/events/events.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {

  upcomingEvents:EventModel[]=[];
  pastEvents:EventModel[]=[];

  constructor(private eventsService : EventsService){}
  
  ngOnInit(): void {
    this.upcomingEvents = this.eventsService.getAllUpcomingEvents();
    this.pastEvents = this.eventsService.getAllPastEvents();
  }
}
