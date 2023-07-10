import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent {
  searchTerm: string;
  @Output() searchUpdated: EventEmitter<string> = new EventEmitter<string>();

  search(): void {
    this.searchUpdated.emit(this.searchTerm);
  }
}
