import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Employee,EmployeeLoginInfo } from 'src/app/models/employee';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:3000/api/auth';
  private tokenKey = 'token';

  constructor(private http: HttpClient,private router:Router) {}

  signup(empData: Employee): Observable<any> {
    return this.http.post(`${this.baseUrl}/signup`, empData);
  }

  login(empLoginInfo: EmployeeLoginInfo): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, empLoginInfo);
  }

  setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem('username');
    this.router.navigate(['/login']);
  }
}
