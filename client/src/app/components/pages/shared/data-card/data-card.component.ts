import { Component } from '@angular/core';

@Component({
  selector: 'app-data-card',
  templateUrl: './data-card.component.html',
  styleUrls: ['./data-card.component.css']
})
export class DataCardComponent {
  title: string = 'Attended Employees';
  value: number = 5; 
}
