import { Component, ViewChild, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { EventModel } from 'src/app/models/event';
import { EventsService } from 'src/app/services/events/events.service';

@Component({
  selector: 'app-add-event',
  templateUrl: './add-event.component.html',
  styleUrls: ['./add-event.component.css']
})
export class AddEventComponent implements OnDestroy{

  imageFile: File | null = null;
  @ViewChild('eventForm') eventForm : NgForm;
  eventData : EventModel = {
    name: '',
    description: '',
    date: null,
    startTime: '',
    endTime: '',
    location: '',
    type: '',
    image: null
  };
  subscriptions:Subscription[]=[];

  constructor(
    private eventsService: EventsService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  onSubmit(eventForm: NgForm) {
    if (eventForm.valid) {
      this.eventData = eventForm.value;
      this.eventData.date = new Date(eventForm.value.date);
      this.appendFormData();
    }
  }

  appendFormData(){
    const formData = new FormData();
      formData.append('name', this.eventData.name);
      formData.append('description', this.eventData.description);
      formData.append('date', this.eventData.date.toISOString());
      formData.append('startTime', this.eventData.startTime);
      formData.append('endTime', this.eventData.endTime);
      formData.append('location', this.eventData.location);
      formData.append('type', this.eventData.type);
      formData.append('image', this.imageFile);
      this.addEvent(formData)
  }

  addEvent(formData: FormData){
    const subs = this.eventsService.addEvent(formData).subscribe(
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
    this.subscriptions.push(subs);
  }

  onImageChange(event) {
    this.imageFile = event.target.files[0];
  }

  onReset() {
    this.eventForm.reset();
  }

  ngOnDestroy() {
    // Unsubscribe from each subscription in the array to prevent memory leaks
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
    this.subscriptions = []; // Clear the subscriptions array
  }
}
