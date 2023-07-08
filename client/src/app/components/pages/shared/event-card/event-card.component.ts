import { Component, Input, OnInit } from '@angular/core';
import { EventModel } from 'src/app/models/event';

@Component({
  selector: 'app-event-card',
  templateUrl: './event-card.component.html',
  styleUrls: ['./event-card.component.css']
})
export class EventCardComponent implements OnInit{
  @Input() event: EventModel;
  formattedStartTime: string;
  imageURL: string;
  
  ngOnInit(): void {
   this.convertTime();
   this.convertImageToDataUrl();
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

  convertImageToDataUrl(): void {
    const reader = new FileReader();
    reader.onload = () => {
      this.imageURL = reader.result as string;
    };
    reader.readAsDataURL(this.event.image);
  }

}
