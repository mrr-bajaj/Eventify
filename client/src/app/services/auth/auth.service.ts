import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import jwt_decode from 'jwt-decode';
import { Employee,EmployeeLoginInfo } from 'src/app/models/employee';
import { environment } from 'src/environments/environment';
import { EmployeeService } from '../employees/employee.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = `${environment.apiUrl}/api/auth`;
  private tokenKey = 'token';


  constructor(private http: HttpClient, private router: Router,private employeeService:EmployeeService) { }

  signup(empData: Employee): Observable<any> {
    if(!empData.profileImagePath)
    {
      empData.profileImagePath=this.employeeService.getRandomGenderImage(empData?.gender);
    }
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
    localStorage.removeItem('email');
    localStorage.removeItem('roles')
    this.router.navigate(['/login']);
  }

  getRolesFromToken(token: string): string[] {
    const decodedToken: any = jwt_decode(token);
    return decodedToken.roles;
  }

  getUserRoles(){
    const token = this.getToken();
    if (token) {
      return this.getRolesFromToken(token);
    }
    return [];
  }
}
