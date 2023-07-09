import {  Component, Input } from '@angular/core';
import { EmployeeService } from 'src/app/services/employees/employee.service';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent{
  @Input() displayedColumns: string[];
  @Input() dataSource: any[];

  constructor(private employeeService : EmployeeService){}

  
  onDelete(rowData:any){
    this.employeeService.deleteAdminByEmail(rowData.email)
    .subscribe((res)=>{
      if(res.message === 'Admin role deleted'){
        window.location.reload(); //TODO - Change the way
      }
    });
  }
}
