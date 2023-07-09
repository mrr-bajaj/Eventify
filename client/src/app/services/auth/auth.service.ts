import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Employee,EmployeeLoginInfo } from 'src/app/models/employee';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticated: boolean = false;
  private baseUrl = 'http://localhost:3000/api/auth';

  constructor(private http: HttpClient) {}

  signup(empData: Employee): Observable<any> {
    return this.http.post(`${this.baseUrl}/signup`, empData);
  }

  login(empLoginInfo: EmployeeLoginInfo): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, empLoginInfo);
  }

  setAuth(){
    this.isAuthenticated = !this.isAuthenticated;
  }

  isRouteAuthenticated(){
    return this.isAuthenticated;
  }
}
