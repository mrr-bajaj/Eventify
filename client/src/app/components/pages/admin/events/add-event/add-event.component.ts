import { DatePipe } from '@angular/common';
import { Component, ViewChild, OnDestroy, OnInit } from '@angular/core';
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
export class AddEventComponent implements OnInit,OnDestroy{

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
  fileName:string 
  subscriptions:Subscription[]=[];
  eventId:string;
  isEditMode: boolean = false;

  constructor(
    private eventsService: EventsService,
    private router: Router,
    private route: ActivatedRoute,
    private datePipe:DatePipe
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
        this.eventData = response;
        this.eventData.date = response.date.split("T")[0];
        this.fileName = response.image.split('/').pop().split('-')[0]; 
         },
      (error) => {
        console.log(error);
      }
    );
  }
  //7465-06-08 string
  convertDate(date:string){
    const originalDate = new Date(date);
    return this.datePipe.transform(originalDate, 'dd MMM yyyy');
  }
  
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
    if(this.isEditMode){
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
    }else{
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
    
  }

  onImageChange(event) {
    this.imageFile = event.target.files[0];
    this.fileName = this.imageFile.name;
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
