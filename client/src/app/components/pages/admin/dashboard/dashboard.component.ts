import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { EventModel } from 'src/app/models/event';
import { EmployeeService } from 'src/app/services/employees/employee.service';
import { EventsService } from 'src/app/services/events/events.service';
import { SearchService } from 'src/app/services/search/search.service';

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
  constructor(private eventsService : EventsService,private searchService: SearchService,private employeeService:EmployeeService){}
  
  ngOnInit(): void {
    this.initialize();
  }

  async initialize(){
    await this.upcomingEvent();
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
      this.totalEmployeeCount = res.length;
    })
  }

  getEventCount(){
    this.totalEventCount = this.eventsService.getTotalEventCount();
    this.totalPastEventCount =this.eventsService.getTotalPastEventCount();
    this.totalUpcomingEventCount = this.eventsService.getTotalUpcomingEventCount();
  }

  async upcomingEvent() {
    return new Promise<void>((resolve, reject) => {
      const subs = this.eventsService.getAllUpcomingEvents().subscribe((resData: EventModel[]) => {
        this.upcomingEvents = resData.slice(0, 1);
        resolve();
      }, error => {
        reject(error);
      });
      this.subscriptions.push(subs);
    });
  }
  
  async pastEvent() {
    return new Promise<void>((resolve, reject) => {
      const subs = this.eventsService.getAllPastEvents().subscribe((resData: EventModel[]) => {
        this.pastEvents = resData.slice(0, 2);
        resolve();
      }, error => {
        reject(error);
      });
      this.subscriptions.push(subs);
    });
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
