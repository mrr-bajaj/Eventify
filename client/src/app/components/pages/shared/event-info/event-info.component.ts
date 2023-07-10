import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Attendance } from 'src/app/models/attendance';
import { Employee } from 'src/app/models/employee';
import { EventModel } from 'src/app/models/event';
import { EmployeeService } from 'src/app/services/employees/employee.service';
import { EventsService } from 'src/app/services/events/events.service';
import { SearchService } from 'src/app/services/search/search.service';

@Component({
  selector: 'app-event-info',
  templateUrl: './event-info.component.html',
  styleUrls: ['./event-info.component.css']
})
export class EventInfoComponent implements OnInit, OnDestroy{
  eventId: string = '';
  eventDetail: EventModel;
  attendanceDetail: Attendance;
  attendedEmployeesInfo: Employee[]=[];
  displayedColumns: string[] = ['srNo', 'name', 'email', 'time'];
  dataSource: any[];
  searchTerm: string;
  subscriptions:Subscription[]=[];
  constructor(private route: ActivatedRoute, private eventsService: EventsService,private employeeService: EmployeeService,private searchService: SearchService){}

  ngOnInit(): void {
    this.initialize();
  }

  async initialize(){
    await this.getEventId();
    await this.getEventDetails();
    await this.getAttendedEmployeesList();
    this.search();
  }

  async getEventId(){
    const subs = this.route.paramMap.subscribe(params =>{
      this.eventId = params.get('id');
    })
    this.subscriptions.push(subs);
  }

  async getEventDetails(){
    this.eventDetail = await this.eventsService.getEventById(this.eventId).toPromise();
  }

  async getAttendedEmployeesList(){
    this.attendanceDetail = await this.eventsService.getAttendance(this.eventId).toPromise();
    let srNo=1;
    for (const employee of this.attendanceDetail.employees) {
      await this.getEmployeeDetails(employee.email,srNo,employee.time);
      srNo++;
    }
    this.dataSource =this.attendedEmployeesInfo;
  } 

  async getEmployeeDetails(email: string,srNo: number,time: string) {
    const employee = await this.employeeService.getEmployeeByEmail(email).toPromise();
    employee.srNo = srNo;
    employee.time = this.convertTime(time);
    this.attendedEmployeesInfo.push(employee);
  }

  convertTime(time: string): string {
    const [hours, minutes] = time.split(':');
    const formattedHours = this.formatNumber(Number(hours) % 12 || 12);
    const formattedMinutes = this.formatNumber(Number(minutes));
    const period = Number(hours) < 12 ? 'AM' : 'PM';
  
    return `${formattedHours}:${formattedMinutes} ${period}`;
  }
  
  private formatNumber(value: number): string {
    return value.toString().padStart(2, '0');
  }

  search(){
    const subs =this.searchService.searchData.subscribe(data => {
      this.searchTerm = data;
    })
    this.subscriptions.push(subs);
  }

  ngOnDestroy() {
    // Unsubscribe from each subscription in the array to prevent memory leaks
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
    this.subscriptions = []; // Clear the subscriptions array
  }
}
