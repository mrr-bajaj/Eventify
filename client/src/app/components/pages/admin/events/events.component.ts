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

  filteredUpcomingEvents:EventModel[]=[];
  filteredPastEvents:EventModel[]=[];

  searchTerm: string;
  subscriptions:Subscription[]=[];
  
  location: string;

  constructor(private router: Router,private route : ActivatedRoute,private eventsService : EventsService,private searchService:SearchService){}
  
  ngOnInit(): void {
    this.eventsService.locationData$.subscribe(location => {
      this.location = location;
      this.initialize();
    });
  }

  async initialize(){
    await this.upcomingEvent();
    await this.pastEvent();
    this.getFilterByLocation(this.location);
    this.search();
  }

  async upcomingEvent() {
    try {
      const resData: EventModel[] = await this.eventsService.getAllUpcomingEvents().toPromise();
      this.upcomingEvents = resData;
      this.filteredUpcomingEvents = this.upcomingEvents;
    } catch (error) {
      console.error('Error fetching upcoming events:', error);
    }
  }
  
  async pastEvent() {
    try {
      const resData: EventModel[] = await this.eventsService.getAllPastEvents().toPromise();
      this.pastEvents = resData;
      this.filteredPastEvents = this.pastEvents;
    } catch (error) {
      console.error('Error fetching past events:', error);
    }
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


  getFilterByLocation(selectedLocation: any){
    if(selectedLocation === 'All'){
      this.filteredUpcomingEvents = this.upcomingEvents;
      this.filteredPastEvents = this.pastEvents;
    }else{
      this.filteredUpcomingEvents = this.upcomingEvents.filter((data)=>{
        return data.location === selectedLocation;
      })
      this.filteredPastEvents = this.pastEvents.filter((data)=>{
        return data.location === selectedLocation;
      })
    }
  }

  ngOnDestroy() {
    // Unsubscribe from each subscription in the array to prevent memory leaks
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
    this.subscriptions = []; // Clear the subscriptions array
  }
}
