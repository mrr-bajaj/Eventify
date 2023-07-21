import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Employee } from 'src/app/models/employee';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private baseUrl = 'http://localhost:3000/api/employees';
  constructor(private http:HttpClient) { }

  getEmployees():Observable<Employee[]> {
    return this.http.get<Employee[]>(`${this.baseUrl}`);
  }

  getEmployeeByEmail(email:string):Observable<Employee | any>{
    return this.http.get<Employee>(`${this.baseUrl}/${email}`);
  }

  getAdmins(){
    return this.http.get<{email:string,name:string,department:string,location:string}[]>(`${this.baseUrl}/admin`);
  }

  deleteAdminByEmail(email:string){
    return this.http.delete<{message:string}>(`${this.baseUrl}/admin/${email}`);
  }

  addAdminByEmail(email:string){
    return this.http.put<any>(`${this.baseUrl}/admin`,{email});
  }
}
