import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { EventModel } from 'src/app/models/event';
import { EventsService } from 'src/app/services/events/events.service';
import { SearchService } from 'src/app/services/search/search.service';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent implements OnInit, OnDestroy{

  upcomingEvents:EventModel[]=[];
  pastEvents:EventModel[]=[];

  searchTerm: string;
  subscriptions:Subscription[]=[];

  constructor(private router: Router,private route : ActivatedRoute,private eventsService : EventsService,private searchService:SearchService){}
  
  ngOnInit(): void {
    this.initialize();
  }

  initialize(){
    this.upcomingEvent();
    this.pastEvent();
    this.search();
  }

  upcomingEvent(){
    const subs = this.eventsService.getAllUpcomingEvents().subscribe( (resData:EventModel[]) => {
      this.upcomingEvents =resData;
    });
    this.subscriptions.push(subs);
  }

  pastEvent(){
    const subs = this.eventsService.getAllPastEvents().subscribe((resData:EventModel[])=>{
      this.pastEvents = resData;
    });
    this.subscriptions.push(subs);
  }

  onAddEvent(){
    this.router.navigate(['/admin/add-event'],{relativeTo: this.route})
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
