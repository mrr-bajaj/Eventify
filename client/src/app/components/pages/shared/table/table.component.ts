import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { EmployeeService } from 'src/app/services/employees/employee.service';
import { SearchPipe } from '../search/search.pipe';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit, OnChanges{
  @Input() displayedColumns: string[];
  @Input() dataSource: any[];
  filteredData:any[];
  @Input() searchTerm : string;
  constructor(private employeeService : EmployeeService,private searchPipe: SearchPipe){}
  
  ngOnInit(): void {
    this.filteredData = this.dataSource;
  }

  ngOnChanges(changes: SimpleChanges){
    if(changes){
      this.onSearch();
    }
  }
  
  onDelete(rowData:any){
    this.employeeService.deleteAdminByEmail(rowData.email)
    .subscribe((res)=>{
      if(res.message === 'Admin role deleted'){
        window.location.reload(); //TODO - Change the way
      }
    });
  }

  onSearch(){
    this.filteredData = this.searchPipe.transform(this.dataSource, this.searchTerm, ['name', 'email']);
  }
}
