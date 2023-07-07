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

  imageFile: File | null = null;
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

  constructor(
    private eventsService: EventsService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  onSubmit(eventForm: NgForm) {
    if (eventForm.valid) {
      this.eventData = eventForm.value;
      this.eventData.eventDate = new Date(eventForm.value.eventDate);
      const formData = new FormData();
      formData.append('eventName', this.eventData.eventName);
      formData.append('eventDescription', this.eventData.eventDescription);
      formData.append('eventDate', this.eventData.eventDate.toISOString());
      formData.append('eventStartTime', this.eventData.eventStartTime);
      formData.append('eventEndTime', this.eventData.eventEndTime);
      formData.append('eventLocation', this.eventData.eventLocation);
      formData.append('eventType', this.eventData.eventType);
      formData.append('eventImage', this.imageFile);
      this.eventsService.addEvent(formData).subscribe(
        (response) => {
          if (response.message === 'Event added successfully') {
            this.onReset();
            this.router.navigate(['/admin/events'], { relativeTo: this.route });
          }
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }

  onImageChange(event) {
    this.imageFile = event.target.files[0];
  }

  onReset() {
    this.eventForm.reset();
  }
}
