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
    this.initialize();
  }

  initialize(){
    this.eventsService.getAllUpcomingEvents()
    .subscribe((resData:EventModel[]) => {

      // Compare function for sorting by date property
      const compareDates = (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime();

      // Sort the array by the date property
      resData.sort(compareDates);
      this.upcomingEvents =resData.slice(0,1);
    });

    this.eventsService.getAllPastEvents()
    .subscribe((resData:EventModel[])=>{

      // Compare function for sorting by date property
      const compareDates = (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime();

      // Sort the array by the date property
      resData.sort(compareDates);
      this.pastEvents = resData.slice(0,2);
    });
  }
}
