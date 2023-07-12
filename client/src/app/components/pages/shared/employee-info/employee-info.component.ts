import { DatePipe } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { EventsService } from 'src/app/services/events/events.service';
import { SearchService } from 'src/app/services/search/search.service';

@Component({
  selector: 'app-employee-info',
  templateUrl: './employee-info.component.html',
  styleUrls: ['./employee-info.component.css']
})
export class EmployeeInfoComponent implements OnInit, OnDestroy{
  displayedColumns: string[] = ['srNo', 'name', 'date', 'time'];
  dataSource: any[];
  empEmail: string;
  searchTerm:string;
  subscriptions:Subscription[]=[];
  constructor(private route: ActivatedRoute,private eventsService:EventsService,private datePipe:DatePipe,private searchService:SearchService){}
  ngOnInit(): void {
    this.initialize();
    this.search();
  }

  initialize(){
    this.getParamEmail();
    this.getAttendedEventDetails();
  }

  getParamEmail(){
    const subs =this.route.paramMap.subscribe(params =>{
      this.empEmail = params.get('id');
    })
    this.subscriptions.push(subs);
  }

  getAttendedEventDetails(){
    const subs = this.eventsService.getAllAttendendEventsOfEmployeeByEmail(this.empEmail)
    .subscribe(resData => {
      this.dataSource = resData;
      for(let i in resData){
        this.dataSource[i].date = this.convertDate(this.dataSource[i].date);
        this.dataSource[i].time = this.convertTime(this.dataSource[i].time);
        this.dataSource[i].srNo = (+i)+1;
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
