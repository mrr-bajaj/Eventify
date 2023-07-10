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
    this.eventsService.getAllUpcomingEvents().subscribe( (resData:EventModel[]) => {
      this.upcomingEvents =resData;
    });
    this.eventsService.getAllPastEvents().subscribe((resData:EventModel[])=>{
      this.pastEvents = resData;
    });
  }

  onAddEvent(){
    this.router.navigate(['/admin/edit-event'],{relativeTo: this.route})
  }

}
