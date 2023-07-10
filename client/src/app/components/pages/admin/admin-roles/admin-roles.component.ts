import { Component, OnInit, } from '@angular/core';
import { NgForm } from '@angular/forms';
import { EmployeeService } from 'src/app/services/employees/employee.service';

@Component({
  selector: 'app-admin-roles',
  templateUrl: './admin-roles.component.html',
  styleUrls: ['./admin-roles.component.css']
})
export class AdminRolesComponent implements OnInit{
  displayedColumns: string[] = ['srNo', 'name', 'email', 'action'];
  dataSource: any[] = [];
  addEmail: string;
  validEmail:boolean = false;
  emailNotFound: boolean = false;
  searchTerm:string;
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

  onAddAdmin(form: NgForm){
    this.validEmail = false;
    this.emailNotFound = false;
    this.addEmail = form.value.email;
    if(!this.validateEmail(this.addEmail)){
      this.validEmail = true;
      return;
    }
    this.getEmployeeEmail();
    form.reset();
  }

  getEmployeeEmail(){
    this.employeeService.getEmployeeByEmail(this.addEmail)
    .subscribe((res)=>{
      if(res.message === 'User not found'){
        this.emailNotFound = true;
        return;
      }
      this.addAdmin();
    })
  }

  addAdmin(){
    this.employeeService.addAdminByEmail(this.addEmail).
      subscribe((res)=>{
        if(res.message === 'Admin role added'){
          this.initialize();
        }
      })
  }

  validateEmail(email: string){
    const domainPattern = /^[A-Za-z0-9._%+-]+@kongsbergdigital\.com$/i;
    return domainPattern.test(email);
  }

  onSearch(searchData:string){
    this.searchTerm = searchData;
  }
}
