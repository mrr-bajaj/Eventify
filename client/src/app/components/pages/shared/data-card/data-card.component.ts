import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-data-card',
  templateUrl: './data-card.component.html',
  styleUrls: ['./data-card.component.css']
})
export class DataCardComponent {
  @Input() title: string = 'Attended Employees';
  @Input() value: number = 5; 
  @Input() icon: any = null;
}
