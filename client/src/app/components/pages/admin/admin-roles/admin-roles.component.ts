import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { EmployeeService } from 'src/app/services/employees/employee.service';
import { SearchService } from 'src/app/services/search/search.service';

@Component({
  selector: 'app-admin-roles',
  templateUrl: './admin-roles.component.html',
  styleUrls: ['./admin-roles.component.css']
})
export class AdminRolesComponent implements OnInit, OnDestroy{
  displayedColumns: string[] = ['srNo', 'name', 'email','department', 'action'];
  dataSource: any[] = [];
  addEmail: string;
  validEmail:boolean = true;
  emailNotFound: boolean = false;
  searchTerm:string;
  subscriptions: Subscription[] = [];

  constructor(private employeeService: EmployeeService,private searchService:SearchService){}

  ngOnInit(): void {
      this.initialize();
  }

  initialize(){
    this.getAdmin();
    this.search();
  }

  getAdmin(){
    const subs = this.employeeService.getAdmins().
    subscribe((res)=>{
      this.dataSource = res;
      for(let i in this.dataSource){
        this.dataSource[i].srNo = (+i) +1;
        this.dataSource[i].action = 'Admin';
      }
    })
    this.subscriptions.push(subs);
  }

  onAddAdmin(form: NgForm){
    this.validEmail = true;
    this.emailNotFound = false;
    this.addEmail = form.value.email;
    if(!this.validateEmail(this.addEmail)){
      this.validEmail = false;
      return;
    }
    this.getEmployeeEmail();
    form.reset();
  }

  getEmployeeEmail(){
    const subscription = this.employeeService.getEmployeeByEmail(this.addEmail)
    .subscribe((res)=>{
      if(res.message === 'User not found'){
        this.emailNotFound = true;
        return;
      }
      this.addAdmin();
    })
    this.subscriptions.push(subscription);
  }

  addAdmin(){
    const subs = this.employeeService.addAdminByEmail(this.addEmail).
      subscribe((res)=>{
        if(res.message === 'Admin role added'){
          this.initialize();
        }
      })
    this.subscriptions.push(subs);
  }

  validateEmail(email: string){
    const domainPattern = /^[A-Za-z0-9._%+-]+@kongsbergdigital\.com$/i;
    return domainPattern.test(email);
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
