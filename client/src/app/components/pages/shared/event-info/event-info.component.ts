  import { Component, OnInit, OnDestroy  } from '@angular/core';
  import { ActivatedRoute } from '@angular/router';
  import { Subscription } from 'rxjs';
  import { Attendance } from 'src/app/models/attendance';
  import { Employee } from 'src/app/models/employee';
  import { EventModel } from 'src/app/models/event';
  import { EmployeeService } from 'src/app/services/employees/employee.service';
  import { EventsService } from 'src/app/services/events/events.service';
  import { SearchService } from 'src/app/services/search/search.service';
  import { faUserCheck, faUserClock, faUsers } from '@fortawesome/free-solid-svg-icons';

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
    filteredAttendedDataSource: any [];
    filteredRegisteredDataSource: any [];
    searchTerm: string;
    subscriptions:Subscription[]=[];
    pieData:{
      key:string[],
      value:number[]
    }={key:[],value:[]};
    isRegistration:boolean=false;
    attendedPer:number = 0;
    registeredPer: number = 0;
    attendedEmployeeCount: number = 0;
    registeredEmployeeCount: number = 0;
    icon = [faUserCheck, faUserClock, faUsers];
    departmentOptions = [
      { label: 'All', value: 'All'},
      { label: 'Digital Energy', value: 'Digital Energy' },
      { label: 'Digital Ocean', value: 'Digital Ocean' },
      { label: 'Digital Wells', value: 'Digital Wells' },
    ];
    location: string;
    selectedDepartment:string = 'All';
    genderPieData:{
      key:string[],
      value:number[]
    }={key:[],value:[]};
    constructor(private route: ActivatedRoute, private eventsService: EventsService,private employeeService: EmployeeService,private searchService: SearchService){
    }

    ngOnInit(): void {
      this.eventsService.locationData$.subscribe(location => {
        this.location = location;
        this.initialize();
      });
    }

    async initialize(){
      this.registeredEmployeesInfo = [];
      this.attendedEmployeesInfo = [];
      await this.getEventId();
      await this.getEventDetails();
      await this.getAttendedEmployeesList();
      await this.getRegisteredEmployeesList();
      this.getFilterByDepartment(this.selectedDepartment);
      await this.getEmployeeCount();
      this.chartInitialize();
      this.search();
    }

    async getEmployeeCount(){
      this.employeeService.getEmployees().subscribe(employees => {
        if(this.location !== 'All'){
          employees = employees.filter(data => data.location === this.location);
        }
        const totalEmployee = employees.length;
        this.attendedEmployeeCount = this.filteredAttendedDataSource.length;
        this.registeredEmployeeCount = this.filteredRegisteredDataSource.length;
        this.attendedPer = Math.round((this.attendedEmployeeCount/totalEmployee)*100);
        this.registeredPer = Math.round((this.registeredEmployeeCount/totalEmployee)*100);
      })
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
        this.findPieData(this.filteredRegisteredDataSource) 
      }else{
        this.findPieData(this.filteredAttendedDataSource) 
      }
      this.eventsService.sendPieDataEvent(true);
    }

    findPieData(dataSource){
      this.pieData.key = null;
      this.pieData.value = null;
      this.genderPieData.key=null;
      this.genderPieData.value=null;
      const gender=[];
      const genderBasedCount=[];
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
        if (data.gender) {
          const genderIndex = gender.indexOf(data.gender);
          if (genderIndex === -1) {
            gender.push(data.gender);
            genderBasedCount.push(1);
          } else {
            genderBasedCount[genderIndex]++;
          }
        }
      });
      this.pieData.key = departments;
      this.pieData.value = employeeCounts;
      this.genderPieData.key = gender;
      this.genderPieData.value = genderBasedCount;
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
      this.filteredAttendedDataSource = this.attendedDataSource
    } 

    async getEmployeeDetails(email: string,srNo: number,isRegister:boolean,time?: string) {
      const employee = await this.employeeService.getEmployeeByEmail(email).toPromise();
      employee.srNo = srNo;
      if(time){
        employee.time = this.convertTime(time);
      }
      if(this.location === 'All'){
        this.pushEmployeeData(isRegister,employee);
      }else if(this.location === employee.location){
        this.pushEmployeeData(isRegister,employee);
      }
    }

    pushEmployeeData(isRegister:boolean,employee: any){
      if(isRegister){
        this.registeredEmployeesInfo.push(employee);
      }else{
        this.attendedEmployeesInfo.push(employee);
      }
    }

    async getRegisteredEmployeesList(){
      this.registrationDetail = await this.eventsService.getRegistration(this.eventId).toPromise();
      let srNo=1;
      for (const employee of this.registrationDetail.employees) {
        await this.getEmployeeDetails(employee.email,srNo,true);
        srNo++;
      }
      this.registeredDataSource =this.registeredEmployeesInfo;
      this.filteredRegisteredDataSource = this.registeredDataSource;
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

    onSelectDepartment(event: any){
      this.selectedDepartment = event.target.value;
      this.getFilterByDepartment(this.selectedDepartment);
      this.chartInitialize();
      this.getEmployeeCount();
    }

    getFilterByDepartment(selectedDepartment: any){
      if(selectedDepartment === 'All'){
        this.filteredAttendedDataSource = this.attendedDataSource;
        this.filteredRegisteredDataSource = this.registeredDataSource;
      }else{
        this.filteredAttendedDataSource = this.attendedDataSource.filter((data)=>{
          return data.department === selectedDepartment;
        })
        this.filteredRegisteredDataSource = this.registeredDataSource.filter((data)=>{
          return data.department === selectedDepartment;
        })
      }
    }
    ngOnDestroy() {
      // Unsubscribe from each subscription in the array to prevent memory leaks
      this.subscriptions.forEach(subscription => subscription.unsubscribe());
      this.subscriptions = []; // Clear the subscriptions array
    }
  }
