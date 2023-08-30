import { Component, Input, OnInit, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { EmployeeService } from 'src/app/services/employees/employee.service';
import { SearchPipe } from '../search/search.pipe';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';

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


onDelete(rowData: any) {
  const adminEmail = this.employeeService.getEmployeeEmailFromToken();
  if (rowData.email === adminEmail) {
    Swal.fire({
      icon: 'warning',
      title: 'Oops...',
      text: "You Can't Remove Your Own Admin Access!",
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'OK',
    });
  } else {
    Swal.fire({
      title: 'Are you sure?',
      text: `You are about to remove admin access of ${rowData.name}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        const subs = this.employeeService.deleteAdminByEmail(rowData.email, adminEmail).subscribe((res) => {
          if (res.message === 'Admin role deleted') {
            this.employeeService.sendAdminRoleData();
          }
        });
        this.subscriptions.push(subs);
      }
    });
  }
}

  onSearch(){
    this.filteredData = this.searchPipe.transform(this.dataSource, this.searchTerm, ['name', 'email']);

    if(this.filteredData){
      let srNo=1;
      this.filteredData.forEach(data => {
        data.srNo = srNo;
        srNo++;
      })
    }
  }

  ngOnDestroy() {
    // Unsubscribe from each subscription in the array to prevent memory leaks
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
    this.subscriptions = []; // Clear the subscriptions array
  }
}
