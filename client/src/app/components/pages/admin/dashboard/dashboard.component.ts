import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { EventModel } from 'src/app/models/event';
import { EventsService } from 'src/app/services/events/events.service';
import { SearchService } from 'src/app/services/search/search.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy{

  upcomingEvents:EventModel[]=[];
  pastEvents:EventModel[]=[];
  searchTerm:string;
  subscriptions: Subscription[]= [];

  constructor(private eventsService : EventsService,private searchService: SearchService){}
  
  ngOnInit(): void {
    this.initialize();
  }

  initialize(){
    this.upcomingEvent();
    this.pastEvent();
    this.search();
  }

  upcomingEvent(){
    const subs = this.eventsService.getAllUpcomingEvents()
    .subscribe((resData:EventModel[]) => {
      this.upcomingEvents =resData.slice(0,1);
    });
    this.subscriptions.push(subs);
  }

  pastEvent(){
    const subs = this.eventsService.getAllPastEvents()
    .subscribe((resData:EventModel[])=>{
      this.pastEvents = resData.slice(0,2);
    });
    this.subscriptions.push(subs);
  }

  search(){
    const subs = this.searchService.searchData.subscribe(data => {
      this.searchTerm = data;
    })
    this.subscriptions.push(subs);
  }

  ngOnDestroy() {
    // Unsubscribe from each subscription in the array to prevent memory leaks
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
    this.subscriptions = []; // Clear the subscriptions array
  }
}
