import { Component, Input, OnInit, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { EmployeeService } from 'src/app/services/employees/employee.service';
import { SearchPipe } from '../search/search.pipe';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit, OnChanges, OnDestroy{
  @Input() displayedColumns: string[];
  @Input() dataSource: any[];
  @Input() searchTerm : string;
  filteredData:any[];
  subscriptions: Subscription[]=[];
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
    const subs = this.employeeService.deleteAdminByEmail(rowData.email)
    .subscribe((res)=>{
      if(res.message === 'Admin role deleted'){
        window.location.reload(); //TODO - Change the way
      }
    });
    this.subscriptions.push(subs);
  }

  onSearch(){
    this.filteredData = this.searchPipe.transform(this.dataSource, this.searchTerm, ['name', 'email']);
  }

  ngOnDestroy() {
    // Unsubscribe from each subscription in the array to prevent memory leaks
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
    this.subscriptions = []; // Clear the subscriptions array
  }
}
