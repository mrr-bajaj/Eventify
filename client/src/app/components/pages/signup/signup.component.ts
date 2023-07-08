import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { NgForm } from '@angular/forms';
import { Employee } from 'src/app/models/employee';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  employee: Employee;
  existingEmail: boolean =false;
  validEmail: boolean =false;

  constructor(private authService: AuthService, private router: Router) {  }

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
    this.authService.signup(this.employee)
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
  }
}
