import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Employee } from 'src/app/models/employee';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:3000/api/auth';

  constructor(private http: HttpClient) {}

  signup(empData: Employee): Observable<any> {
    return this.http.post(`${this.baseUrl}/signup`, empData);
  }

  login(empData: Employee): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, empData);
  }
}
