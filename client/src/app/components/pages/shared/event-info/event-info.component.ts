  import { Component, OnInit, OnDestroy  } from '@angular/core';
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
    registrationDetail: Attendance;
    registeredEmployeesInfo: Employee[]=[];
    displayedColumns: string[] = ['srNo', 'name', 'email','department', 'time'];
    attendedDataSource: any[];
    registeredDataSource: any[];
    searchTerm: string;
    subscriptions:Subscription[]=[];
    pieData:{
      key:string[],
      value:number[]
    }={key:[],value:[]};
    isRegistration:boolean=false;
    constructor(private route: ActivatedRoute, private eventsService: EventsService,private employeeService: EmployeeService,private searchService: SearchService){
    }

    ngOnInit(): void {
      this.initialize();
    }

    async initialize(){
      await this.getEventId();
      await this.getEventDetails();
      await this.getAttendedEmployeesList();
      await this.getRegisteredEmployeesList();
      this.chartInitialize();
      this.search();
    }

    showRegiration(){
      this.isRegistration = !this.isRegistration;
      if(this.isRegistration){
        this.displayedColumns = ['srNo', 'name', 'email','department'];
        this.chartInitialize();
      }else{
        this.displayedColumns = ['srNo', 'name', 'email','department','time'];
        this.chartInitialize();
      }
    }
    
    chartInitialize(){
      if(this.isRegistration){
        this.findPieData(this.registeredDataSource) 
      }else{
        this.findPieData(this.attendedDataSource) 
      }
      this.eventsService.sendEvent(true);
    }

    findPieData(dataSource){
      this.pieData.key = null;
      this.pieData.value = null;
      const departments = [];
      const employeeCounts = [];
      dataSource.forEach(data => {
        if (data.department) {
          const departmentIndex = departments.indexOf(data.department);
          if (departmentIndex === -1) {
            departments.push(data.department);
            employeeCounts.push(1);
          } else {
            employeeCounts[departmentIndex]++;
          }
        }
      });
      this.pieData.key = departments;
      this.pieData.value = employeeCounts;
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
        await this.getEmployeeDetails(employee.email,srNo,false,employee.time);
        srNo++;
      }
      this.attendedDataSource =this.attendedEmployeesInfo;
    } 

    async getEmployeeDetails(email: string,srNo: number,isRegister:boolean,time?: string) {
      const employee = await this.employeeService.getEmployeeByEmail(email).toPromise();
      employee.srNo = srNo;
      if(time){
        employee.time = this.convertTime(time);
      }
      if(isRegister){
        this.registeredEmployeesInfo.push(employee);
      }else{
        this.attendedEmployeesInfo.push(employee);
      }
    }

    async getRegisteredEmployeesList(){
      this.registrationDetail = await this.eventsService.getRegistration(this.eventId).toPromise();
      let srNo=1;
      // console.log(this.registrationDetail)
      for (const employee of this.registrationDetail.employees) {
        await this.getEmployeeDetails(employee.email,srNo,true);
        srNo++;
      }
      this.registeredDataSource =this.registeredEmployeesInfo;
      // console.log(this.registeredDataSource)
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
