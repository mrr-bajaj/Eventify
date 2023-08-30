import { Component, OnInit } from '@angular/core';
import jwt_decode from 'jwt-decode';
import { EmployeeService } from 'src/app/services/employees/employee.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit{
  username: string;
  roles:String[];
 loggedInEmpEmail:string;
 constructor(private employeeService:EmployeeService){}
  ngOnInit(): void {
    this.username = localStorage.getItem('username');
    this.roles = localStorage.getItem('roles')?.split(',') || [];
    this.loggedInEmpEmail=this.employeeService.getEmployeeEmailFromToken();
  }
}
