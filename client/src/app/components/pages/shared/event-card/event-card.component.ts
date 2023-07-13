import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EventModel } from 'src/app/models/event';
import { EventsService } from 'src/app/services/events/events.service';

@Component({
  selector: 'app-event-card',
  templateUrl: './event-card.component.html',
  styleUrls: ['./event-card.component.css']
})
export class EventCardComponent implements OnInit{
  @Input() event: EventModel;
  formattedStartTime: string;
  imageURL: string;
  qrCodeImage: string;
  @Input() isPast : boolean = false;
  
  constructor(private router: Router,private route: ActivatedRoute,private eventsService:EventsService){}

  ngOnInit(): void {
   this.convertTime();
   this.convertImageFileToUrl();
  }

  convertTime(){
    // Convert startTime to a Date object
    const startTimeDate = new Date(`1970-01-01T${this.event.startTime}:00Z`);

    // Format the time with AM or PM
    this.formattedStartTime = startTimeDate.toLocaleString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    });
  }

  convertImageFileToUrl(): void {
    this.imageURL = this.event.image.toString();
  }

  downloadQrCode(){
    this.qrCodeImage = this.event.qrCode;
    const link = document.createElement('a');
    link.href = this.qrCodeImage;
    link.download = `${this.event.name}_qrcode.png`;
    link.click();
  }

  viewInfo(){
    this.router.navigate(['/admin/events',this.event.id],{relativeTo: this.route});
  }

  onEdit(){
    this.router.navigate(['/admin/edit-event',this.event.id],{relativeTo: this.route});
  }

  onDelete(){
    this.eventsService.deleteEvent(this.event.id).subscribe(res => {
      if(res.message === 'Event deleted successfully'){
        window.location.reload();   //TOCHANGE
      }
    }, err => {
      console.log(err);
    });
  }
}
