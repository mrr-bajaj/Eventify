import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeLoginInfo } from 'src/app/models/employee';
import { AuthService } from 'src/app/services/auth/auth.service';
import jwt_decode from 'jwt-decode';
import { EventsService } from 'src/app/services/events/events.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy{
  employeeLoginInfo!:EmployeeLoginInfo;
  validEmail: boolean = false;
  emailNotFound: boolean = false;
  invalidPassword:boolean = false;
  subscriptions: Subscription[]=[];
  constructor(private authService: AuthService, private router: Router,private route: ActivatedRoute,private eventsService: EventsService) { }
  eventId: string = '';

  ngOnInit(): void {
    this.getEventId();
  }

  getEventId(){
    const subs = this.route.queryParams.subscribe(params =>{
      if(params['id']){
        this.eventId = params['id'];
      }
    })
    this.subscriptions.push(subs);
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

  login(form: NgForm): void {
    this.employeeLoginInfo = form.value;
    this.validEmail = false;
    this.emailNotFound = false;
    this.invalidPassword = false;
    if(!this.validateEmail(this.employeeLoginInfo.email)){
      this.validEmail = true;
      return ;
    }
    const subs = this.authService.login(this.employeeLoginInfo)
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
            const roles = this.getRolesFromToken(response.token);
            if(roles.includes('admin') && !this.eventId){
              this.authService.setToken(response.token);
              localStorage.setItem('username',response.name);
              this.router.navigate(['admin']);
            }else if(roles.includes('user')){
              const subs = this.eventsService.addAttendance(this.employeeLoginInfo.email,this.eventId).subscribe((res)=>{
                if(res.message === 'Attendance saved successfully'){
                  form.reset();
                  alert('Attendance Saved Successfully!');
                }else if(res.message === 'Already attended'){
                  form.reset();
                  alert('You\'ve have already attended the event!');
                }
              },(error)=>{
                console.log(error)
              });
              this.subscriptions.push(subs);
            }
          }
        },
        (error) => {
          // Handle login error
          console.error(error);
        }
      );
    this.subscriptions.push(subs);
  }

  private getRolesFromToken(token: string): string[] {
    const decodedToken: any = jwt_decode(token);
    return decodedToken.roles;
  }

  ngOnDestroy() {
    // Unsubscribe from each subscription in the array to prevent memory leaks
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
    this.subscriptions = []; // Clear the subscriptions array
  }
}
