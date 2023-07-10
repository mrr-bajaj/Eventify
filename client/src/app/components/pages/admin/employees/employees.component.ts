import { Component,OnInit} from '@angular/core';
import { Employee } from 'src/app/models/employee';
import { EmployeeService } from 'src/app/services/employees/employee.service';


@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.css']
})

export class EmployeesComponent implements OnInit {

  employees:Employee[]=[];
  searchTerm:string;
  constructor(private employeeService: EmployeeService) { }

  ngOnInit() {
    this.employeeService.getEmployees().subscribe(
      (data: Employee[]) => {
        this.employees = data;
      },
      (error) => {
        console.error(error);
      }
    )
  }

  onSearch(searchData:string){
    this.searchTerm = searchData;
  }

}
