import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EventModel } from 'src/app/models/event';
import { EventsService } from 'src/app/services/events/events.service';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent implements OnInit{

  upcomingEvents:EventModel[]=[];
  pastEvents:EventModel[]=[];

  constructor(private router: Router,private route : ActivatedRoute,private eventsService : EventsService){}
  
  ngOnInit(): void {
    this.upcomingEvents = this.eventsService.getAllUpcomingEvents();
    this.pastEvents = this.eventsService.getAllPastEvents();
  }

  onAddEvent(){
    this.router.navigate(['/admin/add-event'],{relativeTo: this.route})
  }

}
