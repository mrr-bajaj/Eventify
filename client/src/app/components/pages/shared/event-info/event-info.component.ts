import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Attendance } from 'src/app/models/attendance';
import { Employee } from 'src/app/models/employee';
import { EventModel } from 'src/app/models/event';
import { EmployeeService } from 'src/app/services/employees/employee.service';
import { EventsService } from 'src/app/services/events/events.service';

@Component({
  selector: 'app-event-info',
  templateUrl: './event-info.component.html',
  styleUrls: ['./event-info.component.css']
})
export class EventInfoComponent {
  eventId: string = '';
  eventDetail: EventModel;
  attendanceDetail: Attendance;
  attendedEmployeesInfo: Employee[]=[];
  constructor(private route: ActivatedRoute, private eventsService: EventsService,private employeeService: EmployeeService){}

  ngOnInit(): void {
    this.initialize();
  }

  async initialize(){
    await this.getEventId();
    await this.getEventDetails();
    await this.getAttendedEmployeesList();
  }

  async getEventId(){
    this.route.paramMap.subscribe(params =>{
      this.eventId = params.get('id');
    })
  }

  async getEventDetails(){
    this.eventDetail = await this.eventsService.getEventById(this.eventId).toPromise();
  }

  async getAttendedEmployeesList(){
    this.attendanceDetail = await this.eventsService.getAttendance(this.eventId).toPromise();
    for (const employee of this.attendanceDetail.employees) {
      await this.getEmployeeDetails(employee.email);
    }
    console.log(this.attendedEmployeesInfo);
  } 

  async getEmployeeDetails(email: string) {
    const employee = await this.employeeService.getEmployeeByEmail(email).toPromise();
    this.attendedEmployeesInfo.push(employee);
  }
}
