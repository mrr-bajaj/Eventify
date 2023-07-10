import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Employee } from 'src/app/models/employee';
import { EmployeeService } from 'src/app/services/employees/employee.service';
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
  constructor(private employeeService: EmployeeService, private searchService: SearchService) { }

  ngOnInit() {
    this.initialize();
    this.search();
  }

  initialize(){
    const subs =this.employeeService.getEmployees().subscribe(
      (data: Employee[]) => {
        this.employees = data;
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

  ngOnDestroy() {
    // Unsubscribe from each subscription in the array to prevent memory leaks
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
    this.subscriptions = []; // Clear the subscriptions array
  }

}
