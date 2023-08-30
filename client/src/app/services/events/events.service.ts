import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, tap } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EventsService {
  
  private baseUrl = `${environment.apiUrl}/api/events`;
  private pieUpdateSubject = new Subject<boolean>();
  private LineUpdateSubject = new Subject<boolean>();
  private totalUpcomingEventCount: number = 0;
  private totalPastEventCount: number = 0;
  private locationDataSubject = new BehaviorSubject<string>('All');
  private eventUpdateSubject = new BehaviorSubject<boolean>(true);
  location:string = 'All';
  locationData$ = this.locationDataSubject.asObservable();
  eventUpdate$ = this.eventUpdateSubject.asObservable();

  constructor(private http: HttpClient,private datePipe: DatePipe) {}

  sendLocationData(newLocation: string) {
    this.location = newLocation;
    this.locationDataSubject.next(newLocation);
  }

  sendEventData(){
    this.eventUpdateSubject.next(true);
  }

  sendPieDataEvent(data: boolean) {
    this.pieUpdateSubject.next(data);
  }

  getPieDataEvent() {
    return this.pieUpdateSubject.asObservable();
  }
  
  sendLineDataEvent(data: boolean) {
    this.LineUpdateSubject.next(data);
  }

  getLineDataEvent() {
    return this.LineUpdateSubject.asObservable();
  }
  
  addEvent(event:any): Observable<any>{
    return this.http.post(`${this.baseUrl}/add-event`,event);
  }

  editEvent(eventId: string, event: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/edit-event/${eventId}`, event);
  }

  deleteEvent(eventId: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/delete-event/${eventId}`);
  }

  getAllUpcomingEvents(): Observable<any>{
    const date = this.datePipe.transform(new Date(), 'dd MMM yyyy');
    return this.http.get(`${this.baseUrl}/upcoming-event?date=${date}`)
        .pipe(tap(resData => {
        // Compare function for sorting by date property
        const compareDates = (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime();

        // Sort the array by the date property 
        let filteredData = resData.sort(compareDates);

        if(this.location !== 'All'){
          filteredData = resData.filter((data)=>{ 
            return data.location === this.location
          });
        }
        this.totalUpcomingEventCount = filteredData.length;
    }));
  }

  getAllPastEvents(): Observable<any>{
    const date = this.datePipe.transform(new Date(), 'dd MMM yyyy');
    return this.http.get(`${this.baseUrl}/past-event?date=${date}`)
    .pipe(tap(resData => {
      // Compare function for sorting by date property
      const compareDates = (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime();

      // Sort the array by the date property
      let filteredData = resData.sort(compareDates);

        if(this.location !== 'All'){
          filteredData = resData.filter((data)=>{ 
            return data.location === this.location
          });
        }
      this.totalPastEventCount = filteredData.length;
    }));
  }

  getEventById(id: string): Observable<any>{
    return this.http.get(`${this.baseUrl}/${id}`);
  }

  addRegistration(email:string,eventId: string):Observable<any>{
    return this.http.post(`${this.baseUrl}/register/${eventId}`,{email});
  }

  addAttendance(email:string, eventId: string): Observable<any>{
    var today = new Date();
    var time = today.getHours() + ":" + today.getMinutes();
    return this.http.post(`${this.baseUrl}/attendance/${eventId}`,{email,time});
  }

  getAttendance(eventId: string):Observable<any>{
    return this.http.get(`${this.baseUrl}/attendance/${eventId}`);
  }

  getRegistration(eventId: string):Observable<any>{
    return this.http.get(`${this.baseUrl}/register/${eventId}`);
  }

  getAllAttendedEventsOfEmployeeByEmail(email:string):Observable<any>{
    return this.http.get(`${this.baseUrl}/attendance/employee/${email}`);
  }

  getAllRegisteredEventsOfEmployeeByEmail(email:string):Observable<any>{
    return this.http.get(`${this.baseUrl}/register/employee/${email}`);
  }

  getTotalEventCount(){
    return this.totalPastEventCount + this.totalUpcomingEventCount;
  }

  getTotalPastEventCount(){
    return this.totalPastEventCount;
  }

  getTotalUpcomingEventCount(){
    return this.totalUpcomingEventCount;
  }
}
