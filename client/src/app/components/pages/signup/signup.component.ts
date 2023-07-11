import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgForm } from '@angular/forms';
import { Employee } from 'src/app/models/employee';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit, OnDestroy{
  employee: Employee;
  existingEmail: boolean =false;
  validEmail: boolean =false;
  subscriptions: Subscription[]=[];
  eventId:string;
  constructor(private authService: AuthService, private router: Router,private route:ActivatedRoute) {  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.eventId = params['id'];
    })
  }

  getQueryParams(){
    if(this.eventId){
      return {id: this.eventId};
    }else{
      return null;
    }
  }
  
  validateEmail(email: string){
    const domainPattern = /^[A-Za-z0-9._%+-]+@kongsbergdigital\.com$/i;
    return domainPattern.test(email);
  }

  signup(form:NgForm): void {
    this.employee = form.value;
    this.existingEmail = false;
    this.validEmail = false;
    if(!this.validateEmail(this.employee.email)){
      this.validEmail = true;
      return ;
    }
    const subs = this.authService.signup(this.employee)
      .subscribe(
        (response) => {
          // Handle successful registration
          if(response.error === 'Email already registered'){
            this.existingEmail =true;
          }
          if(response.message === 'Employee registered successfully'){
            this.router.navigate(['/login'])
          }
        },
        (error) => {
          // Handle registration error
          console.log(error);
        }
      );
    this.subscriptions.push(subs);
  }

  ngOnDestroy() {
    // Unsubscribe from each subscription in the array to prevent memory leaks
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
    this.subscriptions = []; // Clear the subscriptions array
  }
}
