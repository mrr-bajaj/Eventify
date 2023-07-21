import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { EventsService } from 'src/app/services/events/events.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  defaultLocation:string = 'All';
  locationOptions = ['All','India', 'Norway'];
  constructor(private authService: AuthService,private router:Router,private eventsService:EventsService){}

  onLogout(){
    this.authService.logout();
  }

  onSelectLocation(event:any){
    const selectedLocation = event.target.value;
    this.eventsService.sendLocationData(selectedLocation);
  }
}
