import { Component, ViewChild,OnInit } from '@angular/core';
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
  isEditMode: boolean = false;
  eventId:string="";
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
  constructor(
    private eventsService: EventsService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

    ngOnInit(): void {
      this.checkEditMode();
    }

    checkEditMode(){
      this.route.paramMap.subscribe(params =>{
        this.eventId = params.get('id');
      })

      this.isEditMode = !!this.eventId;
      if (this.eventId) {
        this.fetchEventDetails();
      }
    }

    fetchEventDetails() {
      this.eventsService.getEventById(this.eventId).subscribe(
        (response) => {
           },
        (error) => {
          console.log(error);
        }
      );
    }

  onSubmit(eventForm: NgForm) {
    if (eventForm.valid) {
      this.eventData = eventForm.value;
      this.eventData.date = new Date(eventForm.value.date);
      const formData = new FormData();
      formData.append('name', this.eventData.name);
      formData.append('description', this.eventData.description);
      formData.append('date', this.eventData.date.toISOString());
      formData.append('startTime', this.eventData.startTime);
      formData.append('endTime', this.eventData.endTime);
      formData.append('location', this.eventData.location);
      formData.append('type', this.eventData.type);
      formData.append('image', this.imageFile);
      if (this.isEditMode) {
        this.eventsService.editEvent(this.eventId,formData).subscribe(
          (response) => {
            if (response) {
              this.onReset();
              this.router.navigate(['/admin/events'], { relativeTo: this.route });
            }
          },
          (error) => {
            console.log(error);
          }
        );
      }
    else{
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
  }

  onImageChange(event) {
    this.imageFile = event.target.files[0];
  }

  onReset() {
    this.eventForm.reset();
  }
}
