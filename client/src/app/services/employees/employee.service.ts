import { Injectable } from '@angular/core';
import { Employee } from 'src/app/models/employee';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private employees: Employee[] = [{ "email": "sha@kongsbergdigital.com", "name": "Sha", "department": "Digital Energy", "profileImagePath": "https://loremflickr.com/320/240" }, { "email": "lini@kongsbergdigital.com", "name": "Lini", "department": "Digital Energy" }, { "email": "shu@kongsbergdigital.com", "name": "Shu", "department": "Digital Energy", "profileImagePath": "https://loremflickr.com/320/240" }, { "email": "bham@kongsbergdigital.com", "name": "Bham", "department": "Digital Energy" }];

  constructor() { }

  getEmployees(): Employee[] {
    return this.employees;
  }

  addEmployee(emp: Employee) {
    this.employees.push(emp);
  }

  /*deleteEmployee(empId: string) {
    const index = this.employees.findIndex(emp => emp.id === empId);
    if (index !== -1) {
      this.employees.splice(index, 1);
    }
  }*/
}
