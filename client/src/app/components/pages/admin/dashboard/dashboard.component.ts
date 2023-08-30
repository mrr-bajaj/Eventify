import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { EventModel } from 'src/app/models/event';
import { EmployeeService } from 'src/app/services/employees/employee.service';
import { EventsService } from 'src/app/services/events/events.service';
import { SearchService } from 'src/app/services/search/search.service';
import { faUsers, faCalendar, faHistory, faClock } from '@fortawesome/free-solid-svg-icons';
import { Attendance } from 'src/app/models/attendance';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy{

  upcomingEvents:EventModel[]=[];
  pastEvents:EventModel[]=[];
  searchTerm:string;
  subscriptions: Subscription[]= [];
  totalEmployeeCount: number = 0;
  totalEventCount: number = 0;
  totalUpcomingEventCount: number = 0;
  totalPastEventCount: number = 0;
  allPastEvents: EventModel[]=[];
  attendedData:{label:string,y:number}[] = [];
  registeredData: {label:string,y:number}[] = [];
  icons = [faUsers,faCalendar,faHistory,faClock];
  location:string;
  attendedBarDataMonthly: number[]=Array(12).fill(0);
  registeredBarDataMonthly: number[]=Array(12).fill(0);
  constructor(private eventsService : EventsService,private searchService: SearchService,private employeeService:EmployeeService){}
  
  ngOnInit(): void {
    this.eventsService.locationData$.subscribe(location => {
      this.location = location;
      this.initialize();
    });
  }

  async initialize(){
    this.attendedData = [];
    this.registeredData = [];
    this.attendedBarDataMonthly =Array(12).fill(0);
    this.registeredBarDataMonthly =Array(12).fill(0);
    this.upcomingEvent();
    await this.pastEvent();
    this.search();
    this.getStatsData();
  }

  getStatsData(){
    this.getEmployeeCount();
    this.getEventCount();
  }

  getEmployeeCount(){
    this.employeeService.getEmployees().subscribe(res => {
      if(this.location === 'All'){
        this.totalEmployeeCount = res.length;
      }else{
        this.totalEmployeeCount = res.filter(data => data.location === this.location).length;
      }
    })
  }

  getEventCount(){
    this.totalEventCount = this.eventsService.getTotalEventCount();
    this.totalPastEventCount =this.eventsService.getTotalPastEventCount();
    this.totalUpcomingEventCount = this.eventsService.getTotalUpcomingEventCount();
  }

  upcomingEvent() {
    return new Promise<void>((resolve, reject) => {
      const subs = this.eventsService.getAllUpcomingEvents().subscribe((resData: EventModel[]) => {
        if(this.location === 'All'){
          this.upcomingEvents = resData.slice(0, 1);
        }else{
          this.upcomingEvents = resData.filter(event => event.location === this.location).slice(0,1);
        }
        resolve();
      }, error => {
        reject(error);
      });
      this.subscriptions.push(subs);
    });
  }
  
  async pastEvent() {
    try {
      const resData: EventModel[] = await new Promise((resolve, reject) => {
        const subs = this.eventsService.getAllPastEvents().subscribe((data: EventModel[]) => {
          resolve(data);
        }, error => {
          reject(error);
        });
        this.subscriptions.push(subs);
      });
      if(this.location === 'All'){
        this.allPastEvents = resData;
      }else{
        this.allPastEvents = resData.filter(event => event.location === this.location);
      }
      await this.getLineChartData();
      this.pastEvents = this.allPastEvents.slice(0, 2);
    } catch (error) {
      console.error(error);
    }
  }

  // async getLineChartData(){
  //   for (let event of this.allPastEvents) {
  //     await this.getAttendedData(event);
  //     await this.getRegisteredData(event);
  //   }
  //   this.eventsService.sendLineDataEvent(true);
  // }
  // async getAttendedData(event: EventModel){
  //   const date = new Date(event.date);
  //   const month = date.getMonth() ;
  //   let pastEventAttendanceData: {label:string,y:number} = {label: '', y: 0};
  //     pastEventAttendanceData.label = event.name;
  //     const attendance = await this.eventsService.getAttendance(event.id).toPromise();
  //     const attendanceCount = attendance.employees.length
  //     pastEventAttendanceData.y = attendanceCount;
  //     this.attendedData.push(pastEventAttendanceData);
  //     this.attendedBarDataMonthly[month]+=attendanceCount;
  // }

  // async getRegisteredData(event: EventModel){
  //   const date = new Date(event.date);
  //   const month = date.getMonth() ;
  //   let pastEventRegisteredData: {label:string,y:number} = {label: '', y: 0};
  //     pastEventRegisteredData.label = event.name;
  //     const registeration = await this.eventsService.getRegistration(event.id).toPromise();
  //     const registrationCount = registeration.employees.length
  //     pastEventRegisteredData.y = registrationCount;
  //     this.registeredData.push(pastEventRegisteredData);
  //     this.registeredBarDataMonthly[month]+=registrationCount;
  // }

  async getLineChartData() {
    const attendedPromises = this.allPastEvents.map(event => this.eventsService.getAttendance(event.id).toPromise());
    const registeredPromises = this.allPastEvents.map(event => this.eventsService.getRegistration(event.id).toPromise());
  
    // Wait for all attended and registered data to be fetched
    await Promise.all([Promise.all(attendedPromises),Promise.all(registeredPromises)])
    .then(([attendedItemValues,registeredItemValues])=>{
      for(let i=0;i<attendedItemValues.length;i++){
        this.getAttendedData(attendedItemValues[i],this.allPastEvents[i]);
        this.getRegisteredData(registeredItemValues[i],this.allPastEvents[i]);
      }
    })
    
    // Now, both attendedData and registeredData arrays should be populated correctly
  
    this.eventsService.sendLineDataEvent(true);
  }
  
  async getAttendedData(attendance:Attendance,event:EventModel){
    const date = new Date(event.date);
    const month = date.getMonth() ;
    let pastEventAttendanceData: {label:string,y:number} = {label: '', y: 0};
      pastEventAttendanceData.label = event.name;
      const attendanceCount = attendance.employees.length
      pastEventAttendanceData.y = attendanceCount;
      this.attendedData.push(pastEventAttendanceData);
      this.attendedBarDataMonthly[month]+=attendanceCount;
  }

  async getRegisteredData(registeration:Attendance,event: EventModel){
    const date = new Date(event.date);
    const month = date.getMonth() ;
    let pastEventRegisteredData: {label:string,y:number} = {label: '', y: 0};
      pastEventRegisteredData.label = event.name;
      const registrationCount = registeration.employees.length
      pastEventRegisteredData.y = registrationCount;
      this.registeredData.push(pastEventRegisteredData);
      this.registeredBarDataMonthly[month]+=registrationCount;
  }
  

  search(){
    const subs = this.searchService.searchData.subscribe(data => {
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
