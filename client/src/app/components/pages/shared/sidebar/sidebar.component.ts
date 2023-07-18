import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit{
  username: string;
  roles:String[];
  ngOnInit(): void {
    this.username = localStorage.getItem('username');
    this.roles = localStorage.getItem('roles')?.split(',') || [];
  }

}
