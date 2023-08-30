import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Employee } from 'src/app/models/employee';
import { EmployeeService } from 'src/app/services/employees/employee.service';
import { EventsService } from 'src/app/services/events/events.service';
import { SearchService } from 'src/app/services/search/search.service';


@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.css']
})

export class EmployeesComponent implements OnInit,OnDestroy {

  employees:Employee[]=[];
  searchTerm:string;
  subscriptions: Subscription[]=[];
  location: string;
  constructor(private employeeService: EmployeeService, private searchService: SearchService, private router: Router, private route: ActivatedRoute, private eventsService: EventsService) { }

  ngOnInit() {
    this.eventsService.locationData$.subscribe(location => {
      this.location = location;
      this.initialize();
    });
    this.search();
  }

  initialize(){
    const subs =this.employeeService.getEmployees().subscribe(
      (data: Employee[]) => {
        if(this.location === 'All'){
          this.employees = data;
        }else{
          this.employees = data.filter(data => data.location === this.location);
        }
      },
      (error) => {
        console.error(error);
      }
    )
    this.subscriptions.push(subs);
  }

  search(){
    const subs = this.searchService.searchData.subscribe(data => {
      this.searchTerm = data;
    })
    this.subscriptions.push(subs);
  }

  viewDetail(index:number){
    this.router.navigate([this.employees[index].email],{relativeTo: this.route});
  }

  ngOnDestroy() {
    // Unsubscribe from each subscription in the array to prevent memory leaks
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
    this.subscriptions = []; // Clear the subscriptions array
  }

}
