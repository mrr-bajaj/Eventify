import { DatePipe } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Employee } from 'src/app/models/employee';
import { EmployeeService } from 'src/app/services/employees/employee.service';
import { EventsService } from 'src/app/services/events/events.service';
import { SearchService } from 'src/app/services/search/search.service';
import { faUserClock, faUserCheck } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-employee-info',
  templateUrl: './employee-info.component.html',
  styleUrls: ['./employee-info.component.css']
})
export class EmployeeInfoComponent implements OnInit, OnDestroy{
  employee:Employee;
  displayedColumns: string[] = ['srNo', 'name', 'date', 'time'];
  attendedDataSource: any[];
  registeredDataSource: any[];
  attendedEventsCount=0;
  registeredEventsCount=0;
  empEmail: string;
  searchTerm:string;
  subscriptions:Subscription[]=[];
  icons = [faUserClock,faUserCheck];

  isRegistration:boolean = false;
  constructor(private route: ActivatedRoute,private eventsService:EventsService,private datePipe:DatePipe,private searchService:SearchService,private employeeService:EmployeeService){}
  ngOnInit(): void {
    this.initialize();
    this.search();
  }

  initialize(){
    this.getParamEmail();
    this.getAttendedEventDetails();
    this.getRegisteredEventDetails();
    this.employeeService.getEmployeeByEmail(this.empEmail).subscribe(res=>{
      if(res)
      this.employee=res;
    });
  }

  showRegiration(){
    this.isRegistration = !this.isRegistration;
    if(this.isRegistration){
      this.displayedColumns = ['srNo', 'name', 'date'];
    }else{
      this.displayedColumns = ['srNo', 'name', 'date','time'];
    }
  }

  getParamEmail(){
    const subs =this.route.paramMap.subscribe(params =>{
      this.empEmail = params.get('id');
    })
    this.subscriptions.push(subs);
  }

  getAttendedEventDetails(){
    const subs = this.eventsService.getAllAttendedEventsOfEmployeeByEmail(this.empEmail)
    .subscribe(resData => {
      this.attendedDataSource = resData;
      this.attendedEventsCount=resData.length;
      for(let i in resData){
        this.attendedDataSource[i].date = this.convertDate(this.attendedDataSource[i].date);
        this.attendedDataSource[i].time = this.convertTime(this.attendedDataSource[i].time);
        this.attendedDataSource[i].srNo = (+i)+1;
      }
    })
    this.subscriptions.push(subs);
  }

  getRegisteredEventDetails(){
    const subs = this.eventsService.getAllRegisteredEventsOfEmployeeByEmail(this.empEmail)
    .subscribe(resData => {
      if(resData){
        this.registeredDataSource = resData;
        this.registeredEventsCount=resData.length;
        for(let i in resData){
          this.registeredDataSource[i].date = this.convertDate(this.registeredDataSource[i].date);
          this.registeredDataSource[i].srNo = (+i)+1;
        }
      }
    })
    this.subscriptions.push(subs);
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

  convertDate(date:string){
    const originalDate = new Date(date);
    return this.datePipe.transform(originalDate, 'dd MMM yyyy');
  }

  search(){
    const subscription = this.searchService.searchData.subscribe(data => {
      this.searchTerm = data;
    })
    this.subscriptions.push(subscription);
  }

  ngOnDestroy() {
    // Unsubscribe from each subscription in the array to prevent memory leaks
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
    this.subscriptions = []; // Clear the subscriptions array
  }
}
