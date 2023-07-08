import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/pages/login/login.component';
import { SignupComponent } from './components/pages/signup/signup.component';
import { AdminComponent } from './components/pages/admin/admin.component';
import { DashboardComponent } from './components/pages/admin/dashboard/dashboard.component';
import { EventsComponent } from './components/pages/admin/events/events.component';
import { EmployeesComponent } from './components/pages/admin/employees/employees.component';
import { AdminRolesComponent } from './components/pages/admin/admin-roles/admin-roles.component';
import { AddEventComponent } from './components/pages/admin/events/add-event/add-event.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent,
    children: [
      { path: 'events', component: LoginComponent },
      { path: 'events/:id', component: LoginComponent }
] },
  { path: 'signup', component: SignupComponent },
  {
    path: 'admin', 
    component: AdminComponent,
    children: [
      {path: '', redirectTo: 'dashboard', pathMatch: 'full'},
      {path:'dashboard',component:DashboardComponent},
      {path:'events',component:EventsComponent},
      {path:'employees',component:EmployeesComponent},
      {path: 'admin-roles', component: AdminRolesComponent},
      {path: 'add-event', component: AddEventComponent}
  ]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
