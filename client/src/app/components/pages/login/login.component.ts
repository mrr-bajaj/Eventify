import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Employee } from 'src/app/models/employee';
import { AuthService } from 'src/app/services/auth/auth.service';
import jwt_decode from 'jwt-decode';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  employee!:Employee;
  validEmail: boolean = false;
  emailNotFound: boolean = false;
  invalidPassword:boolean = false;
  constructor(private authService: AuthService, private router: Router) { }

  validateEmail(email: string){
    const domainPattern = /^[A-Za-z0-9._%+-]+@kongsbergdigital\.com$/i;
    return domainPattern.test(email);
  }

  login(form: NgForm): void {
    this.employee = form.value;
    this.validEmail = false;
    this.emailNotFound = false;
    this.invalidPassword = false;
    if(!this.validateEmail(this.employee.email)){
      this.validEmail = true;
      return ;
    }
    this.authService.login(this.employee)
      .subscribe(
        (response) => {
          // Handle successful login
          if(response.error === 'Email not found'){
            this.emailNotFound = true;
            return;
          }
          if(response.error === 'Invalid password'){
            this.invalidPassword = true;
            return;
          }
          if(response.message === 'Successfully Login'){
            const roles = this.getRolesFromToken(response.token)
            if(roles.includes('admin')){
              this.router.navigate(['admin']);
            }
          }
        },
        (error) => {
          // Handle login error
          console.error(error);
        }
      );
  }

  private getRolesFromToken(token: string): string[] {
    const decodedToken: any = jwt_decode(token);
    return decodedToken.roles;
  }
}
