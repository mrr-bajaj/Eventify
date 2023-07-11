import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  constructor() { }
  private searchSubject = new Subject<any>();
  public searchData = this.searchSubject.asObservable();

  sendSearchData(data: any) {
    this.searchSubject.next(data);
  }

}
