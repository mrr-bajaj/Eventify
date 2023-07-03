import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EventModel } from 'src/app/models/event';
import { EventsService } from 'src/app/services/events/events.service';

@Component({
  selector: 'app-add-event',
  templateUrl: './add-event.component.html',
  styleUrls: ['./add-event.component.css']
})
export class AddEventComponent {

  imageFile: File;
  @ViewChild('eventForm') eventForm : NgForm;
  eventData : EventModel = {
    eventName: '',
    eventDescription: '',
    eventDate: null,
    eventStartTime: '',
    eventEndTime: '',
    eventLocation: '',
    eventType: '',
    eventImage: null
  };

  constructor(private eventsService : EventsService,private router: Router,private route:ActivatedRoute){}

  onSubmit(eventForm:NgForm) {
    if(eventForm.valid){
      this.eventData = eventForm.value;
      this.eventData.eventImage = this.imageFile;
      this.eventsService.addEvent(this.eventData);
      this.onReset();
      this.router.navigate(['/admin/events'],{relativeTo: this.route})
    }
  }

  onImageChange(event) {
    this.imageFile = event.target.files[0];
  }

  onReset(){
    this.eventForm.reset();
  }
}
