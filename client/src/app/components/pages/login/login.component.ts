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
  validEmail: boolean = true;
  emailNotFound: boolean = false;
  invalidPassword:boolean = false;
  subscriptions: Subscription[]=[];
  constructor(private authService: AuthService, private router: Router,private route: ActivatedRoute,private eventsService: EventsService) { }
  eventId: string = '';
  buttonSubmitName:string = 'Login';

  ngOnInit(): void {
    this.getEventId();
  }

  getEventId(){
    this.route.url.subscribe(segments => {
      const action = segments[0]?.path;
      const subs = this.route.queryParams.subscribe(params =>{
        if(params['id']){
          this.eventId = params['id'];
        }
      })
      this.subscriptions.push(subs);
      if (action && this.eventId) {
        if (action === 'login') {
            this.buttonSubmitName = 'Attend';

        } else if (action === 'register') {
          this.buttonSubmitName = 'Register';
        }
      }
    });
  }

  validateEmail(email: string):boolean{
    const domainPattern = /^[A-Za-z0-9._%+-]+@kongsbergdigital\.com$/i;
    return domainPattern.test(email);
  }

  login(form: NgForm): void {
    this.employeeLoginInfo = form.value;
    this.validEmail = true;
    this.emailNotFound = false;
    this.invalidPassword = false;
    if(!this.validateEmail(this.employeeLoginInfo.email)){
      this.validEmail = false;
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
          if(response.message === 'Successful Login'){
            const roles = this.getRolesFromToken(response.token);
            this.authService.setToken(response.token);
            localStorage.setItem('username',response.name);
            localStorage.setItem('roles',response.roles);
           // this.router.navigate(['admin']);
            if(roles.includes('admin') && !this.eventId){
              this.router.navigate(['admin']);
            }else if(roles.includes('user')){
              this.router.navigate(['user']);
             if(this.buttonSubmitName === 'Register'){
                const subs = this.eventsService.addRegistration(this.employeeLoginInfo.email,this.eventId).subscribe((res)=>{
                  if(res.message === 'Registered event successfully'){
                    form.reset();
                    alert('You\'ve Successfully Registered For The Event!\nSee You There!!!');
                  }else if(res.message === 'Already registered'){
                    form.reset();
                    alert('You\'ve Already Registered For The Event!');
                  }
                },(error)=>{
                  console.log(error)
                });
                this.subscriptions.push(subs);
              }else if(this.buttonSubmitName === 'Attend'){
                const subs = this.eventsService.addAttendance(this.employeeLoginInfo.email,this.eventId).subscribe((res)=>{
                  if(res.message === 'Attendance saved successfully'){
                    form.reset();
                    alert('Yuppppp!!!! Congratzzzz!!\nYou\'re Attendance Saved Successfully!');
                  }else if(res.message === 'Already attended'){
                    form.reset();
                    alert('Your Attendance Is Already Marked For The Event!\nSee You There!!');
                  }
                },(error)=>{
                  console.log(error)
                });
                this.subscriptions.push(subs);
              }
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

  onSignUp(){
    if(this.eventId){
      if(this.buttonSubmitName === 'Attend'){
        this.router.navigate(['/signup'],{queryParams:{id:this.eventId,name:'attend'}});
      }else{
        this.router.navigate(['/signup'],{queryParams:{id:this.eventId,name:'register'}});
      }
    }else{
      this.router.navigate(['/signup'])
    }
  }
  
  ngOnDestroy() {
    // Unsubscribe from each subscription in the array to prevent memory leaks
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
    this.subscriptions = []; // Clear the subscriptions array
  }
}
