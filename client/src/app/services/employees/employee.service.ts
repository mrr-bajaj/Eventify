import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Employee } from 'src/app/models/employee';
import jwt_decode from 'jwt-decode';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private baseUrl = `${environment.apiUrl}/api/employees`;
  
  private adminRoleSubject = new BehaviorSubject<boolean>(true);
  adminRoleUpdate$ = this.adminRoleSubject.asObservable();

  genderImages = {
    male: ['assets/images/male-1.png', 'assets/images/male-2.png'],
    female: ['assets/images/female-1.png', 'assets/images/female-2.png'],
    other: ['assets/images/other-1.png', 'assets/images/other-2.png'],
  };

  constructor(private http:HttpClient) { }

  getEmployees():Observable<Employee[]> {
    return this.http.get<Employee[]>(`${this.baseUrl}`);
  }

  sendAdminRoleData(){
    this.adminRoleSubject.next(true);
  }

  getEmployeeByEmail(email:string):Observable<Employee | any>{
    return this.http.get<Employee>(`${this.baseUrl}/${email}`);
  }

  getAdmins(){
    return this.http.get<{email:string,name:string,department:string,location:string}[]>(`${this.baseUrl}/admin`);
  }

  deleteAdminByEmail(email:string,adminEmail:string){
    return this.http.delete<{message:string}>(`${this.baseUrl}/admin/${email}`,{params: {adminEmail}});
  }

  addAdminByEmail(email:string,adminEmail:string){
    return this.http.put<any>(`${this.baseUrl}/admin`,{email,adminEmail});
  }

  getEmployeeEmailFromToken() {
    const decodedToken: any = jwt_decode(localStorage.getItem('token'));
    return decodedToken.email;
  }

  getRandomGenderImage(gender: string): string {
    if (!gender)
      return 'assets/images/employee-placeholder-img.png';
    const images = this.genderImages[gender.toLowerCase()];
    if (images && images.length > 0) {
      const randomIndex = Math.floor(Math.random() * images.length);
      return images[randomIndex];
    } else {
      return 'assets/images/employee-placeholder-img.png';
    }
}
}
