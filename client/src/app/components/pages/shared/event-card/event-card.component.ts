import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { EventModel } from 'src/app/models/event';
import { EventsService } from 'src/app/services/events/events.service';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import Swal from 'sweetalert2';
import { EmployeeService } from 'src/app/services/employees/employee.service';

@Component({
  selector: 'app-event-card',
  templateUrl: './event-card.component.html',
  styleUrls: ['./event-card.component.css']
})
export class EventCardComponent implements OnInit{
  @Input() event: EventModel;
  formattedStartTime: string;
  imageURL: string;
  roles:String[];
  qrCodeImage: string;
  @Input() isPast : boolean = false;

  constructor(private router: Router,private route: ActivatedRoute,private eventsService:EventsService, private dialog: MatDialog, private employeeService:EmployeeService){}

  ngOnInit(): void {
   this.convertTime();
   this.convertImageFileToUrl();
   this.roles = localStorage.getItem('roles')?.split(',') || [];
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
    const dialogRef = this.dialog.open(ConfirmationDialogComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.eventsService.deleteEvent(this.event.id).subscribe(res => {
          if(res.message === 'Event deleted successfully'){
            this.eventsService.sendEventData();
          }
        }, err => {
          console.log(err);
        });
      }
    });
  }

  onRegister(eventId: any) {
    const email = this.employeeService.getEmployeeEmailFromToken();
    this.eventsService.addRegistration(email, eventId).subscribe((res) => {
      if (res.message === 'Registered event successfully') {
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: "You've Successfully Registered For The Event!\nSee You There!!!",
        });
      } else if (res.message === 'Already registered') {
        Swal.fire({
          icon: 'info',
          title: 'Already Registered',
          text: "You've Already Registered For The Event!",
        });
      }
    }, (error) => {
      console.log(error);
    });
  }

}
