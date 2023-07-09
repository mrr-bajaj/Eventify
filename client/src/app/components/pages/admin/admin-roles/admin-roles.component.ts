import { Component, OnInit, } from '@angular/core';
import { EmployeeService } from 'src/app/services/employees/employee.service';

@Component({
  selector: 'app-admin-roles',
  templateUrl: './admin-roles.component.html',
  styleUrls: ['./admin-roles.component.css']
})
export class AdminRolesComponent implements OnInit{
  displayedColumns: string[] = ['srNo', 'name', 'email', 'action'];
  dataSource: any[] = [];

  constructor(private employeeService: EmployeeService){}

  ngOnInit(): void {
      this.initialize();
  }
  
  initialize(){
    this.employeeService.getAdmins().
    subscribe((res)=>{
      this.dataSource = res;
      for(let i in this.dataSource){
        this.dataSource[i].srNo = (+i) +1;
        this.dataSource[i].action = 'Admin';
      }
    })
  }
}
