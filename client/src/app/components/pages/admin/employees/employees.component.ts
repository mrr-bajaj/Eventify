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
  constructor(private employeeService: EmployeeService) { }

  ngOnInit() {
    this.getEmployees();
  }

  getEmployees() {
    this.employees = this.employeeService.getEmployees();
  }

  addEmployee(emp: Employee) {
    this.employeeService.addEmployee(emp);
    this.getEmployees(); // Refresh the employee list after adding a new employee
  }

 /* deleteEmployee(empId: string) {
    this.employeeService.deleteEmployee(empId);
    this.getEmployees(); // Refresh the employee list after deleting an employee
  }*/
}
