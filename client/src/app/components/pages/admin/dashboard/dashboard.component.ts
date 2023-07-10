import { Component } from '@angular/core';
import { EventModel } from 'src/app/models/event';
import { EventsService } from 'src/app/services/events/events.service';
import { SearchService } from 'src/app/services/search/search.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {

  upcomingEvents:EventModel[]=[];
  pastEvents:EventModel[]=[];
  searchTerm:string;

  constructor(private eventsService : EventsService,private searchService: SearchService){}
  
  ngOnInit(): void {
    this.initialize();
  }

  initialize(){
    this.eventsService.getAllUpcomingEvents()
    .subscribe((resData:EventModel[]) => {
      this.upcomingEvents =resData.slice(0,1);
    });

    this.eventsService.getAllPastEvents()
    .subscribe((resData:EventModel[])=>{
      this.pastEvents = resData.slice(0,2);
    });

    this.search();
  }

  search(){
    this.searchService.searchData.subscribe(data => {
      this.searchTerm = data;
    })
  }
}
