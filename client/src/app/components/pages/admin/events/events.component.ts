import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EventModel } from 'src/app/models/event';
import { EventsService } from 'src/app/services/events/events.service';
import { SearchService } from 'src/app/services/search/search.service';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent implements OnInit{

  upcomingEvents:EventModel[]=[];
  pastEvents:EventModel[]=[];

  searchTerm: string;

  constructor(private router: Router,private route : ActivatedRoute,private eventsService : EventsService,private searchService:SearchService){}
  
  ngOnInit(): void {
    this.eventsService.getAllUpcomingEvents().subscribe( (resData:EventModel[]) => {
      this.upcomingEvents =resData;
    });
    
    this.eventsService.getAllPastEvents().subscribe((resData:EventModel[])=>{
      this.pastEvents = resData;
    });

    this.search();
  }

  onAddEvent(){
    this.router.navigate(['/admin/add-event'],{relativeTo: this.route})
  }

  search(){
    this.searchService.searchData.subscribe(data => {
      this.searchTerm = data;
    })
  }
}
